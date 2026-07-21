FROM golang:1.26-alpine AS build
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -o /out/analytics-consumer ./services/analytics-consumer
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/analytics-consumer /analytics-consumer
ENTRYPOINT ["/analytics-consumer"]