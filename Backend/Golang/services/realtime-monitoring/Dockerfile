FROM golang:1.26-alpine AS build
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -o /out/realtime-monitoring ./services/realtime-monitoring
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/realtime-monitoring /realtime-monitoring
EXPOSE 8080
ENTRYPOINT ["/realtime-monitoring"]