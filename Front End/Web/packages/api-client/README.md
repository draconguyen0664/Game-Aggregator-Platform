# API Client

This package generates TypeScript definitions from an OpenAPI document and exposes a typed `openapi-fetch` client plus TanStack Query hooks through `openapi-react-query`.

```powershell
$env:OPENAPI_URL = "http://localhost:8081/v3/api-docs"
pnpm generate:api
```

You can also generate from a checked-in schema:

```powershell
pnpm generate:api -- ./openapi.json
```

Commit `src/generated/schema.ts` whenever the backend contract changes.
