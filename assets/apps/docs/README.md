# Schola — Documentation site

The full guide to Schola, the multi-tenant school-management platform: what it
does, how it is built, how to set it up, and how every screen works — from the
platform console to the parent portal. Built with [Astro](https://astro.build)

- [Starlight](https://starlight.astro.build).

This folder is the `@schola/docs` workspace of the pnpm monorepo. It has its own
`package.json`, `tsconfig.json` and ESLint config, reads one non-secret
environment variable at build time (`PUBLIC_ADSENSE_CLIENT`, for Google
AdSense), and builds to plain static files. It does not import code from the
other workspaces — pages describe the code, they don't run it.

## Run it locally

From the **repo root**:

| Command                              | What it does                                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `pnpm install`                       | Install every workspace's dependencies, the docs included (once, or after pulling dependency changes). |
| `pnpm --filter @schola/docs dev`     | Start the docs at http://localhost:3002 with live reload.                                              |
| `pnpm dev`                           | Start the API (:8000), the web app (:3000) **and** the docs (:3002) together through Turborepo.        |
| `pnpm --filter @schola/docs build`   | Build the static site into `apps/docs/dist/`.                                                          |
| `pnpm --filter @schola/docs preview` | Serve the built site on :3002 to check it before publishing.                                           |
| `pnpm --filter @schola/docs check`   | Type-check the docs (`astro check`). `pnpm typecheck` runs it too.                                     |
| `pnpm --filter @schola/docs lint`    | ESLint on the React islands, UI components and search index.                                           |

Extra flags go straight to Astro after `--`
(`pnpm --filter @schola/docs dev -- --host`).

Or from inside `apps/docs/`:

```bash
cd apps/docs
pnpm dev        # http://localhost:3002 with live reload
pnpm build      # outputs to apps/docs/dist/
pnpm preview    # serve the built site
```

## Build a static site

```bash
pnpm --filter @schola/docs build
```

`apps/docs/dist/` is plain static HTML/CSS/JS — host it on any static host
(Vercel, Netlify, Cloudflare Pages, an S3 bucket, nginx, …). The planned
address is `https://docs.schola.reactbd.com` (`site` in `astro.config.mjs`).
`pnpm build` at the repo root builds the docs together with the web app and the
API.

## Search

Press <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> (or <kbd>/</kbd>) anywhere. Search covers
every page title, description, section heading and body text — including code
blocks and the labels inside components (pipelines, cards, chips), but not
Mermaid diagram source — and jumps straight to the matching section. It works under `pnpm dev` as well as in
the built site: the index is `/search-index.json`, generated from the content
collection, and ranked in the browser with MiniSearch. Starlight's Pagefind is
switched off because it only works after a production build.

## Where things live

| Path                             | What it is                                                                                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/content/docs/`              | The pages (`.mdx`). The folder path is the URL.                                                                                                   |
| `astro.config.mjs`               | Site config, integrations, and the **sidebar order** — add new pages here.                                                                        |
| `WRITING_GUIDE.md`               | **Read before writing.** Voice, page template, components, diagram rules.                                                                         |
| `src/content.config.ts`          | Registers the `docs` content collection with Starlight's loader and schema.                                                                       |
| `src/components/`                | Doc components: `Pipeline`, `ScreenAnatomy`, `FeatureGrid`, `BarChart`, and the `Api`, `Perm`, `Route`, `Roles`, `SourceFile`, `DemoLogin` chips. |
| `src/components/ui/`             | **shadcn/ui** components (Button, Command, Dialog, DropdownMenu, Sheet, Kbd, …) — generated with the shadcn CLI (`components.json`).              |
| `src/components/react/`          | React islands: ⌘K search, theme toggle, "Copy page", mobile outline drawer, landing hero, and Aceternity-style effects (built with **Motion**).   |
| `src/components/overrides/`      | Starlight component overrides: Header, ThemeSelect, PageTitle, Sidebar, MobileTableOfContents, Hero.                                              |
| `src/lib/icons.ts`               | The lucide icons `Pipeline` and `FeatureGrid` can use.                                                                                            |
| `src/pages/search-index.json.ts` | Builds the full-text search index from every page (works in `dev` and in builds).                                                                 |
| `src/pages/md/[...slug].md.ts`   | Raw Markdown of each page (used by "Copy page" / "View as Markdown").                                                                             |
| `src/plugins/table-wrap.mjs`     | Markdown (Sätteri) plugin that wraps every table in a bordered, scrollable `div.table-wrap`.                                                      |
| `src/styles/global.css`          | The Schola design tokens (same values as `apps/web/src/app/globals.css`), Tailwind, and the Lexend / Ubuntu Mono fonts.                           |
| `src/styles/custom.css`          | Maps Starlight's `--sl-color-*` variables onto the tokens; tables, chips, Mermaid cards, spacing.                                                 |
| `src/assets/`                    | The Schola mark, light and dark (from `apps/web/src/components/brand/logo-mark.tsx`).                                                             |
| `public/`                        | Favicon, touch icon, social image and `ads.txt` (copy of the repo-root `ads.txt`).                                                                |
| `scripts/capture-screens.mjs`    | Signs in as every demo role on a running stack, captures screenshots and reports page errors.                                                     |
| `.env.production`                | Committed — `PUBLIC_ADSENSE_CLIENT` for production builds only (`astro dev` never loads ads). See `docs/services/adsense.md`.                     |

## Adding or changing a page

1. Read [`WRITING_GUIDE.md`](./WRITING_GUIDE.md).
2. Create or edit the `.mdx` file under `src/content/docs/`. Give it a `title`
   and a one-sentence `description`; no `# H1`.
3. Import components with the right relative depth
   (`../../../components/…` for a page one folder deep).
4. If it's a new page, add its slug to the `sidebar` in `astro.config.mjs`.
   Link to other pages with absolute paths and a trailing slash
   (`/features/daily/leave/`), and only to pages in the sidebar.
5. Run `pnpm --filter @schola/docs build` — it fails on broken MDX, a wrong
   import path or an invalid `<Steps>`, so fix any errors it reports.

The page **Operations → Editing the docs** explains all of this in more detail.

## Keeping the docs in sync with the code

The code is the source of truth. When app behaviour changes, update the
matching page in the **same pull request** so the docs never drift:

- a new or changed screen → its feature page and **Reference → Web routes**;
- a new or changed endpoint → its feature page and **Reference → API endpoints**
  (`apps/api/src/app.ts` + `*.routes.ts`);
- a permission or role change → **Reference → Permissions** and **Roles**
  (`packages/types/src/permissions.ts`, `apps/api/src/services/rbac/permissions.ts`);
- a new env var → **Setup → Environment variables** and
  **Reference → Environment variables** (`packages/config/src/server.ts`);
- a new status or enum value → **Reference → Statuses**
  (`packages/db/src/models/`).

If a page and the code disagree and the code looks wrong, describe what the
code does and flag it in a `:::caution` box — never document behaviour that
isn't there.
