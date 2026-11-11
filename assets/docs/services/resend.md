# Resend

## What it is

A modern transactional email API. Schola uses Resend as the primary email transport; an SMTP fallback (Nodemailer) is wired so the app keeps working if Resend is down or unavailable in dev.

## Why we use it

- Simple HTTP API with a great deliverability story.
- Free tier is generous enough for early stages.
- Native React Email integration for nicely-typed templates.

## Free tier / pricing summary (verify at signup)

- **Free:** 3 000 emails/month, 100/day, one domain.
- **Pro:** $20/mo for 50 000 emails, multi-domain, dedicated IP add-on.
- See https://resend.com/pricing.

## Signup, step by step

1. Go to https://resend.com and sign up.
2. **Domains → Add Domain** → `schola.reactbd.com`.
3. Resend gives you DNS records (SPF, DKIM, optional DMARC). Add them in your DNS provider for `reactbd.com`.
4. Wait for the domain to verify (usually minutes).
5. **API Keys → Create API Key** → name it `schola-prod` (or `schola-dev`). Scope: full access (or sending-only).
6. Copy the key into `.env`:

   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   EMAIL_FROM="Schola <noreply@schola.reactbd.com>"
   ```

## Local development alternative

In dev, if `RESEND_API_KEY` is empty, the email service falls back to a console transport that logs the rendered email to stdout. This keeps the signup → approval flow testable without any external dependency.

For an in-browser inbox while developing:

```sh
docker run -d --rm --name schola-mailpit -p 1025:1025 -p 8025:8025 axllent/mailpit
```

Then point an SMTP transport at `smtp://localhost:1025` (Phase 1 will wire this when SMTP fallback is implemented).

## Troubleshooting

- **`Domain not verified`** — DNS records propagate at the speed of your registrar; check with `dig TXT _domainkey.schola.reactbd.com`.
- **Hard bounces** — Resend's logs are at https://resend.com/emails. Check the recipient address and your domain reputation.
- **Rate limited** — drop to Pro, or batch.
