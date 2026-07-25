# Game Aggregator Platform

A microservice-based game management platform that includes administration, studio, client, and mobile applications, an API Gateway, and services for publishing, contracts, revenue, billing, webhooks, and observability.

## Core Components

- **Java backend:** Spring Boot, Spring Security, JPA/Hibernate, Flyway, Redis, Kafka, OpenAPI, and Actuator.
- **Go backend:** API Gateway, rate limiting, usage metering, analytics consumption, log ingestion, and real-time monitoring.
- **Web:** Three independent Next.js applications: Platform Admin Portal, Studio Portal, and Client Portal.
- **Mobile:** React Native with Expo Router.
- **Infrastructure:** MySQL, Redis, Kafka, Kafka UI, MinIO, and Docker Compose.
- **Observability:** Prometheus, Grafana, Loki, Tempo, and OpenTelemetry Collector.

## Repository Structure

```text
Game-Aggregator-Platform/
|-- Backend/
|   |-- Golang/                 # Go foundation and four Go services
|   |-- Spring Boot/            # Spring Boot template
|   |-- packages/platform-core/ # Shared foundation for Java services
|   |-- services/               # 22 independent Spring Boot microservices
|   |-- database/               # General migrations and seed data
|   |-- infrastructure/
|   |   |-- docker/             # Docker Compose and environment template
|   |   |-- monitoring/         # Prometheus, Grafana, Loki, Tempo, and OTel
|   |   `-- mysql/              # Service database initialization
|   `-- pom.xml                 # Maven reactor
|-- Front End/
|   |-- Web/
|   |   |-- apps/                # Admin, studio, and client Next.js portals
|   |   `-- packages/            # UI, tokens, API, auth, types, and validation
|   `-- Mobile/
`-- .github/workflows/backend-ci.yml
```

Each microservice and portal lives in its own directory and can be developed, tested, built, and deployed independently.

## Project Inventory

<!-- BEGIN GENERATED PROJECT INVENTORY -->
<!-- This section is maintained by scripts/update-readme.ps1. -->

| Component | Count | Projects |
|---|---:|---|
| Spring Boot services | 22 | `api-key-service`, `audit-service`, `authorization-service`, `auth-service`, `billing-service`, `build-service`, `client-service`, `contract-service`, `deployment-service`, `entitlement-service`, `feature-flag-service`, `game-media-service`, `game-service`, `incident-service`, `ledger-service`, `publisher-service`, `release-service`, `revenue-service`, `studio-service`, `tenant-service`, `version-service`, `webhook-service` |
| Go services | 4 | `analytics-consumer`, `api-gateway`, `log-ingestion`, `realtime-monitoring` |
| Web portals | 3 | `admin-web`, `client-web`, `studio-web` |
<!-- END GENERATED PROJECT INVENTORY -->

## System Requirements

To run the complete stack with Docker:

- Git
- Docker Desktop with Docker Compose v2
- At least 12 GB of memory allocated to Docker is recommended because the full stack runs more than 30 containers

For local development:

- Java 21 or later and Maven 3.9+
- The Go version specified in `Backend/Golang/go.mod`
- Node.js 20+ and npm 10+
- Expo Go or Android Studio/Xcode for native mobile development

## Quick Start: Run the Backend with Docker

### 1. Clone the Repository

```bash
git clone https://github.com/draconguyen0664/Game-Aggregator-Platform.git
cd Game-Aggregator-Platform
```

### 2. Create the Environment File

PowerShell:

```powershell
Copy-Item "Backend/infrastructure/docker/.env.example" "Backend/infrastructure/docker/.env"
```

Bash:

```bash
cp Backend/infrastructure/docker/.env.example Backend/infrastructure/docker/.env
```

Open `.env` and replace every `change-*` or `replace-*` value with a strong secret. Never commit this file.

Required variables include:

- `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`
- `REDIS_PASSWORD`
- `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`
- `GRAFANA_ADMIN_USER`, `GRAFANA_ADMIN_PASSWORD`
- `JWT_SECRET`, `INTERNAL_REGISTRATION_KEY`
- `API_KEY_PEPPER`, `WEBHOOK_MASTER_KEY`
- `LOG_INGEST_TOKEN`, `MONITORING_TOKEN`

Generate a random secret with PowerShell:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
```

### 3. Package the Spring Boot Services

