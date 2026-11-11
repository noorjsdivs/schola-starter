# Schola

> **School operations, beautifully simple.**
>
> Production: **https://schola.reactbd.com**

Schola is a modern multi-tenant SaaS platform for schools, colleges, coaching centers, and institutes — admissions, attendance, gradebook, fees, payroll, and reports in one fast, well-designed product.

The how-it-works guides live in [`docs/`](./docs) and on the [docs site](https://docs.schola.reactbd.com).

---

## First 5 minutes

```sh
# 1. Install (Node 22+, pnpm 9+)
pnpm install

# 2. Set env vars
#    The committed `.env` holds every key with blank secrets and credential
#    sign-up links. Copy it to `test.env` (gitignored) and fill in real values:
cp .env test.env
$EDITOR test.env
#    `apps/api` loads `test.env` first, then falls back to `.env` for any
#    missing key. Secrets never end up in git.

# 3. Run a local MongoDB
brew services start mongodb-community@8.0   # macOS Homebrew
# or:
docker run --name schola-mongo -p 27017:27017 -d mongo:8

# 4. (Optional) Load the demo platform: super admin, a school with 500
#    students, every role. Sign-ins are listed in docs/demo-data.md.
pnpm seed

# 5. Run both apps (web + api) in dev
pnpm dev

# 6. Verify
open http://localhost:3000              # marketing site (light + dark)
open http://localhost:3002              # documentation site (Astro + Starlight)
curl http://localhost:8000/api/v1/health
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/robots.txt
```

---

## Repo layout

```
.
├── apps/
│   ├── web/             # Next.js 16 App Router  → @schola/web
│   ├── api/             # Express 5 API server   → @schola/api
│   └── docs/            # Astro + Starlight docs → @schola/docs (port 3002)
├── packages/
│   ├── db/              # Mongoose models & connection → @schola/db
│   ├── types/           # Shared TS enums + envelope   → @schola/types
│   ├── validation/      # Shared Zod schemas           → @schola/validation
│   ├── config/          # Typed env loader (Zod)       → @schola/config
│   ├── ui/              # shadcn wrappers + PDF tokens → @schola/ui
│   ├── eslint-config/   # Flat ESLint configs          → @schola/eslint-config
│   └── tsconfig/        # Shared TS configs            → @schola/tsconfig
├── docs/                # architecture · permissions · design-system · seo · …
├── .env                 # committed env template — every key, blank secrets, sign-up links
└── test.env             # gitignored local-values overrides (cp .env test.env)
```

---

## Documentation

The full guide — setup, every external service, architecture, a build-a-school-from-scratch
tutorial, and every feature role by role — is the docs site in [`apps/docs`](./apps/docs):

```sh
pnpm --filter @schola/docs dev      # http://localhost:3002 (also started by `pnpm dev`)
pnpm --filter @schola/docs build    # static site → apps/docs/dist/
pnpm --filter @schola/docs screens  # refresh app screenshots (needs `pnpm seed` + `pnpm dev`)
```

---

## Tech stack (locked)

- **Web** Next.js 16.2 + React 19.2 + TypeScript 5.7 strict, Tailwind v4, shadcn/ui (new-york), TanStack Query + Table, RHF + Zod, next-themes, sonner, lucide-react, Framer Motion.
- **API** Node 22 + Express 5, Mongoose 9.6 + MongoDB 8, argon2id + JWT (httpOnly cookies), Helmet + rate-limit, pino, Zod.
- **Media** ImageKit (image + video CDN with transforms). **Email** Resend (primary) with SMTP fallback. **PDFs** @react-pdf/renderer.
- **Tooling** pnpm 9 + Turborepo, ESLint 9 flat + Prettier, husky + lint-staged, Vitest + Supertest + Playwright + Lighthouse CI.

---

## Scripts

```sh
pnpm dev            # run both apps in dev (Turborepo)
pnpm build          # production build of every workspace
pnpm typecheck      # tsc --noEmit across the monorepo
pnpm lint           # ESLint across the monorepo
pnpm test           # Vitest unit + integration
pnpm test:e2e       # Playwright
pnpm format         # Prettier write
```

Workspace-scoped:

```sh
pnpm --filter @schola/web dev
pnpm --filter @schola/api dev
pnpm --filter @schola/api test
```

---

## Contributing

Every change must:

1. Pass typecheck + lint + tests.
2. Update `.env`, `test.env`, and `docs/services/<service>.md` together when a new env var or service is introduced.
3. Add `audit_logs` rows for mutations and `schoolId` scoping for every tenant query.
4. Keep public surfaces fully SEO'd and responsive in light + dark.
