# Architecture

## Overview

Astro builds the site into static HTML at build time. All data comes from **content collections** (Markdown/YAML validated by Zod schemas). Components are presentational and receive typed data; pages compose sections per locale. There is no runtime data fetching.

```
content files (en/es) ──► Zod schemas ──► getCollection() in pages ──► components ──► static HTML
i18n dictionaries (en/es) ──► t() helper ─────────────────────────────┘
```

## Directory layout

```
src/
  content.config.ts          # collection definitions + Zod schemas (single source of truth for content shape)
  content/
    experience/{en,es}/*.yaml  # one file per position
    projects/{en,es}/*.md    # one file per personal project
    profile/{en,es}.yaml     # bio, skills, languages, contact links
  i18n/
    en.json, es.json         # UI strings (labels, headings, aria-labels)
    utils.ts                 # getLangFromUrl(), useTranslations(), localizePath()
  components/
    ui/                      # generic primitives (Button, Tag, Card, Section)
    sections/                # page sections (Hero, Experience, Skills, Projects, Languages, Contact)
    layout/                  # Header, Footer, LangSwitcher, ThemeToggle
  layouts/BaseLayout.astro   # <html lang>, <head>, SEO, hreflang, theme bootstrap script
  pages/
    index.astro              # EN home
    projects/[slug].astro    # EN project detail
    es/index.astro           # ES home
    es/projects/[slug].astro # ES project detail
  styles/global.css          # Tailwind import + @theme design tokens
  assets/projects/<slug>/    # cover images (optimized by astro:assets)
public/                      # favicon, robots.txt, CV PDF, CNAME (if custom domain)
tests/
  unit/                      # Vitest
  e2e/                       # Playwright
```

## Content model

The schemas in `src/content.config.ts` are the contract. The build fails if a file does not match.

- **experience**: `company`, `role`, `start`, `end?` (`YYYY-MM`; absent = current), `location`, `summary`, `stack: string[]`, `highlights: { title, achievements: string[] }[]`. Ordered by start date.
- **projects**: `title`, `summary`, `date` (`YYYY-MM`), `tags: string[]`, `repo?`, `demo?`, `cover` (image), `coverAlt`, `status`, `featured`, `order`. Markdown body = detail page.
- **profile**: `name`, `title`, `headline`, `bio`, `location`, `availability`, `facts`, `skills: { category, items: { name, selfTaught }[] }[]`, `languages: { name, level, description }[]`, `education`, `contact: { kind, label, url }[]`.

Entry IDs follow `<locale>/<slug>`. The same `<slug>` must exist in both locales, and language-neutral fields (dates, links, tags, stack) must match — enforced by `tests/unit/content.test.ts`.

The hero's career graph is computed by the pure function `src/lib/career-graph.ts` (unit-tested) and rendered as three static SVGs, one per breakpoint, by `CareerGraph.astro`, so it needs no client JS.

## i18n

- Astro built-in i18n routing: `defaultLocale: 'en'`, `locales: ['en', 'es']`, `prefixDefaultLocale: false`.
- UI strings come from `src/i18n/*.json`; missing keys fall back to English and are reported by a unit test.
- Content is filtered by locale prefix of the entry id.
- `LangSwitcher` maps the current path to its counterpart with `localizePath()`.
- Every page emits `<link rel="alternate" hreflang>` for both locales.

## Styling

- Tailwind CSS v4 via `@tailwindcss/vite`. Design tokens (colors, fonts, spacing, radii) live in `@theme` in `global.css`, so components use semantic utilities (`bg-surface`, `text-muted`) instead of raw palette values.
- Dark mode via a `data-theme` attribute on `<html>`, set before paint by an inline script to avoid flashes.

## Client JavaScript

Only two small islands of behavior: theme toggle and (optionally) mobile nav. Everything else is static.

## Quality and delivery

- `ci.yml` job `ci`: lint → type check (`astro check`) → unit tests → build → e2e + axe on the built site.
- `ci.yml` job `deploy`: on push to `main`, after `ci` passes, deploys that same build to GitHub Pages.
- Decisions are recorded in [`docs/adr/`](adr/).

## Future extensions

- Fetch public GitHub repo metadata (stars, last update) at build time — public API, no token required for low volumes.
- Contact form through a third-party static form service (Formspree / Web3Forms).
- Blog as an additional content collection.
