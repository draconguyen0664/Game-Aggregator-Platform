# Game Aggregator Platform

Nền tảng quản lý game theo kiến trúc microservice, gồm hệ thống quản trị, studio, client, mobile, API Gateway, quản lý phát hành, hợp đồng, doanh thu, billing, webhook và observability.

## Thành phần chính

- **Backend Java:** Spring Boot, Spring Security, JPA/Hibernate, Flyway, Redis, Kafka, OpenAPI, Actuator.
- **Backend Go:** API Gateway, rate limiting, usage metering, analytics consumer, log ingestion và real-time monitoring.
- **Web:** 3 dự án Next.js độc lập: Platform Admin Portal, Studio Portal và Client Portal.
- **Mobile:** React Native + Expo Router.
- **Infrastructure:** MySQL, Redis, Kafka, Kafka UI, MinIO, Docker Compose.
- **Observability:** Prometheus, Grafana, Loki, Tempo và OpenTelemetry Collector.

## Cấu trúc repository

```text
Game-Aggregator-Platform/
├── Backend/
│   ├── Golang/                 # Go foundation và 4 Go services
│   ├── Spring Boot/            # Spring Boot template
│   ├── packages/platform-core/ # Foundation dùng chung cho Java services
│   ├── services/               # 22 Spring Boot microservices độc lập
│   ├── database/               # Migration/seed tổng quan
│   ├── infrastructure/
│   │   ├── docker/             # Docker Compose và env mẫu
│   │   ├── monitoring/         # Prometheus/Grafana/Loki/Tempo/OTel
│   │   └── mysql/              # Khởi tạo service databases
│   └── pom.xml                 # Maven reactor
├── Front End/
│   ├── Web/
│   │   ├── Platform Admin Portal/
│   │   ├── Studio Portal/
│   │   └── Client Portal/
│   └── Mobile/
└── .github/workflows/backend-ci.yml
```

Mỗi microservice và mỗi portal là một thư mục riêng để có thể phát triển, test, build và deploy độc lập.

## Yêu cầu hệ thống

Để chạy toàn bộ bằng Docker:

- Git
- Docker Desktop có Docker Compose v2
- Khuyến nghị tối thiểu 12 GB RAM dành cho Docker vì hệ thống chạy hơn 30 container

Để phát triển trực tiếp trên máy:

- Java 21 trở lên và Maven 3.9+
- Go theo phiên bản trong `Backend/Golang/go.mod`
- Node.js 20+ và npm 10+
- Expo Go hoặc Android Studio/Xcode nếu chạy mobile native

## Bắt đầu nhanh: chạy toàn bộ backend bằng Docker

### 1. Clone repository

```bash
git clone https://github.com/draconguyen0664/Game-Aggregator-Platform.git
cd Game-Aggregator-Platform
```

### 2. Tạo file môi trường

PowerShell:

```powershell
Copy-Item "Backend/infrastructure/docker/.env.example" "Backend/infrastructure/docker/.env"
```

Bash:

```bash
cp Backend/infrastructure/docker/.env.example Backend/infrastructure/docker/.env
```

Mở `.env` và thay toàn bộ giá trị `change-*`/`replace-*` bằng secret mạnh. Không commit file này lên Git.

Các biến bắt buộc gồm:

- `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`
- `REDIS_PASSWORD`
- `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`
- `GRAFANA_ADMIN_USER`, `GRAFANA_ADMIN_PASSWORD`
- `JWT_SECRET`, `INTERNAL_REGISTRATION_KEY`
- `API_KEY_PEPPER`, `WEBHOOK_MASTER_KEY`
- `LOG_INGEST_TOKEN`, `MONITORING_TOKEN`

