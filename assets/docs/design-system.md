# Schola — Design System

> Tokens, type scale, spacing, components. Tracks the original spec verbatim.

## Principles

1. **Calm, dense, fast.** Linear/Vercel/Stripe-grade.
2. **Type-led hierarchy.** Spacing and weight do the work of color.
3. **Restrained motion.** 120–200ms `ease-out`.
4. **Real content over placeholders.**
5. **Theme parity.** Light and dark equally finished.
6. **Accessibility is a constraint, not a polish step.**

## Tokens

The single source of truth lives in `apps/web/src/app/globals.css`. All colors in OKLCH. Names match shadcn (`--primary`, not `--brand`).

Public pages follow the online-school layout: white canvas, deep cyan buttons with white labels, yellow accents, indigo display type, Lexend.

| Token                  | Light                        | Dark                    |
| ---------------------- | ---------------------------- | ----------------------- |
| `--primary`            | `oklch(0.45 0.11 216.6)`     | same deep cyan          |
| `--primary-foreground` | `oklch(1 0 0)`               | white                   |
| `--accent`             | `oklch(0.8587 0.1545 87)`    | same yellow             |
| `--indigo`             | `oklch(0.3664 0.1767 273.7)` | `oklch(0.74 0.12 274)`  |
| `--background`         | `oklch(1 0 0)`               | `oklch(0.18 0.03 255)`  |
| `--foreground`         | `oklch(0.252 0 0)`           | `oklch(0.96 0.005 230)` |
| `--muted-foreground`   | `oklch(0.5103 0 0)`          | `oklch(0.75 0.02 230)`  |
| `--border`             | `oklch(0.9128 0 0)`          | `oklch(0.32 0.03 255)`  |
| `--ring`               | same as `--primary`          | same                    |
| `--radius`             | `0.5rem`                     | same                    |

Primary buttons use dark label text. Hover fills them with `--accent`.

## Typography

- **Lexend** (variable, `next/font/google`) for UI.
- **Merriweather** for editorial / serif. **Ubuntu Mono** for IDs.
- Scale: 12 / 13 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48.
- Body line-height 1.5; display 1.15–1.2.
- 14px UI on desktop; 15–16px on mobile inputs (avoid iOS zoom).

## Spacing & layout

- 4px base. Rhythm: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- Content max-width 1440px on desktop; full-bleed app shell.
- Sidebar 256px desktop, 64px collapsed, off-canvas on mobile. Topbar 56px.

## Components

- All UI from shadcn primitives + thin wrappers in `@schola/ui`.
- Visible focus rings (`outline-offset-2`).
- Buttons: `default | secondary | ghost | outline | destructive`; sizes `sm | default | lg | icon`.
- Empty states: title + one-sentence description + primary CTA.
- Error states: clear message + retry.

## Breakpoints

`sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`. Test at 360 / 768 / 1024 / 1440.

## Theming toggle

Header has system / light / dark via `next-themes`. Default = system. Persist user choice in `localStorage` under `schola-theme`.
