package main

import (
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"golang.org/x/time/rate"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	limiter := rate.NewLimiter(rate.Limit(100), 200)
	router := chi.NewRouter()
	router.Use(middleware.RequestID, middleware.Recoverer, middleware.Timeout(30*time.Second))
	router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if !limiter.Allow() {
				http.Error(w, "rate limit exceeded", http.StatusTooManyRequests)
				return
			}
			next.ServeHTTP(w, r)
		})
	})
	router.Get("/health", func(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(http.StatusOK) })
	router.Handle("/metrics", promhttp.Handler())
	logger.Info("starting HTTP server", "address", ":8080")
	if err := http.ListenAndServe(":8080", router); err != nil {
		logger.Error("server stopped", "error", err)
		os.Exit(1)
	}
}
