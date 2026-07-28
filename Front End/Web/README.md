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
## Authentication and application shell

Each portal provides the same responsive authentication flow while retaining its own portal identity:

- `/login`, invitation-only `/register`, `/forgot-password`, `/reset-password`, and `/mfa`
- `/session-expired`, `/tenant-selector`, `/unauthorized`, and `/account-locked`

Dashboard routes are protected by `BrowserAuthGuard`, which validates the stored access token against `/auth/me` and redirects anonymous users to `/login`. Registration requires the backend internal invitation key and is not public self-service.

The dashboard application shell includes a collapsible desktop sidebar, mobile navigation drawer, breadcrumbs, `Ctrl/Cmd + K` command palette, notification drawer, user menu, tenant selector, and environment selector. Mobile selectors remain available below the header on narrow screens.

Permission primitives are exported by `@game-aggregator/auth`: `RouteGuard`, `PermissionGate`, `GuardedButton`, `PermissionWarning`, and `ReadOnly`. Browser requests use the same-origin `/backend` path. Next.js rewrites management traffic to the appropriate Spring service (`8081` through `8103`), so credentials and CORS configuration are not exposed to the browser. Copy an app-specific `.env.example` to `.env.local` only when overriding backend hosts.

For production authentication, terminate sessions through a same-origin BFF or secure `HttpOnly` cookies rather than persisting refresh credentials in browser storage.

## Local full-stack ports

Start Docker infrastructure and backend services first, then run the portals on stable ports:

```powershell
cd Backend/infrastructure/docker
docker compose --env-file .env -f compose.yml up -d --build

cd ../../../Front End/Web
pnpm dev
```

Each application script owns its fixed port, so the monorepo command always maps Admin to `3000`, Studio to `3002`, and Client to `3003`. Portal URLs are `http://localhost:3000`, `http://localhost:3002`, and `http://localhost:3003`. The Go API-key gateway remains at `http://localhost:8080` for external/runtime API traffic; web management authentication uses the same-origin BFF and Spring auth service on port `8081`.
### Optional authenticated E2E check

A local bootstrap administrator can be tested without committing credentials:

```powershell
$env:E2E_SUPER_ADMIN_EMAIL = "your-local-admin@example.com"
$env:E2E_SUPER_ADMIN_PASSWORD = "your-local-password"
pnpm --filter platform-admin-portal exec playwright test --reporter=line
```

The test is skipped when these process-only environment variables are absent. Never place bootstrap passwords or internal registration keys in committed `.env.example` files.
## Select and dropdown standard

All web portals use the shared Radix UI-based `Select` from `@game-aggregator/ui-web`; native HTML `<select>` controls are not used in application source. The component provides portal-based positioning, viewport collision handling, keyboard navigation, focus management, selected indicators, validation states, compact sizing, and responsive app-shell variants. Add new select controls through the shared component so Storybook, accessibility tests, and visual behavior remain consistent across Admin, Studio, and Client portals.
## Platform Admin data flow

The Platform Admin Portal is an authenticated React Query control plane backed by the Spring Boot microservices and their dedicated MySQL schemas. Dashboard totals, organization lists, games, API keys, contracts, revenue rules, invoices, incidents, and audit records are loaded from live APIs through the same-origin `/backend` proxy. Create and lifecycle actions never use browser mock storage: they are validated by the owning service and committed through Spring Data JPA/Flyway-managed tables.

Core administration capabilities include:

- Responsive dashboard and API health summary.
- Searchable Studio, Publisher, and Client organization views.
- Persistent Game creation and archive lifecycle.
- Version, build, release, and deployment inventory from their owning services.
- API key creation, one-time secret display, rotation, revocation, and deletion. Only the key hash and safe metadata are stored.
- Contract, revenue rule, transaction ledger, invoice, incident, and audit views backed by their isolated services.
- React Query cache invalidation after mutations so the UI immediately reloads database state.

Run the backend infrastructure first, sign in with an authorized platform administrator, and start the web monorepo. `NEXT_PUBLIC_API_BASE_URL` defaults to `/backend`; service destinations can be overridden with the `BACKEND_<SERVICE>_URL` variables documented in each portal `.env.example`.

The web portals accept both `localhost` and `127.0.0.1` during local development. Next.js dev-origin protection is configured in every portal so client hydration, HMR, authentication forms, and interactive controls work with either hostname.
### Interactive development troubleshooting

If the page renders but buttons, forms, or tabs do nothing, the client bundle did not hydrate. Do not start another copy of the monorepo. Stop duplicate Next.js/Turborepo processes, remove only the affected app's generated `.next` directory, and run `pnpm dev` once from `Front End/Web`. Use `Ctrl+F5` after the servers are healthy.

Empty tables are valid when the service databases contain no records. Create records from the portal forms or load development seed data through backend APIs; business records are never fabricated in the browser.

## Color themes

Admin, Studio, and Client portals share a responsive `Light`, `Dark`, and `System` theme selector. The selector is available on every authentication screen and dashboard header, including mobile layouts. `System` follows the operating-system preference and updates while the application is open. The selected preference is stored locally under `ga_theme`; only this display preference is stored, never business or authentication data.

A pre-hydration theme script applies the saved or system theme before the first browser paint, preventing a light-to-dark flash. Shared semantic tokens in `design-tokens` drive surfaces, text, borders, controls, overlays, status badges, permission warnings, and API-key dialogs across all portals. New UI must use these semantic variables or include equivalent `dark:` states rather than assuming a white background.

## Studio Portal operations

The Studio Portal is a separate authenticated control plane for studio-owned workflows. Its responsive, Light/Dark-aware console includes a live dashboard, game project inventory, developer integrations, team access, and derived analytics. Data is filtered by the selected studio and game instead of being shared with the Platform Admin presentation.

Studio users can create game projects, semantic versions, builds, sandbox or production releases, API keys, webhooks, and team invitations. Media uploads follow the presigned flow: the browser requests a short-lived upload URL, sends the file directly to MinIO/S3, and asks the game-media service to persist metadata only after object upload succeeds. Raw API-key and webhook secrets are displayed once and are never stored in browser business state or plaintext database columns.

Dashboard metrics and analytics are calculated from live Game, Build, Release, Deployment, Incident, Ledger, and Studio Member records. Empty states therefore represent empty service databases rather than browser-generated sample data.
