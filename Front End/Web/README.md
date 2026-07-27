# Web Frontend

The Web frontend is a pnpm and Turborepo monorepo for the Platform Admin, Studio, and Client portals. Each application remains independently runnable and deployable while consuming versioned workspace foundation packages.

## Structure

```text
apps/
|-- admin-web/        # Platform operations and administration
|-- studio-web/       # Game studio, build, media, and release workflows
`-- client-web/       # Client applications, keys, environments, and entitlements

packages/
|-- api-client/       # Generated OpenAPI types, typed fetch client, and query hooks
|-- auth/             # Authentication session and tenant context
|-- design-tokens/    # Color, typography, spacing, radius, shadow, and icon tokens
|-- types/            # Shared domain-neutral TypeScript contracts
|-- ui-web/           # Accessible components, portal composition, tests, and Storybook
`-- validation/       # Shared Zod schemas
```

## Requirements

- Node.js 20 or later
- pnpm 10.14.0
- The backend API Gateway at `http://localhost:8080` when testing real API calls

Enable pnpm once if it is not already available:

```powershell
corepack enable
```

If NVM for Windows prevents Corepack from writing the pnpm shim, install pnpm using an elevated terminal or follow the official pnpm/Corepack setup for your Node installation.

## Install

From `Front End/Web`:

```powershell
pnpm install --frozen-lockfile
```

Use plain `pnpm install` only when intentionally changing dependencies and updating `pnpm-lock.yaml`.

## Development

Run all portals in parallel:

```powershell
pnpm dev
```

Run one portal:

```powershell
pnpm --filter platform-admin-portal dev
pnpm --filter studio-portal dev
pnpm --filter client-portal dev
```

The applications use different product content but share the same `PortalOverview` composition and design primitives. The shared UI currently includes buttons, inputs, selects, tables, modals, drawers, tabs, badges, empty states, and skeletons.

## Quality Checks

Run the complete validation pipeline:

```powershell
pnpm check
```

This runs lint, TypeScript checks, Vitest, and production builds through Turborepo. Individual commands are also available:

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

The `ui-web` package includes React Testing Library coverage for accessible controls and the shared portal composition. Every portal is also compiled with `next build`, which validates consumption of raw workspace TypeScript and shared CSS.

## Storybook

Run the shared design system:

```powershell
pnpm --filter @game-aggregator/ui-web storybook
```

Build the static Storybook site:

```powershell
pnpm --filter @game-aggregator/ui-web build-storybook
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

The generated schema is written to `packages/api-client/src/generated/schema.ts`. Commit it with backend contract changes so CI can typecheck consumers without running the backend. Do not manually maintain duplicate API response interfaces when they exist in OpenAPI.

## Package Boundaries

- Applications own routing, page composition, and portal-specific business workflows.
- `ui-web` owns reusable visual primitives and generic compositions; it must never import application code.
- `api-client` owns transport and generated OpenAPI contracts.
- `auth` owns the session shape and authentication context, but not portal redirects.
- `types` contains only genuinely shared contracts. API response types belong in generated OpenAPI output.
- `validation` owns schemas shared by more than one application or package.
- `design-tokens` is the source of truth for visual constants and CSS variables.

## Adding a Shared Component

1. Implement it under `packages/ui-web/src`.
2. Export it from `packages/ui-web/src/index.ts`.
3. Add a Storybook story for visual states.
4. Add a Vitest/Testing Library test for behavior and accessibility.
5. Consume it from at least one portal.
6. Run `pnpm check` before committing.

## CI

`.github/workflows/frontend-ci.yml` installs dependencies from the frozen lockfile, runs typecheck and lint, builds Storybook, and creates production builds for all portals on Web-related pull requests and pushes to `main`.
