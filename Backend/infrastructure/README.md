# Local infrastructure

Copy `docker/.env.example` to `docker/.env`, replace every development secret, then validate with:

```bash
docker compose --env-file docker/.env -f docker/compose.yml config
```

Start only after enough disk space is available:

```bash
docker compose --env-file docker/.env -f docker/compose.yml up -d
```

Local endpoints: MySQL `3306`, Redis `6379`, Kafka `9092`, Kafka UI `8085`, MinIO API `9000`, MinIO Console `9001`, Prometheus `9090`, Grafana `3001`, Loki `3100`, OTLP gRPC `4317`, and OTLP HTTP `4318`.
