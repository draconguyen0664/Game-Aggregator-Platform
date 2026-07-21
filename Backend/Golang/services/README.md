# Go runtime services

Each service owns its own executable and folder:

- `api-gateway`: API-key enforcement, Redis rate/quota checks, Spring reverse proxy, Prometheus metrics and Kafka usage publication.
- `analytics-consumer`: idempotent Kafka consumption, MySQL minute/hour/day aggregates and Redis dashboard cache.
- `log-ingestion`: authenticated ingestion, schema validation, recursive secret masking, bounded buffering, Kafka batching/retry/DLQ.
- `realtime-monitoring`: authenticated SSE stream for traffic, deployment, health and incident events.

Run `go test ./...` from `Backend/Golang` after installing Go 1.26+, or build the services through Docker Compose.