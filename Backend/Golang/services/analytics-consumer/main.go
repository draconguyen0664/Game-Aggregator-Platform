package main

import (
	"context"
	"database/sql"
	"encoding/json"
	_ "github.com/go-sql-driver/mysql"
	"github.com/redis/go-redis/v9"
	"github.com/segmentio/kafka-go"
	"log/slog"
	"os"
	"strings"
	"time"
)

type usage struct {
	EventID       string    `json:"eventId"`
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

func main() {
	ctx := context.Background()
	log := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	db, err := sql.Open("mysql", required("MYSQL_DSN"))
	must(err)
	defer db.Close()
	must(db.PingContext(ctx))
	must(ensureSchema(ctx, db))
	cache := redis.NewClient(&redis.Options{Addr: env("REDIS_ADDR", "localhost:6379"), Password: os.Getenv("REDIS_PASSWORD")})
	reader := kafka.NewReader(kafka.ReaderConfig{Brokers: strings.Split(env("KAFKA_BROKERS", "localhost:9092"), ","), Topic: "api-usage-events", GroupID: "analytics-consumer", MinBytes: 1, MaxBytes: 10e6, MaxWait: time.Second})
	defer reader.Close()
	batch := make([]kafka.Message, 0, 200)
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()
	for {
		fetchCtx, cancel := context.WithTimeout(ctx, 500*time.Millisecond)
		m, e := reader.FetchMessage(fetchCtx)
		cancel()
		if e == nil {
			batch = append(batch, m)
		}
		if len(batch) >= 200 || len(batch) > 0 && tick(ticker.C) {
			if err := saveBatch(ctx, db, cache, batch); err != nil {
				log.Error("aggregate batch failed", "error", err)
				time.Sleep(time.Second)
				continue
			}
			for _, msg := range batch {
				must(reader.CommitMessages(ctx, msg))
			}
			batch = batch[:0]
		}
	}
}
func saveBatch(ctx context.Context, db *sql.DB, cache *redis.Client, msgs []kafka.Message) error {
	tx, e := db.BeginTx(ctx, nil)
	if e != nil {
		return e
	}
	defer tx.Rollback()
	for _, m := range msgs {
		var u usage
		if e = json.Unmarshal(m.Value, &u); e != nil {
			return e
		}
		res, e := tx.ExecContext(ctx, "INSERT IGNORE INTO consumed_usage_events(event_id,consumed_at) VALUES(?,NOW(6))", u.EventID)
		if e != nil {
			return e
		}
		n, _ := res.RowsAffected()
		if n == 0 {
			continue
		}
		for _, p := range []struct {
			name  string
			start time.Time
		}{{"MINUTE", u.Timestamp.UTC().Truncate(time.Minute)}, {"HOUR", u.Timestamp.UTC().Truncate(time.Hour)}, {"DAY", time.Date(u.Timestamp.UTC().Year(), u.Timestamp.UTC().Month(), u.Timestamp.UTC().Day(), 0, 0, 0, 0, time.UTC)}} {
			_, e = tx.ExecContext(ctx, `INSERT INTO usage_aggregates(period_type,period_start,tenant_id,client_id,game_id,api_key_id,endpoint,method,request_count,error_count,latency_ms_sum,request_bytes,response_bytes) VALUES(?,?,?,?,?,?,?,?,1,?,?,?,?) ON DUPLICATE KEY UPDATE request_count=request_count+1,error_count=error_count+VALUES(error_count),latency_ms_sum=latency_ms_sum+VALUES(latency_ms_sum),request_bytes=request_bytes+VALUES(request_bytes),response_bytes=response_bytes+VALUES(response_bytes)`, p.name, p.start, u.TenantID, u.ClientID, u.GameID, u.APIKeyID, u.Endpoint, u.Method, boolInt(u.StatusCode >= 400), u.LatencyMs, u.RequestBytes, u.ResponseBytes)
			if e != nil {
				return e
			}
		}
	}
	if e = tx.Commit(); e != nil {
		return e
	}
	for _, m := range msgs {
		var u usage
		if json.Unmarshal(m.Value, &u) == nil {
			key := "dashboard:usage:" + u.TenantID
			cache.HIncrBy(ctx, key, "requests", 1)
			if u.StatusCode >= 400 {
				cache.HIncrBy(ctx, key, "errors", 1)
			}
			cache.HIncrBy(ctx, key, "latencyMs", u.LatencyMs)
			cache.Expire(ctx, key, 48*time.Hour)
		}
	}
	return nil
}
func tick(c <-chan time.Time) bool {
	select {
	case <-c:
		return true
	default:
		return false
	}
}
func boolInt(v bool) int {
	if v {
		return 1
	}
	return 0
}
func env(k, d string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return d
}
func required(k string) string {
	v := os.Getenv(k)
	if v == "" {
		panic(k + " is required")
	}
	return v
}
func must(e error) {
	if e != nil {
		panic(e)
	}
}
func ensureSchema(ctx context.Context, db *sql.DB) error {
	for _, q := range []string{`CREATE TABLE IF NOT EXISTS consumed_usage_events(event_id VARCHAR(255) PRIMARY KEY,consumed_at TIMESTAMP(6) NOT NULL)`, `CREATE TABLE IF NOT EXISTS usage_aggregates(id BIGINT AUTO_INCREMENT PRIMARY KEY,period_type VARCHAR(10) NOT NULL,period_start TIMESTAMP NOT NULL,tenant_id VARCHAR(36) NOT NULL,client_id VARCHAR(36) NOT NULL,game_id VARCHAR(36) NOT NULL,api_key_id VARCHAR(36) NOT NULL,endpoint VARCHAR(191) NOT NULL,method VARCHAR(10) NOT NULL,request_count BIGINT NOT NULL,error_count BIGINT NOT NULL,latency_ms_sum BIGINT NOT NULL,request_bytes BIGINT NOT NULL,response_bytes BIGINT NOT NULL,UNIQUE(period_type,period_start,tenant_id,client_id,game_id,api_key_id,endpoint,method))`} {
		if _, e := db.ExecContext(ctx, q); e != nil {
			return e
		}
	}
	return nil
}