The Java service Docker images use JAR files from their `target` directories. Package the services before the first Docker build:

```powershell
cd Backend
mvn -DskipTests package
cd infrastructure/docker
```

### 4. Build and Start the Stack

```powershell
docker compose --env-file .env up -d --build
```

The first run may take several minutes while Docker downloads images and builds the services.

### 5. Verify the Stack

```powershell
docker compose --env-file .env ps
docker compose --env-file .env logs -f --tail=100
```

Check the API Gateway:

```powershell
curl.exe http://localhost:8080/health
```

Check a Spring service:

```powershell
curl.exe http://localhost:8081/actuator/health
```

## Service Ports

<!-- BEGIN GENERATED SERVICE PORTS -->
<!-- This section is maintained by scripts/update-readme.ps1. -->

| Port | Service |
|---:|---|
| 8080 | `go-api-gateway` |
| 8081 | `auth-service` |
| 8082 | `tenant-service` |
| 8083 | `authorization-service` |
| 8084 | `studio-service` |
| 8085 | `kafka-ui` |
| 8086 | `publisher-service` |
| 8087 | `client-service` |
| 8088 | `game-service` |
| 8089 | `game-media-service` |
| 8090 | `entitlement-service` |
| 8091 | `api-key-service` |
| 8092 | `version-service` |
| 8093 | `build-service` |
| 8094 | `release-service` |
| 8095 | `deployment-service` |
| 8096 | `contract-service` |
| 8097 | `revenue-service` |
| 8098 | `ledger-service` |
| 8099 | `billing-service` |
| 8100 | `webhook-service` |
| 8101 | `audit-service` |
| 8102 | `incident-service` |
| 8103 | `feature-flag-service` |
| 8104 | `go-log-ingestion` |
| 8105 | `go-realtime-monitoring` |
| 8889 | `otel-collector` |
<!-- END GENERATED SERVICE PORTS -->

Infrastructure and monitoring:

| URL/Port | Service |
|---|---|
| `localhost:3307` | MySQL in Docker |
| `localhost:6379` | Redis |
| `localhost:9092` | Kafka |
| http://localhost:8085 | Kafka UI |
| http://localhost:9000 | MinIO API |
| http://localhost:9001 | MinIO Console |
| http://localhost:9090 | Prometheus |
| http://localhost:3001 | Grafana |
| http://localhost:3100 | Loki |
| http://localhost:3200 | Tempo |
| `localhost:4317/4318` | OpenTelemetry Collector |

Credentials are read from the local `.env` file.

## Database and Migrations

- Docker exposes MySQL on host port `3307` to avoid conflicts with local MySQL installations that commonly use `3306`.
- `Backend/infrastructure/mysql/init/001_create_service_databases.sql` creates a separate database for each service.
- Each Spring service manages its own tables with Flyway migrations in `src/main/resources/db/migration`.
- The backend creates and updates tables through migrations. MySQL must be running, and the required databases and users must exist.
- Never modify a migration that has already run in production. Create a new migration version instead.

## Run and Test the Backend without Docker

### Java/Spring Boot

Build the complete Maven reactor:

```powershell
cd Backend
mvn clean verify
```

Run a single service, such as the authentication service:

```powershell
mvn -pl services/auth-service -am spring-boot:run
```

