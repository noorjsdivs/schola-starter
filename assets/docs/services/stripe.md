# Stripe

Schola uses Stripe Checkout to collect a fee invoice and to pay a teacher or staff payslip. The API creates a Checkout Session for the balance. Stripe sends `checkout.session.completed` and `checkout.session.async_payment_succeeded` to the webhook, which records the fee payment or marks the payslip paid. The success page does not move the money.

## Why

Card data stays on Stripe. The school ledger still lives in Mongo, written only after Stripe says the payment is no longer unpaid.

## Keys

| Variable                | Where                                                                                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| `STRIPE_SECRET_KEY`     | Stripe Dashboard → Developers → API keys. Prefer a restricted key (`rk_`). A secret key (`sk_`) also works. |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks, or `stripe listen` while developing.                              |

Leave both blank in the committed `.env`. Put the real values in gitignored `test.env`.

## Local development

1. Paste the test secret into `test.env` as `STRIPE_SECRET_KEY`. Checkout stays off until this is set.
2. `pnpm --filter @schola/api dev` starts the API and the webhook listener in this package. If the API is already running, use `pnpm --filter @schola/api stripe:listen`.
3. The listener signing secret belongs in `test.env` as `STRIPE_WEBHOOK_SECRET`. Restart the API after it changes.
4. On Fees, Pay opens Checkout for that invoice (`fee:collect`). On Payroll, Pay opens Checkout for that payslip (`salary:pay`). The response `url` is the Stripe-hosted payment page.

Use a [sandbox](https://docs.stripe.com/sandboxes) for new test data. Card `4242 4242 4242 4242` succeeds in test mode.

## Routes

- `POST /api/v1/fee-invoices/:id/checkout` — signed-in school staff. Returns `{ id, url }`.
- `POST /api/v1/salary-records/:id/checkout` — signed-in school staff. Returns `{ id, url }`. Pays the net salary.
- `POST /api/v1/stripe/webhook` — Stripe only. Verifies `Stripe-Signature`. No session cookie. `metadata.kind` is `fee` or `salary`.

## Troubleshooting

- **503 Stripe is not configured.** `STRIPE_SECRET_KEY` is empty.
- **400 on the webhook.** The signing secret does not match this endpoint, or the body was parsed as JSON before verification. The webhook route reads the raw body.
- **Invoice stays unpaid after Checkout.** Confirm `stripe listen` is running and the event is `checkout.session.completed` or `checkout.session.async_payment_succeeded` with `payment_status` not `unpaid`.
