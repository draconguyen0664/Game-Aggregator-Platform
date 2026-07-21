package main

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/redis/go-redis/v9"
	"github.com/segmentio/kafka-go"
	"log/slog"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"
)

type keyMeta struct {
	APIKeyID      string     `json:"apiKeyId"`
	TenantID      string     `json:"tenantId"`
	ClientID      string     `json:"clientId"`
	EnvironmentID string     `json:"environmentId"`
	Scopes        []string   `json:"scopes"`
	IPAllowlist   []string   `json:"ipAllowlist"`
	Quota         int64      `json:"quota"`
	Status        string     `json:"status"`
	ExpiresAt     *time.Time `json:"expiresAt"`
}
type route struct {
	Prefix     string `json:"prefix"`
	Upstream   string `json:"upstream"`
	Scope      string `json:"scope"`
	ReadScope  string `json:"readScope"`
	WriteScope string `json:"writeScope"`
}
type usageEvent struct {
	EventID       string    `json:"eventId"`
	RequestID     string    `json:"requestId"`
	TenantID      string    `json:"tenantId"`
	ClientID      string    `json:"clientId"`
	GameID        string    `json:"gameId"`
	APIKeyID      string    `json:"apiKeyId"`
	Endpoint      string    `json:"endpoint"`
	Method        string    `json:"method"`
	StatusCode    int       `json:"statusCode"`
	LatencyMs     int64     `json:"latencyMs"`
	RequestBytes  int64     `json:"requestBytes"`
	ResponseBytes int64     `json:"responseBytes"`
	Timestamp     time.Time `json:"timestamp"`
}
type app struct {
	redis    *redis.Client
	kafka    *kafka.Writer
	pepper   string
	routes   []route
	logger   *slog.Logger
	requests *prometheus.CounterVec
	latency  *prometheus.HistogramVec
}
type responseRecorder struct {
	http.ResponseWriter
	status int
	bytes  int64
}

func (w *responseRecorder) WriteHeader(s int) { w.status = s; w.ResponseWriter.WriteHeader(s) }
func (w *responseRecorder) Write(b []byte) (int, error) {
	if w.status == 0 {
		w.status = 200
	}
	n, e := w.ResponseWriter.Write(b)
	w.bytes += int64(n)
	return n, e
}