Có thể tạo secret ngẫu nhiên bằng PowerShell:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
```

### 3. Package Spring Boot

Docker image của các Java service sử dụng JAR từ thư mục `target`, vì vậy cần package trước lần build đầu tiên:

```powershell
cd Backend
mvn -DskipTests package
cd infrastructure/docker
```

### 4. Build và khởi động toàn bộ hệ thống

```powershell
docker compose --env-file .env up -d --build
```

Lần chạy đầu Docker sẽ tải image và build nhiều service nên có thể mất vài phút.

### 5. Kiểm tra trạng thái

```powershell
docker compose --env-file .env ps
docker compose --env-file .env logs -f --tail=100
```

Kiểm tra API Gateway:

```powershell
curl.exe http://localhost:8080/health
```

Kiểm tra một Spring service:

```powershell
curl.exe http://localhost:8081/actuator/health
```

## Cổng dịch vụ

| Cổng | Dịch vụ |
|---:|---|
| 8080 | Go API Gateway |
| 8081 | Authentication |
| 8082 | Tenant |
| 8083 | Authorization |
| 8084 | Studio |
| 8085 | Kafka UI |
| 8086 | Publisher |
| 8087 | Client |
| 8088 | Game |
| 8089 | Game Media |
| 8090 | Entitlement |
| 8091 | API Key |
| 8092 | Version |
| 8093 | Build |
| 8094 | Release |
| 8095 | Deployment |
| 8096 | Contract |
| 8097 | Revenue |
| 8098 | Ledger |
| 8099 | Billing |
| 8100 | Webhook |
| 8101 | Audit |
| 8102 | Incident |
| 8103 | Feature Flag |
| 8104 | Go Log Ingestion |
| 8105 | Go Real-time Monitoring |

Infrastructure và monitoring:

| URL/Cổng | Dịch vụ |
|---|---|
| `localhost:3307` | MySQL trong Docker |
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

Thông tin đăng nhập lấy từ file `.env` cục bộ.

## Database và migration

- Docker MySQL dùng cổng host `3307` để không xung đột MySQL local thường dùng `3306`.
- Script `Backend/infrastructure/mysql/init/001_create_service_databases.sql` tạo database riêng cho các service.
- Mỗi Spring service quản lý bảng của mình bằng Flyway trong `src/main/resources/db/migration`.
- Backend tự tạo/cập nhật bảng qua migration; người dùng chỉ cần bảo đảm MySQL chạy và database/user tồn tại.
- Không sửa migration đã chạy trong production; hãy tạo migration version mới.

## Chạy và test backend không dùng Docker

### Java/Spring Boot

Build toàn bộ reactor:

```powershell
cd Backend
mvn clean verify
```

Chạy một service, ví dụ auth:

```powershell
mvn -pl services/auth-service -am spring-boot:run
```

Khi chạy trực tiếp, cấu hình các biến `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `REDIS_PASSWORD`, `KAFKA_BOOTSTRAP_SERVERS` và secret tương ứng. Các giá trị mặc định trong source chỉ dành cho phát triển.

### Go

```powershell
cd Backend/Golang
go mod download
go test ./...
go build ./...
```

Chạy riêng API Gateway:

```powershell
go run ./services/api-gateway
```

## Chạy Web

Ba portal nằm trong npm workspace nhưng vẫn là ba ứng dụng Next.js độc lập.

Cài dependency một lần:

```powershell
cd "Front End/Web"
npm install
```

Chạy Platform Admin Portal:

```powershell
npm run dev --workspace=platform-admin-portal
```

Chạy Studio Portal:

```powershell
npm run dev --workspace=studio-portal
```

Chạy Client Portal:

```powershell
npm run dev --workspace=client-portal
```

Nếu chạy đồng thời, truyền cổng khác nhau sau `--`, ví dụ:

```powershell
npm run dev --workspace=studio-portal -- -p 3002
```

Các lệnh chung:

```powershell
npm run lint
npm run test
npm run build
```

Trong từng portal còn có:

```powershell
npm run storybook
npm run test:e2e
```

Playwright có thể cần cài browser lần đầu:

```powershell
npx playwright install
```

## Chạy Mobile

```powershell
cd "Front End/Mobile"
npm install
npm run start
```

Các lựa chọn khác:

```powershell
npm run android
npm run ios
npm run web
npm run lint
npm run typecheck
npm run test
```