For local execution, configure `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `REDIS_PASSWORD`, `KAFKA_BOOTSTRAP_SERVERS`, and the relevant secrets. Default values in the source code are intended for development only.

### Go

```powershell
cd Backend/Golang
go mod download
go test ./...
go build ./...
```

Run only the API Gateway:

```powershell
go run ./services/api-gateway
```

## Run the Web Applications

The three portals are independent Next.js applications in a pnpm and Turborepo workspace.

Install dependencies once:

```powershell
cd "Front End/Web"
corepack enable
pnpm install
```

Run the Platform Admin Portal:

```powershell
pnpm --filter platform-admin-portal dev
```

Run the Studio Portal:

```powershell
pnpm --filter studio-portal dev
```

Run the Client Portal:

```powershell
pnpm --filter client-portal dev
```

Run all portals in parallel:

```powershell
pnpm dev
```

Common workspace commands:

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Run the shared design system:

```powershell
pnpm --filter @game-aggregator/ui-web storybook
```

Generate the typed API client from OpenAPI:

```powershell
$env:OPENAPI_URL = "http://localhost:8081/v3/api-docs"
pnpm generate:api
```

## Run the Mobile Application

```powershell
cd "Front End/Mobile"
npm install
npm run start
```

Other available commands:

```powershell
npm run android
npm run ios
npm run web
npm run lint
npm run typecheck
npm run test
```

`npm run ios` requires macOS and Xcode. Android requires an emulator or a physical device. You can also scan the QR code with Expo Go.

## API, Authentication, and Multi-Tenancy

- External requests enter through the Go API Gateway on port `8080`.
- A raw API key is displayed only once. The database stores only its hash, prefix, and metadata.
- Before forwarding a request, the gateway validates the API key, status, environment, scope, IP allowlist, rate limit, and quota.
- Spring services handle authentication, authorization, tenant isolation, and business logic.
- Actuator health endpoints are available at `/actuator/health`.
- A running Spring service usually exposes OpenAPI at `/swagger-ui/index.html` and `/v3/api-docs`.

## Observability

- Prometheus collects metrics from the Go and Spring services.
- Grafana is provisioned with Prometheus, Loki, and Tempo data sources.
- Loki stores logs, while Tempo stores distributed traces.
- OpenTelemetry Collector accepts OTLP traffic on ports `4317` and `4318`.

Review Prometheus targets at http://localhost:9090/targets. Every configured target should report an `UP` state.

## Stop, Restart, and Remove Data

Stop the containers while preserving volumes and data:

```powershell
docker compose --env-file .env down
```

Restart the stack:

```powershell
docker compose --env-file .env up -d
```

Remove all local volumes and data, including MySQL, Redis, Kafka, MinIO, and Grafana:

```powershell
docker compose --env-file .env down -v
```

> Warning: `down -v` permanently deletes local data unless it has been backed up.

## Troubleshooting

### A Port Is Already in Use

```powershell
netstat -ano | Select-String ':8080|:3307|:6379|:9092'
```

Stop the process using the port or change the host port in `compose.yml`.

### A Service Is Running but Its Health Endpoint Does Not Respond

```powershell
docker compose --env-file .env ps
docker compose --env-file .env logs --tail=200 <service-name>
```

### MySQL Reports `Too many connections`

The Compose configuration limits each Spring service's Hikari pool and increases MySQL's `max-connections` setting. Make sure you are using the latest `compose.yml`, then recreate the containers:

```powershell
docker compose --env-file .env up -d --force-recreate mysql
docker compose --env-file .env up -d --force-recreate
```

### Docker Still Runs Old Java Code

```powershell
cd Backend
mvn -DskipTests package
cd infrastructure/docker
docker compose --env-file .env up -d --build --force-recreate
```

### Reset the Development Environment

Run these commands only when you accept losing all local Docker data:

```powershell
docker compose --env-file .env down -v
docker compose --env-file .env up -d --build
```

## Security Guidelines

- Never commit `.env` files, access tokens, private keys, or real passwords.
- Never use example secrets in production.
- Store production secrets in AWS Secrets Manager, AWS Systems Manager Parameter Store, or an equivalent secret manager.
- Enforce TLS at the load balancer or gateway.
- Rotate JWT secrets, API key peppers, and webhook master keys through a controlled process.
- Grant each service only the minimum required database permissions.

## Continuous Integration

The workflow in `.github/workflows/backend-ci.yml` validates the backend on pushes and pull requests. Before opening a pull request, run:

```powershell
cd Backend
mvn verify
cd Golang
go test ./...
```

For the frontend:

```powershell
cd "Front End/Web"
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### Automatic README Updates

The `.github/workflows/update-readme.yml` workflow regenerates the project inventory and service port table when backend or frontend code changes. Pull requests verify that generated sections are current, while pushes to `main` commit any generated README changes automatically.

Run the generator locally:

```powershell
./scripts/update-readme.ps1
./scripts/update-readme.ps1 -Check
```

Only content between `BEGIN GENERATED` and `END GENERATED` comments is replaced. Descriptions, setup instructions, and other manually maintained documentation remain unchanged.

## Contributing

1. Create a branch from `main`.
2. Limit changes to the relevant service or portal.
3. Add a new migration when changing a database schema.
4. Add or update tests.
5. Run the relevant local builds and tests.
6. Open a pull request that clearly describes the changes, migrations, and new environment variables.
