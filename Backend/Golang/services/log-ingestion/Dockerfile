FROM golang:1.26-alpine AS build
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -o /out/log-ingestion ./services/log-ingestion
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/log-ingestion /log-ingestion
EXPOSE 8080
ENTRYPOINT ["/log-ingestion"]