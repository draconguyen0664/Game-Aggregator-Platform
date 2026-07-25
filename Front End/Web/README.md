# Web Frontend

The web frontend is a pnpm and Turborepo monorepo for the platform administration, studio, and client portals.

## Structure

```text
apps/
|-- admin-web/
|-- studio-web/
`-- client-web/

packages/
|-- api-client/       # OpenAPI types, typed fetch client, and query hooks
|-- auth/             # Authentication session and tenant context
|-- design-tokens/    # Color, typography, spacing, radius, shadow, and icon tokens
|-- types/            # Shared domain-neutral TypeScript contracts
|-- ui-web/           # Accessible web components and Storybook
`-- validation/       # Shared Zod schemas
```

## Requirements

- Node.js 20 or later
- pnpm 10.14.0

## Commands

```powershell
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Run one portal:

```powershell
pnpm --filter platform-admin-portal dev
pnpm --filter studio-portal dev
pnpm --filter client-portal dev
```

Run the shared design system:

```powershell
pnpm --filter @game-aggregator/ui-web storybook
```

## Generate the API Client

Generate from a running Spring service:

```powershell
$env:OPENAPI_URL = "http://localhost:8081/v3/api-docs"
pnpm generate:api
```

Generate from a local OpenAPI document:

```powershell
pnpm generate:api -- ./openapi.json
```

The generated schema is written to `packages/api-client/src/generated/schema.ts`. Commit it with backend contract changes so CI can typecheck consumers without running the backend.

## Package Boundaries

- Applications own routing, page composition, and portal-specific business workflows.
- `ui-web` owns reusable visual primitives and must not import application code.
- `api-client` owns transport and generated OpenAPI contracts.
- `auth` owns the session shape and authentication context, but not portal redirects.
- `types` contains only genuinely shared contracts. API response types belong in generated OpenAPI output.
- `validation` owns schemas shared by more than one application or package.
