# SMTP (Nodemailer fallback)

## What it is

Per the original spec, Schola uses **Resend** as the primary email transport
with a **Nodemailer-over-SMTP** fallback. SMTP also covers dev when you want
emails to flow through a local inbox.

## Why we use it

- Resend can fail (rate limits, regional outages); SMTP keeps password resets
  and signup flows running.
- A local SMTP capture (Mailpit) lets you test full email rendering without
  hitting an external API.

## When SMTP is used

The `EmailService` chooses a transport in this order:

1. `RESEND_API_KEY` present → Resend.
2. `SMTP_HOST` present → Nodemailer.
3. Otherwise → console transport (dev; logs to stdout).

## Local development with Mailpit

```sh
docker run -d --rm --name schola-mailpit \
  -p 1025:1025 -p 8025:8025 \
  axllent/mailpit
```

`.env`:

```env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=false
```

Inbox UI: http://localhost:8025

## Production SMTP

Pick any provider (AWS SES, Mailgun, Postmark) and paste the values:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=...
SMTP_SECURE=false   # or true for port 465
```

## Troubleshooting

- **`EAUTH`** — wrong user/pass.
- **Connection timeout** — check `SMTP_HOST`, port, and firewall rules.
- **Emails not arriving in prod** — confirm Resend is primary and healthy
  (https://resend.com/emails). SMTP is only used when Resend is down or the
  key is missing.
