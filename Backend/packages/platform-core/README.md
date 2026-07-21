# platform-core

Reusable technical foundation for Spring microservices. It owns no business data and contains no service-specific persistence. Services consume it as `com.gameaggregator:platform-core`.

Included: base entities, UUID/Snowflake IDs, API envelopes, exception mapping, pagination/sorting, validation errors, request/correlation IDs, audit metadata, structured request logging, and OpenAPI defaults.
