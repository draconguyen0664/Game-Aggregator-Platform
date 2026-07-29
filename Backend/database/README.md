# Database

`migrations` contains ordered Flyway migrations. `seeds/development.sql` is explicitly development-only and must not run automatically in production.

The current foundation uses one bootstrap schema. When business microservices are created, move ownership of each table and migration to the service that owns that domain; do not let multiple services write the same tables.

## Full local development dataset

With the Docker Compose stack running, load the idempotent cross-service dataset:

```powershell
.\Backend\database\seeds\load-development.ps1
```

`full-development.sql` populates the service-owned schemas used by all three web portals: tenants and organizations, studios and members, publishers, client applications and environments, games and media, versions, builds, releases, deployments, API-key metadata, entitlements, contracts, revenue rules, ledger transactions, billing reports, webhooks, incidents, audit logs, and analytics aggregates.

The loader reads the root password from the local MySQL container environment and never stores it in the script. Deterministic identifiers and upserts make repeat runs safe without duplicating sample records. This dataset is for local development only.
