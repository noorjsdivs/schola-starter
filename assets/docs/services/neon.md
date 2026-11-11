# Neon Postgres

## What it is

Neon is a serverless Postgres host. Schola uses it for **identity**: the person, their OAuth accounts (Google and Facebook), and email-verification rows. School operations — classes, attendance, grades, fees — still live in MongoDB until those models are ported.

## Why we use it

- A relational store fits accounts and OAuth links (one person, many providers) better than a document with growing provider fields.
- The free tier is enough for development and a first production database.
- The driver speaks HTTP, so the API does not keep a long-lived connection pool open in dev.

## Free tier / pricing summary

- Neon’s free plan includes a small compute allowance and storage suitable for identity data. Confirm the current limits at https://neon.tech/pricing before production.

## Signup, step by step

1. Create a project at https://console.neon.tech.
2. Name it `schola`. Pick a region close to the API host.
3. Open **Connect** and copy the pooled connection string. It looks like `postgresql://USER:PASSWORD@ep-….neon.tech/neondb?sslmode=require`.
4. Put that string in `test.env` as `DATABASE_URL`. Leave the committed `.env` value blank.
5. From the repo root, apply the identity tables:

   ```sh
   pnpm --filter @schola/db db:migrate
   ```

   That runs `packages/db/src/postgres/001_identity.sql`.

## Local development alternative

Without `DATABASE_URL`, password login and the OAuth buttons still use the Mongo user record. OAuth account rows and the Postgres copy of the person are skipped, and the API logs that Neon is not configured. Set `DATABASE_URL` before relying on the identity tables.

## OAuth redirect URLs

Register these on the Google and Facebook apps. They are the web origin plus the API path, because the browser talks to Next and Next proxies `/api/*`.

- Dev: `http://localhost:3000/api/v1/auth/oauth/google/callback`
- Dev: `http://localhost:3000/api/v1/auth/oauth/facebook/callback`
- Prod: `https://schola.reactbd.com/api/v1/auth/oauth/google/callback`
- Prod: `https://schola.reactbd.com/api/v1/auth/oauth/facebook/callback`

Google: https://console.cloud.google.com/apis/credentials → OAuth client → Web application. Scopes used: `openid`, `email`, `profile`.

Facebook: https://developers.facebook.com/apps → Facebook Login → Settings → Valid OAuth Redirect URIs. Permissions: `email`, `public_profile`.

## Troubleshooting

- `relation "identity_users" does not exist` — `DATABASE_URL` is set but the SQL file has not been applied. Run `pnpm --filter @schola/db db:migrate`.
- Google `redirect_uri_mismatch` — the callback URL in the Google client must match the browser origin exactly, including `http` vs `https` and the `/api/v1/auth/oauth/google/callback` path.
- Facebook login returns no email — the person denied the email permission. Schola refuses the sign-in and asks them to allow email.
- Password login returns `EMAIL_NOT_VERIFIED` — the account exists and the password is right, but the inbox has not been confirmed. Use the link or the 6-digit code.
