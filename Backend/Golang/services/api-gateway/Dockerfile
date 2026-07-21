FROM golang:1.26-alpine AS build
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -o /out/api-gateway ./services/api-gateway
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/api-gateway /api-gateway
EXPOSE 8080
ENTRYPOINT ["/api-gateway"]