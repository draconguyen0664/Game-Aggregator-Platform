package main

import (
	"context"
	"crypto/subtle"
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/segmentio/kafka-go"
	"log/slog"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

type envelope struct {
	Type      string          `json:"type"`
	Timestamp time.Time       `json:"timestamp"`
	Data      json.RawMessage `json:"data"`
}
type usage struct {
	StatusCode int   `json:"statusCode"`
	LatencyMs  int64 `json:"latencyMs"`
}
type snapshot struct {
	Requests, Errors, LatencyMs int64     `json:"requests"`
	UpdatedAt                   time.Time `json:"updatedAt"`
}
type hub struct {
	mu      sync.RWMutex
	clients map[chan []byte]struct{}
	stats   snapshot
	log     *slog.Logger
}

func main() {
	log := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	h := &hub{clients: map[chan []byte]struct{}{}, log: log}
	ctx := context.Background()
	go h.consume(ctx)
	r := chi.NewRouter()
	r.Use(middleware.RequestID, middleware.Recoverer)
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(200) })
	r.Handle("/metrics", promhttp.Handler())
	token := required("MONITORING_TOKEN")
	r.Group(func(r chi.Router) {
		r.Use(auth(token))
		r.Get("/v1/events", h.sse)
		r.Get("/v1/snapshot", h.getSnapshot)
	})
	addr := env("HTTP_ADDR", ":8080")
	log.Info("real-time monitoring starting", "address", addr)
	if e := http.ListenAndServe(addr, r); e != nil {
		panic(e)
	}
}
func (h *hub) consume(ctx context.Context) {
	reader := kafka.NewReader(kafka.ReaderConfig{Brokers: strings.Split(env("KAFKA_BROKERS", "localhost:9092"), ","), GroupID: "realtime-monitoring", GroupTopics: []string{"api-usage-events", "deployment-events", "incident-events", "server-health-events"}, MinBytes: 1, MaxBytes: 10e6})
	defer reader.Close()
	for {
		m, e := reader.ReadMessage(ctx)
		if e != nil {
			h.log.Error("kafka read failed", "error", e)
			time.Sleep(time.Second)
			continue
		}
		kind := topicType(m.Topic)
		if m.Topic == "api-usage-events" {
			var u usage
			if json.Unmarshal(m.Value, &u) == nil {
				h.mu.Lock()
				h.stats.Requests++
				if u.StatusCode >= 400 {
					h.stats.Errors++
				}
				h.stats.LatencyMs += u.LatencyMs
				h.stats.UpdatedAt = time.Now().UTC()
				h.mu.Unlock()
			}
		}
		payload, _ := json.Marshal(envelope{Type: kind, Timestamp: time.Now().UTC(), Data: m.Value})
		h.broadcast(payload)
	}
}
func (h *hub) broadcast(data []byte) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	for c := range h.clients {
		select {
		case c <- data:
		default:
			h.log.Warn("slow monitoring client dropped event")
		}
	}
}
func (h *hub) sse(w http.ResponseWriter, r *http.Request) {
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "stream unsupported", 500)
		return
	}
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	ch := make(chan []byte, 256)
	h.mu.Lock()
	h.clients[ch] = struct{}{}
	h.mu.Unlock()
	defer func() { h.mu.Lock(); delete(h.clients, ch); h.mu.Unlock(); close(ch) }()
	heartbeat := time.NewTicker(15 * time.Second)
	defer heartbeat.Stop()
	for {
		select {
		case data := <-ch:
			fmt.Fprintf(w, "event: monitoring\ndata: %s\n\n", data)
			flusher.Flush()
		case <-heartbeat.C:
			fmt.Fprint(w, ": heartbeat\n\n")
			flusher.Flush()
		case <-r.Context().Done():
			return
		}
	}
}
func (h *hub) getSnapshot(w http.ResponseWriter, r *http.Request) {
	h.mu.RLock()
	s := h.stats
	h.mu.RUnlock()
	avg := int64(0)
	if s.Requests > 0 {
		avg = s.LatencyMs / s.Requests
	}
	json.NewEncoder(w).Encode(map[string]any{"requests": s.Requests, "errors": s.Errors, "errorRate": ratio(s.Errors, s.Requests), "averageLatencyMs": avg, "updatedAt": s.UpdatedAt})
}
func auth(token string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			got := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
			if subtle.ConstantTimeCompare([]byte(got), []byte(token)) != 1 {
				http.Error(w, "unauthorized", 401)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
func topicType(t string) string {
	switch t {
	case "api-usage-events":
		return "API_TRAFFIC"
	case "deployment-events":
		return "DEPLOYMENT_STATUS"
	case "incident-events":
		return "INCIDENT"
	default:
		return "SERVER_HEALTH"
	}
}
func ratio(a, b int64) float64 {
	if b == 0 {
		return 0
	}
	return float64(a) / float64(b)
}
func env(k, d string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return d
}
func required(k string) string {
	v := os.Getenv(k)
	if len(v) < 24 {
		panic(k + " must contain at least 24 characters")
	}
	return v
}
