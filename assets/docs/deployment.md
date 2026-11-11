# Schola — Deployment

> **Live today:** three Vercel projects deployed from GitHub (`main` → production) — `schola-web` → https://schola.reactbd.com, `schola-api` → https://api.schola.reactbd.com, `schola-docs` → https://docs.schola.reactbd.com. The full, current setup (build steps, environment variables, the API function, Stripe webhook, operating it) is in the docs site: Operations → Deployment → "Live setup on Vercel" (`apps/docs/src/content/docs/operations/deployment.mdx`). The notes below are the original plan.

> Hosting plan, env wiring, and deploy checklist. The original spec (hosting split) is open; this doc captures the **default recommendation** until the user confirms.

## Recommended split

- `apps/web` → **Vercel** (Next.js 16 App Router, edge-first).
- `apps/api` → **Render** (or Railway / Fly), single Node 22 service.
- Database → **MongoDB Atlas** (M0 for dev/staging, M10+ for prod). Daily snapshots, 30-day retention.
- Media storage → **ImageKit** (image + video CDN with transforms).
- Email → **Resend** (free tier covers early stages).

Both web and api sit under `schola.reactbd.com`:

- Web: `https://schola.reactbd.com`
- API: `https://schola.reactbd.com/api/v1` (proxied) or `https://api.schola.reactbd.com/api/v1` (subdomain). The cookie domain `.schola.reactbd.com` covers both.

## Environment files per app

In development every app shares the repo-root `.env` (committed template) and `test.env` (gitignored, your local secrets). In production each app has its own file listing only the keys it reads:

| App         | Committed template (no secrets)                             | Real values (gitignored)                          | Loaded by                                                |
| ----------- | ----------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------- |
| `apps/api`  | [`apps/api/.env.production`](../apps/api/.env.production)   | `apps/api/.env.production.local` or host env vars | `apps/api/src/load-env.ts` when `NODE_ENV=production`    |
| `apps/web`  | [`apps/web/.env.production`](../apps/web/.env.production)   | `apps/web/.env.production.local` or host env vars | Next.js (`next build`, `next start`)                     |
| `apps/docs` | [`apps/docs/.env.production`](../apps/docs/.env.production) | — (`PUBLIC_ADSENSE_CLIENT` only, not a secret)    | Astro static build → `apps/docs/dist/` (any static host) |

The super-admin console (`/platform`) is part of `apps/web`; it has no separate app or env file.

Precedence, highest first: host environment variables → `.env.production.local` → `.env.production`. Never put a secret in a committed `.env.production`; the keys marked **SECRET** in each file belong in the host dashboard or the `.local` file.

The API refuses to start in production when a required value is missing — `MONGODB_URI`, `APP_URL`, `COOKIE_DOMAIN`, the JWT and CSRF secrets, `ENCRYPTION_MASTER_KEY`, `RESEND_API_KEY`, and the ImageKit keys. On the web app, `NEXT_PUBLIC_*` values are baked in at build time (rebuild after changing them), and `INTERNAL_API_URL` must point at the API server.

## Environment promotion

- **dev** — local `.env`. `MONGODB_URI=mongodb://localhost:27017/schola`.
- **staging** — `staging.schola.reactbd.com`. Separate Atlas cluster, separate ImageKit account (or a dedicated `staging/` folder in the prod media library).
- **production** — `schola.reactbd.com`.

## Pre-deploy checklist

1. `pnpm typecheck && pnpm lint && pnpm test` green locally and in CI.
2. `pnpm test:e2e` green against a staging deploy.
3. Lighthouse CI: SEO ≥ 95, Performance ≥ 90 on `/`.
4. Env vars set in the hosting dashboards — each app's `.env.production` is the checklist (see above).
5. CORS allowlist set to the exact production origin.
6. CSP includes the production origins and allows inline JSON-LD.
7. Sign up a real account, then grant platform access once: `pnpm --filter @schola/api run grant-role -- --email you@school.edu --role super_admin`. This does not set a password.
8. Atlas backups verified.

## DNS

- `schola.reactbd.com` A/AAAA → web host.
- Optional `api.schola.reactbd.com` CNAME → api host.
- TXT records for Google Site Verification, Resend domain auth, and (optionally) SPF/DKIM/DMARC.

## Logs & alerts

- pino JSON logs shipped to the hosting platform's log drain.
- Healthcheck path: `GET /api/v1/health` (returns `{ ok: true }`).
- Future: Sentry + uptime alerts (Phase 5+).
