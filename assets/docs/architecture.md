# Schola — Architecture

> Companion to the original spec. Concrete details on layout, data flow, multi-tenancy, and security live here. The original spec is the source of truth; this doc just makes the **how** legible.

## Layout

```
schola/
├── apps/
│   ├── web/       # Next.js 16 App Router  → @schola/web
│   └── api/       # Express 5              → @schola/api
└── packages/
    ├── db/         # Mongoose 9 models     → @schola/db
    ├── types/      # Shared TS enums/types → @schola/types
    ├── validation/ # Shared Zod schemas    → @schola/validation
    ├── config/     # Typed env loader      → @schola/config
    ├── ui/         # shadcn wrappers, tokens, fonts → @schola/ui
    ├── eslint-config/ → @schola/eslint-config
    └── tsconfig/   → @schola/tsconfig
```

## Request flow (tenant API)

```
Browser
  │  cookie: access_token (httpOnly)
  ▼
Next.js (web) ──► proxies via lib/api-client ──► Express API
                                                    │
            requestId → auth → tenantContext → permission → validate → controller
                                                    │
                                            service ──► repository (withTenant) ──► Mongo
                                                    │
                                                    └─► auditLogger.log (on mutations)
```

Each middleware injects something into `req.ctx`:

- `auth` ⇒ `userId`, `roleAtTime`.
- `tenantContext` ⇒ `schoolId`.
- `requestId` ⇒ `requestId`, plus `X-Request-Id` echoed in the response.

The repository wrapper `withTenant(Model, req.ctx)` is the only legal way to touch a tenant-scoped collection.

## Multi-tenancy

- Shared database, shared collections, `schoolId` discriminator on every tenant-scoped document.
- The super admin operates **outside** the tenant via `withSuperAdmin(Model)`.
- Cross-tenant aggregations require dedicated repository methods + integration tests asserting they never leak data when called with one tenant.

## Auth & sessions

- `argon2id` (memory 19 456 KiB, time 2, parallelism 1).
- Access JWT: 15 min, HS256. Refresh: opaque, 30 days, stored hashed, rotated on each use.
- Cookies: `httpOnly`, `Secure`, `SameSite=Lax`. CSRF double-submit token for mutating requests.
- Cookie domain: `localhost` in dev, `.schola.reactbd.com` in prod (covers any future subdomain).
- Login lockout: 5 failed attempts → 15-min lock.
- Password reset / email verification tokens: single-use, time-bound, hashed.

## API conventions

- Base URL: `http://localhost:8000/api/v1` (dev), `https://schola.reactbd.com/api/v1` (prod default; the original spec open).
- Standard envelope, error codes, pagination, validation, and rate limiting.
- Every request gets an `X-Request-Id`. Logged via pino.

## Data model

The collections are enumerated in the original spec. Detailed field-level shapes are produced from Mongoose models in `packages/db/src/models/*.ts` and re-exported via `@schola/db`. Indexes are declared in the model files.

## Audit log

Append-only `audit_logs` collection. Every mutation goes through a repository wrapper that emits the row. Sensitive reads (salary, payroll, report exports) call `auditLogger.logRead`. See the original spec.

## Observability

- `pino` JSON logs, request ID propagation, `/health` and (later) `/metrics`.
- Errors include `code`, `message`, `requestId` in the envelope.
- (Phase 5) basic dashboard counters.

## Deploy targets

See `docs/deployment.md`. Hosting split is open in the original spec — default recommendation is Vercel for `apps/web` + Render/Railway/Fly for `apps/api`. The cookie domain `.schola.reactbd.com` keeps both behind one parent host.
