# Schola — Testing

> Tracks the testing plan in the original spec.

## Layers

| Layer       | Tool                                | Where                                                      |
| ----------- | ----------------------------------- | ---------------------------------------------------------- |
| Unit        | Vitest                              | co-located `*.test.ts` next to source                      |
| Integration | Supertest + `mongodb-memory-server` | `apps/api/src/modules/<m>/__tests__/*.integration.test.ts` |
| E2E         | Playwright                          | `apps/web/e2e/`                                            |
| Lighthouse  | `@lhci/cli`                         | CI on `main` + release branches                            |

## What every feature MUST have

- Unit tests for any pure logic, schema, or helper.
- Integration tests for every endpoint:
  - happy path
  - permission denied (403)
  - **tenant isolation** (A ↛ B)
  - validation failure (400 with `details`)
  - audit log row written (for mutations)
- E2E coverage for the critical flow it participates in.

## Coverage budget

- `modules/**` and `services/**`: ≥ 70 % statements.
- `repositories/**`: ≥ 90 % (auth, tenant scoping, audit are load-bearing).
- A bug fix without a regression test is incomplete.

## Anti-patterns

- Mocking Mongoose models in integration tests. Use `mongodb-memory-server`.
- Snapshot tests on volatile output (timestamps, ids).
- Testing implementation details — assert on observable behavior.

## Commands

```sh
pnpm test                       # all workspaces, unit + integration
pnpm --filter @schola/api test  # api only
pnpm --filter @schola/web test  # web only
pnpm test:e2e                   # Playwright
pnpm test:e2e -- --ui           # Playwright interactive
```

## End-to-end tests (Playwright)

The suite in `apps/web/e2e/` drives the real web app against the real API on a database filled by `pnpm seed`. It signs in as the demo accounts (docs/demo-data.md), so it needs that seed, not mocks.

| Spec            | Covers                                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `01-auth`       | Wrong password; every role lands on its own dashboard with the right menu                                                                                     |
| `02-security`   | Own-scope reads through the API: students get no school-wide numbers or ledger, parents can't open other children, teachers can't manage roles or the library |
| `03-portals`    | Parent child record tabs, student marks + report-card PDF, teacher classes and week, staff payslip PDF, profile edit                                          |
| `04-school-day` | Enroll an offered applicant into a section, take a register, approve leave (days become excused), record a cash payment and open the receipt                  |
| `05-operations` | Edit a timetable period, issue and return a library book, transport and hostel pages, parent leave request                                                    |
| `responsive`    | Phone viewport: no sideways scrolling on key pages; the menu opens                                                                                            |

Run locally:

```sh
pnpm seed --reset         # a fresh demo school (password Schola@2026)
pnpm dev                  # API on :8000, web on :3000
pnpm test:e2e             # in another terminal
```

`E2E_BASE_URL` and `E2E_PASSWORD` override the defaults. Specs run in one worker because some of them change the shared school; re-seed with `pnpm seed --reset` before a second full run.

## CI gates

`.github/workflows/ci.yml` runs on every push to `main` and every pull request:

1. **checks** — `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm test` (unit + integration; `mongodb-memory-server` downloads MongoDB on the runner, cached between runs).
2. **e2e** — a `mongo:8` service, throwaway secrets generated per run, every external service blanked (email goes to the console transport, Stripe and ImageKit stay off), `pnpm seed`, a production build of the web app, the API and web started side by side, then `pnpm test:e2e`. On failure the Playwright report, traces and both server logs are uploaded as the `playwright-report` artifact.

Lighthouse CI on the marketing build is still to come.
