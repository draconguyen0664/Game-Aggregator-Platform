package main

import (
	"context"
	"crypto/subtle"
	"encoding/json"
	"errors"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/segmentio/kafka-go"
	"log/slog"
	"net/http"
	"os"
	"strings"
	"time"
)

type logEvent struct {
	EventID   string         `json:"eventId"`
	Timestamp time.Time      `json:"timestamp"`
	Level     string         `json:"level"`
	Service   string         `json:"service"`
	Message   string         `json:"message"`
	Fields    map[string]any `json:"fields,omitempty"`
}
type app struct {
	queue       chan logEvent
	writer, dlq *kafka.Writer
	token       string
	log         *slog.Logger
}

func main() {
	brokers := strings.Split(env("KAFKA_BROKERS", "localhost:9092"), ",")
	a := &app{queue: make(chan logEvent, 10000), writer: &kafka.Writer{Addr: kafka.TCP(brokers...), Topic: "application-logs", BatchSize: 500, BatchTimeout: time.Second, Balancer: &kafka.Hash{}}, dlq: &kafka.Writer{Addr: kafka.TCP(brokers...), Topic: "log-dead-letter-events", Balancer: &kafka.Hash{}}, token: required("LOG_INGEST_TOKEN"), log: slog.New(slog.NewJSONHandler(os.Stdout, nil))}
	go a.worker(context.Background())
	r := chi.NewRouter()
	r.Use(middleware.RequestID, middleware.Recoverer, middleware.Timeout(10*time.Second))
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(200) })
	r.Handle("/metrics", promhttp.Handler())
	r.Post("/v1/logs", a.ingest)
	addr := env("HTTP_ADDR", ":8080")
	a.log.Info("log ingestion starting", "address", addr)
	if e := http.ListenAndServe(addr, r); e != nil {
		panic(e)
	}
}
func (a *app) ingest(w http.ResponseWriter, r *http.Request) {
	provided := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	if subtle.ConstantTimeCompare([]byte(provided), []byte(a.token)) != 1 {
		http.Error(w, "unauthorized", 401)
		return
	}
	r.Body = http.MaxBytesReader(w, r.Body, 2<<20)
	var events []logEvent
	if e := json.NewDecoder(r.Body).Decode(&events); e != nil || len(events) == 0 || len(events) > 1000 {
		http.Error(w, "invalid log batch", 400)
		return
	}
	for i := range events {
		if e := validate(events[i]); e != nil {
			http.Error(w, e.Error(), 400)
			return
		}
		events[i].Fields = maskMap(events[i].Fields)
	}
	for _, e := range events {
		select {
		case a.queue <- e:
		default:
			http.Error(w, "ingestion backpressure", 429)
			return
		}
	}
	w.WriteHeader(202)
}
func (a *app) worker(ctx context.Context) {
	batch := make([]logEvent, 0, 500)
	ticker := time.NewTicker(time.Second)
	for {
		select {
		case e := <-a.queue:
			batch = append(batch, e)
			if len(batch) >= 500 {
				a.flush(ctx, batch)
				batch = batch[:0]
			}
		case <-ticker.C:
			if len(batch) > 0 {
				a.flush(ctx, batch)
				batch = batch[:0]
			}
		}
	}
}
func (a *app) flush(ctx context.Context, events []logEvent) {
	msgs := make([]kafka.Message, 0, len(events))
	for _, e := range events {
		b, _ := json.Marshal(e)
		msgs = append(msgs, kafka.Message{Key: []byte(e.Service), Value: b, Time: e.Timestamp})
	}
	var err error
	for attempt := 0; attempt < 5; attempt++ {
		c, cancel := context.WithTimeout(ctx, 10*time.Second)
		err = a.writer.WriteMessages(c, msgs...)
		cancel()
		if err == nil {
			return
		}
		time.Sleep(time.Duration(1<<attempt) * time.Second)
	}
	a.log.Error("log batch moved to dead letter", "error", err, "count", len(events))
	for _, m := range msgs {
		m.Headers = []kafka.Header{{Key: "failure", Value: []byte(err.Error())}}
		c, cancel := context.WithTimeout(ctx, 5*time.Second)
		_ = a.dlq.WriteMessages(c, m)
		cancel()
	}
}
func validate(e logEvent) error {
	if e.EventID == "" || e.Timestamp.IsZero() || e.Service == "" || e.Message == "" {
		return errors.New("eventId, timestamp, service and message are required")
	}
	switch e.Level {
	case "DEBUG", "INFO", "WARN", "ERROR":
		return nil
	default:
		return errors.New("invalid log level")
	}
}
func maskMap(m map[string]any) map[string]any {
	for k, v := range m {
		lower := strings.ToLower(k)
		if strings.Contains(lower, "password") || strings.Contains(lower, "token") || strings.Contains(lower, "secret") || strings.Contains(lower, "authorization") {
			m[k] = "***REDACTED***"
			continue
		}
		switch x := v.(type) {
		case map[string]any:
			m[k] = maskMap(x)
		case []any:
			for i, item := range x {
				if child, ok := item.(map[string]any); ok {
					x[i] = maskMap(child)
				}
			}
		}
	}
	return m
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
