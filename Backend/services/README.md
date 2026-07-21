# Services

Each business microservice must live in its own directory here and own its source, manifest, configuration, tests, container image, and database migrations.

The reusable technology foundations remain separate at `../Spring Boot` and `../Golang`. Do not copy business code between services; communicate through contracts and events.