const rateScript = `local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[2]) end; if n>tonumber(ARGV[1]) then return 0 end; return n`

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	rdb := redis.NewClient(&redis.Options{Addr: env("REDIS_ADDR", "localhost:6379"), Password: os.Getenv("REDIS_PASSWORD")})
	routes := loadRoutes()
	a := &app{redis: rdb, pepper: required("API_KEY_PEPPER"), routes: routes, logger: logger, kafka: &kafka.Writer{Addr: kafka.TCP(strings.Split(env("KAFKA_BROKERS", "localhost:9092"), ",")...), Topic: "api-usage-events", Balancer: &kafka.Hash{}}, requests: prometheus.NewCounterVec(prometheus.CounterOpts{Name: "gateway_requests_total", Help: "Gateway requests"}, []string{"endpoint", "status"}), latency: prometheus.NewHistogramVec(prometheus.HistogramOpts{Name: "gateway_request_duration_seconds", Help: "Gateway latency"}, []string{"endpoint"})}
	prometheus.MustRegister(a.requests, a.latency)
	router := chi.NewRouter()
	router.Use(middleware.RequestID, middleware.Recoverer, middleware.Timeout(30*time.Second))
	router.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		if err := rdb.Ping(r.Context()).Err(); err != nil {
			http.Error(w, "redis unavailable", 503)
			return
		}
		w.WriteHeader(200)
	})
	router.Handle("/metrics", promhttp.Handler())
	router.Handle("/*", a.gateway())
	router.Handle("/", a.gateway())
	addr := env("HTTP_ADDR", ":8080")
	logger.Info("api gateway starting", "address", addr)
	if err := http.ListenAndServe(addr, router); err != nil {
		logger.Error("server stopped", "error", err)
		os.Exit(1)
	}
}
func (a *app) gateway() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		started := time.Now()
		requestID := middleware.GetReqID(r.Context())
		raw := strings.TrimSpace(r.Header.Get("X-API-Key"))
		if raw == "" {
			fail(w, 401, "MISSING_API_KEY")
			return
		}
		hash := hashKey(a.pepper, raw)
		data, err := a.redis.Get(r.Context(), "api-key:"+hash).Bytes()
		if err != nil {
			fail(w, 401, "INVALID_API_KEY")
			return
		}
		var meta keyMeta
		if json.Unmarshal(data, &meta) != nil || meta.Status != "ACTIVE" || (meta.ExpiresAt != nil && !meta.ExpiresAt.After(time.Now())) {
			fail(w, 401, "INACTIVE_API_KEY")
			return
		}
		if envID := r.Header.Get("X-Environment-ID"); envID == "" || envID != meta.EnvironmentID {
			fail(w, 403, "ENVIRONMENT_MISMATCH")
			return
		}
		ip, _, _ := net.SplitHostPort(r.RemoteAddr)
		if !allowedIP(ip, meta.IPAllowlist) {
			fail(w, 403, "IP_NOT_ALLOWED")
			return
		}
		rt, ok := matchRoute(a.routes, r.URL.Path)
		if !ok {
			fail(w, 404, "NO_ROUTE")
			return
		}
		if !hasScope(meta.Scopes, scopeFor(rt, r.Method)) {
			fail(w, 403, "MISSING_SCOPE")
			return
		}
		minute := time.Now().UTC().Format("200601021504")
		endpoint := r.Method + ":" + rt.Prefix
		limit := int64(60)
		if v := os.Getenv("RATE_LIMIT_PER_MINUTE"); v != "" {
			limit, _ = strconv.ParseInt(v, 10, 64)
		}
		allowed, e := a.redis.Eval(r.Context(), rateScript, []string{"rate:" + meta.APIKeyID + ":" + endpoint + ":" + minute}, limit, 120).Int64()
		if e != nil || allowed == 0 {
			fail(w, 429, "RATE_LIMITED")
			return
		}
		day := time.Now().UTC().Format("20060102")
		quota, e := a.redis.Eval(r.Context(), rateScript, []string{"quota:" + meta.APIKeyID + ":" + day}, meta.Quota, 172800).Int64()
		if e != nil || quota == 0 {
			fail(w, 429, "QUOTA_EXCEEDED")
			return
		}
		target, _ := url.Parse(rt.Upstream)
		proxy := httputil.NewSingleHostReverseProxy(target)
		proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, e error) { fail(w, 502, "UPSTREAM_UNAVAILABLE") }
		r.Header.Del("X-API-Key")
		r.Header.Set("X-Request-ID", requestID)
		r.Header.Set("X-Tenant-ID", meta.TenantID)
		r.Header.Set("X-Client-ID", meta.ClientID)
		r.Header.Set("X-Environment-ID", meta.EnvironmentID)
		rec := &responseRecorder{ResponseWriter: w}
		proxy.ServeHTTP(rec, r)
		latency := time.Since(started)
		status := rec.status
		if status == 0 {
			status = 200
		}
		a.requests.WithLabelValues(endpoint, strconv.Itoa(status)).Inc()
		a.latency.WithLabelValues(endpoint).Observe(latency.Seconds())
		evt := usageEvent{EventID: requestID, RequestID: requestID, TenantID: meta.TenantID, ClientID: meta.ClientID, GameID: r.Header.Get("X-Game-ID"), APIKeyID: meta.APIKeyID, Endpoint: r.URL.Path, Method: r.Method, StatusCode: status, LatencyMs: latency.Milliseconds(), RequestBytes: max(0, r.ContentLength), ResponseBytes: rec.bytes, Timestamp: time.Now().UTC()}
		payload, _ := json.Marshal(evt)
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer cancel()
		if err := a.kafka.WriteMessages(ctx, kafka.Message{Key: []byte(meta.APIKeyID), Value: payload}); err != nil {
			a.logger.Error("usage event publish failed", "error", err, "requestId", requestID)
		}
	})
}
func loadRoutes() []route {
	raw := env("GATEWAY_ROUTES", `[{"prefix":"/","upstream":"http://localhost:8088","scope":"game:read"}]`)
	var r []route
	if json.Unmarshal([]byte(raw), &r) != nil || len(r) == 0 {
		panic("invalid GATEWAY_ROUTES")
	}
	for _, x := range r {
		if _, e := url.ParseRequestURI(x.Upstream); e != nil {
			panic(e)
		}
	}
	sort.Slice(r, func(i, j int) bool { return len(r[i].Prefix) > len(r[j].Prefix) })
	return r
}
func scopeFor(r route, method string) string {
	if method == "GET" || method == "HEAD" {
		if r.ReadScope != "" {
			return r.ReadScope
		}
	} else if r.WriteScope != "" {
		return r.WriteScope
	}
	return r.Scope
}
func matchRoute(routes []route, path string) (route, bool) {
	for _, r := range routes {
		if strings.HasPrefix(path, r.Prefix) {
			return r, true
		}
	}
	return route{}, false
}
func hashKey(pepper, raw string) string {
	h := sha256.New()
	h.Write([]byte(pepper))
	h.Write([]byte(raw))
	return hex.EncodeToString(h.Sum(nil))
}
func hasScope(scopes []string, needed string) bool {
	if needed == "" {
		return true
	}
	for _, s := range scopes {
		if s == needed || s == "*" {
			return true
		}
		if strings.HasSuffix(s, ":*") && strings.HasPrefix(needed, strings.TrimSuffix(s, "*")) {
			return true
		}
	}
	return false
}
func allowedIP(ip string, rules []string) bool {
	if len(rules) == 0 {
		return true
	}
	parsed := net.ParseIP(ip)
	for _, x := range rules {
		if x == ip {
			return true
		}
		if _, n, e := net.ParseCIDR(x); e == nil && n.Contains(parsed) {
			return true
		}
	}
	return false
}
func fail(w http.ResponseWriter, status int, code string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	fmt.Fprintf(w, `{"success":false,"error":{"code":%q}}`, code)
}
func env(k, d string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return d
}
func required(k string) string {
	v := os.Getenv(k)
	if len(v) < 32 {
		panic(errors.New(k + " must contain at least 32 characters"))
	}
	return v
}
func max(a, b int64) int64 {
	if a > b {
		return a
	}
	return b
}
