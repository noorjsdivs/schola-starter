# Schola — SEO

> Tracks the SEO section of the original spec.

## Hard requirements

- Every public route: unique `title` + `description`, absolute canonical, OG + Twitter, correct `robots`.
- Auth + app + super-admin routes: `robots: { index: false, follow: false }`.
- Dynamic `app/sitemap.ts` lists every public route.
- Dynamic `app/robots.ts` references the sitemap.
- Organization JSON-LD in the root layout; WebSite + SearchAction on the home page; BreadcrumbList on nested pages.
- Core Web Vitals: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
- `eslint-plugin-next` with the `core-web-vitals` preset enabled.
- Lighthouse CI gate: SEO ≥ 95, Performance ≥ 90.

## Routes

| Path             | Indexable? | Notes                                |
| ---------------- | ---------- | ------------------------------------ |
| `/`              | yes        | WebSite + SearchAction JSON-LD.      |
| `/about`         | yes        | BreadcrumbList.                      |
| `/pricing`       | yes        | BreadcrumbList + optional Product.   |
| `/contact`       | yes        | BreadcrumbList.                      |
| `/legal/terms`   | yes        | low priority.                        |
| `/legal/privacy` | yes        | low priority.                        |
| `/login`         | no         | `noindex, nofollow`.                 |
| `/signup`        | no         | `noindex, nofollow`.                 |
| `/forgot-password`, `/reset-password`, `/verify` | no | `noindex, nofollow`. |
| `/app/**`        | no         | tenant app. `noindex, nofollow`.     |
| `/platform/**`   | no         | super-admin. `noindex, nofollow`.    |

## Files

| File | Purpose |
| ---- | ------- |
| `apps/web/src/app/layout.tsx` | Root `Metadata` with `metadataBase`, OG defaults, Twitter, robots, icons, verification. |
| `apps/web/src/app/sitemap.ts` | Dynamic sitemap. |
| `apps/web/src/app/robots.ts` | Dynamic robots. |
| `apps/web/src/app/opengraph-image.tsx` | Default 1200×630 OG via `ImageResponse`. |
| `apps/web/src/app/twitter-image.tsx` | Twitter card image. |
| `apps/web/src/app/icon.tsx` / `apple-icon.tsx` | Favicons. |
| `apps/web/src/app/manifest.ts` | Web app manifest. |
| `apps/web/src/components/seo/json-ld.tsx` | The only sanctioned JSON-LD emitter. |

## Verification (per deploy)

```sh
curl -s https://schola.reactbd.com/ | grep -E '<title|og:|twitter:|application/ld'
curl -s https://schola.reactbd.com/sitemap.xml | head -n 30
curl -s https://schola.reactbd.com/robots.txt
npx --yes lighthouse https://schola.reactbd.com/ --quiet --chrome-flags="--headless" --output=json --output-path=.lh.json
```

## Performance

- `next/image` for every image.
- `next/font` for Inter + JetBrains Mono (self-hosted, no FOIT).
- Server Components by default; promote to `"use client"` only when interactivity needs it.
- Pre-reserve the hero image dimensions and `priority` it (it's the LCP candidate).
- No render-blocking third-party scripts. Analytics via `next/script strategy="afterInteractive"`.
