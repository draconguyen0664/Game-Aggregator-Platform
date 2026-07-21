# Database

`migrations` contains ordered Flyway migrations. `seeds/development.sql` is explicitly development-only and must not run automatically in production.

The current foundation uses one bootstrap schema. When business microservices are created, move ownership of each table and migration to the service that owns that domain; do not let multiple services write the same tables.
