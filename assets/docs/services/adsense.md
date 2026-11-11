# Google AdSense

## What it is

Google AdSense shows Google ads on a website and pays the publisher for them. Schola's public marketing site (`apps/web`, `https://schola.reactbd.com`) and the documentation site (`apps/docs`) carry AdSense **Auto ads**: one script per page, and Google decides where ads go.

Publisher ID: **`pub-6542623777003381`** (written `ca-pub-6542623777003381` in the ad code).

## Why we use it

It funds the free public pages without building an ad system. Auto ads need no per-page markup, and the placements, ad formats and blocked categories are managed in the AdSense dashboard rather than in code.

## Where ads appear — and where they never do

| Surface                                                                                                                                   | Ad script | `google-adsense-account` meta |
| ----------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------- |
| Marketing pages (`/`, `/features`, `/pricing`, `/about`, `/academics`, `/admissions`, `/news`, `/events`, `/faq`, `/contact`, `/legal/*`) | Yes       | Yes                           |
| Sign-in and sign-up (`/login`, `/signup`, `/verify`, `/forgot-password`, `/reset-password`)                                               | **No**    | Yes                           |
| School app `/app/*`, platform console `/platform/*`, `/welcome`, `/onboarding/*`, `/admin-transfer`                                       | **No**    | Yes                           |
| Not-found pages (web and docs)                                                                                                            | **No**    | Yes                           |
| Every docs page (`apps/docs`)                                                                                                             | Yes       | Yes                           |

AdSense policy does not allow ads on screens without publisher content (log-in pages, dashboards, error pages), so the script lives only in the marketing layout (`apps/web/src/app/(marketing)/layout.tsx`) and the docs `<head>` (`apps/docs/src/components/overrides/Head.astro`, which skips the 404 page). The meta tag is harmless everywhere: it only tells AdSense who owns the site.

## Configuration

| Variable                     | App         | Set in                                  | Value                     |
| ---------------------------- | ----------- | --------------------------------------- | ------------------------- |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `apps/web`  | `apps/web/.env.production` (committed)  | `ca-pub-6542623777003381` |
| `PUBLIC_ADSENSE_CLIENT`      | `apps/docs` | `apps/docs/.env.production` (committed) | `ca-pub-6542623777003381` |

- The publisher ID is **not a secret** — it is printed in every page's HTML and in `ads.txt` — so it lives in the committed `.env.production` files.
- Both frameworks read `.env.production` for production builds only (`next build` / `next start`, `astro build`). **`pnpm dev` never loads ads**, and the root `.env` / `test.env` keep the keys blank. To try the ad code locally, put the ID in `apps/web/.env.local` (gitignored); AdSense still serves no ads on `localhost`.
- A value that isn't `ca-pub-` + 16 digits is ignored (no script is rendered).
- Blank the variable (or override it on the host) to switch ads off for a deployment, e.g. staging.
- `NEXT_PUBLIC_*` / `PUBLIC_*` values are inlined at build time — rebuild after changing them. Both keys are declared in `turbo.json` `globalEnv` so host-provided values reach the build.

## ads.txt

`ads.txt` declares which ad sellers may sell the site's inventory. The source is the repo-root **`ads.txt`**; each site serves its own copy at `/ads.txt`:

- `apps/web/public/ads.txt` → `https://schola.reactbd.com/ads.txt`
- `apps/docs/public/ads.txt` → `/ads.txt` on the docs host

Change all three files together. `apps/web/src/lib/ads.test.ts` fails if the copies drift or no longer match the publisher ID in the `.env.production` files.

## Step-by-step signup (new publisher)

1. Sign in at <https://adsense.google.com> with the Google account that should receive payments, and add the site `schola.reactbd.com`.
2. **Account → Settings → Account information** shows the **Publisher ID** (`pub-…`). Put `ca-pub-<number>` in `apps/web/.env.production` (`NEXT_PUBLIC_ADSENSE_CLIENT`) and `apps/docs/.env.production` (`PUBLIC_ADSENSE_CLIENT`).
3. **Sites → your site → ads.txt** shows the line to publish (`google.com, pub-…, DIRECT, f08c47fec0942fa0`). Put it in the root `ads.txt` and both `public/ads.txt` copies.
4. Deploy (rebuild) both sites. Check `view-source:` on a marketing page for `adsbygoogle.js?client=ca-pub-…` and open `/ads.txt`.
5. In AdSense, request a site review. Approval can take days to weeks.
6. After approval: **Ads → By site → Auto ads** — turn Auto ads on and pick the formats. Add the docs host as a second site if it is on its own domain.

## Free tier / pricing

Free to join; Google pays the publisher a revenue share. There are payment thresholds and tax forms per country — see AdSense → Payments.

## Local development alternative

None needed: ads stay off in development. To preview the markup, run a production build (`pnpm --filter @schola/web build && pnpm --filter @schola/web start`, or `pnpm --filter @schola/docs build && pnpm --filter @schola/docs preview`) and view the page source.

## Manual ad units (optional)

Auto ads need no code. For a fixed placement, create a display unit in AdSense (**Ads → By ad unit**) to get its `data-ad-slot` ID, then render `<ins class="adsbygoogle" data-ad-client="ca-pub-…" data-ad-slot="…" …>` followed by `(adsbygoogle = window.adsbygoogle || []).push({})` on a marketing page. Never place units on `/app`, `/platform` or auth pages.

## Troubleshooting

- **No ads show.** Normal until AdSense approves the site, and on `localhost` always. Check the script is in the page source and `/ads.txt` returns the line above with status 200.
- **"ads.txt not found" / "Earnings at risk" in AdSense.** `/ads.txt` must be at the root of each host. Redeploy after editing, and allow AdSense up to a few days to recrawl.
- **No script in the page source.** The variable is blank or malformed in that build — check the `.env.production` file (or host variable) and rebuild.
- **"AdSense head tag doesn't support data-nscript attribute".** Comes from loading the script with `next/script`. Schola renders a plain async `<script>` that React 19 hoists into `<head>`; keep it that way (`apps/web/src/components/seo/adsense.tsx`).
- **Ads on a dashboard or sign-in page.** A layout outside `(marketing)` rendered `<AdSenseScript />` — remove it there.