Lưu ý: `npm run ios` yêu cầu macOS/Xcode. Android yêu cầu emulator hoặc thiết bị thật; cũng có thể quét QR bằng Expo Go.

## API, authentication và multi-tenant

- Request bên ngoài đi qua Go API Gateway tại cổng `8080`.
- API key chỉ hiển thị secret thô một lần; database chỉ lưu hash/prefix/metadata.
- Gateway kiểm tra API key, trạng thái, environment, scope, IP allowlist, rate limit và quota trước khi forward.
- Spring services xử lý authentication, authorization, tenant isolation và nghiệp vụ.
- Endpoint Actuator health có dạng `/actuator/health`.
- OpenAPI của Spring service thường có tại `/swagger-ui/index.html` và `/v3/api-docs` khi service đang chạy.

## Observability

- Prometheus thu thập metrics của các Go/Spring service.
- Grafana được provision datasource cho Prometheus, Loki và Tempo.
- Loki lưu log, Tempo lưu distributed trace.
- OpenTelemetry Collector nhận OTLP trên cổng `4317` và `4318`.

Kiểm tra target Prometheus tại http://localhost:9090/targets. Tất cả target cấu hình phải có trạng thái `UP`.

## Dừng, khởi động lại và xóa dữ liệu

Dừng container nhưng giữ volume/dữ liệu:

```powershell
docker compose --env-file .env down
```

Khởi động lại:

```powershell
docker compose --env-file .env up -d
```

Xóa cả volume và dữ liệu local (MySQL, Redis, Kafka, MinIO, Grafana):

```powershell
docker compose --env-file .env down -v
```

> Cảnh báo: lệnh `down -v` xóa dữ liệu không thể khôi phục nếu chưa backup.

## Xử lý lỗi thường gặp

### Cổng đã được sử dụng

```powershell
netstat -ano | Select-String ':8080|:3307|:6379|:9092'
```

Tắt ứng dụng đang giữ cổng hoặc đổi host port trong `compose.yml`.

### Service chạy nhưng health không phản hồi

```powershell
docker compose --env-file .env ps
docker compose --env-file .env logs --tail=200 <service-name>
```

### MySQL `Too many connections`

Compose đã giới hạn Hikari pool của từng Spring service và tăng `max-connections` của MySQL. Hãy bảo đảm đang dùng bản `compose.yml` mới nhất và recreate container:

```powershell
docker compose --env-file .env up -d --force-recreate mysql
docker compose --env-file .env up -d --force-recreate
```

### Thay đổi Java nhưng Docker vẫn chạy code cũ

```powershell
cd Backend
mvn -DskipTests package
cd infrastructure/docker
docker compose --env-file .env up -d --build --force-recreate
```

### Reset môi trường phát triển

Chỉ thực hiện khi chấp nhận mất toàn bộ dữ liệu Docker local:

```powershell
docker compose --env-file .env down -v
docker compose --env-file .env up -d --build
```

## Quy tắc bảo mật

- Không commit `.env`, access token, private key hoặc password thật.
- Không dùng các secret mẫu trong production.
- Production nên lưu secret trong AWS Secrets Manager/SSM hoặc secret manager tương đương.
- Bắt buộc TLS ở load balancer/gateway.
- Rotate JWT secret, API key pepper và webhook master key theo quy trình có kiểm soát.
- Chỉ cấp quyền database tối thiểu cần thiết cho từng service.

## CI

Workflow tại `.github/workflows/backend-ci.yml` dùng để kiểm tra backend khi push hoặc tạo pull request. Trước khi mở PR, nên chạy:

```powershell
cd Backend
mvn verify
cd Golang
go test ./...
```

Với frontend:

```powershell
cd "Front End/Web"
npm run lint
npm run test
npm run build
```

## Đóng góp

1. Tạo branch từ `main`.
2. Chỉ thay đổi đúng service/portal liên quan.
3. Thêm migration mới nếu thay đổi schema.
4. Viết hoặc cập nhật test.
5. Chạy build/test cục bộ.
6. Mở pull request và mô tả rõ thay đổi, migration và biến môi trường mới.
