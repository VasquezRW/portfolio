# Requirements

## Purpose

A static personal portfolio that recruiters and collaborators reach from a GitHub profile or a CV. It presents the owner's profile, work experience and achievements, technical skills, personal projects and contact channels.

## Audience

- Recruiters and hiring managers (fast scanning, often on mobile).
- Engineers reviewing code quality (they will look at the repository too).
- Default language: **English**. Full **Spanish** translation available.

## Sections (single page with anchors, plus project detail pages)

| #   | Section        | Content                                                                                                                                           |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Hero / Profile | Name, role/title, short bio, location (city/country only), CTA to projects and contact.                                                           |
| 2   | Experience     | Timeline of positions: company, role, dates, summary, **achievements per project**, technologies used.                                            |
| 3   | Skills         | Technologies grouped by category (languages, frameworks, cloud, tooling…) with an experience indicator (years or level).                          |
| 4   | Projects       | Grid of personal projects with **preview** (cover image/GIF), summary, tags, repository and live demo links. Each project can have a detail page. |
| 5   | Languages      | English (C1), Spanish (native).                                                                                                                   |
| 6   | Contact        | Public email, GitHub, LinkedIn, downloadable CV (optional).                                                                                       |

## Functional requirements

- **FR-1 i18n**: every visible string and every content entry exists in `en` and `es`. English is served at `/`, Spanish at `/es/`. A language switcher keeps the user on the equivalent page.
- **FR-2 Content-driven**: experience, projects and profile data live in content files, not in components. Adding a project means adding files, never editing components.
- **FR-3 Project showcase**: a project supports `title`, `summary`, `tags`, `repo`, `demo`, `cover`, `featured`, `order`, `status` (active / archived / in-progress) and a Markdown body for the detail page.
- **FR-4 Theme**: light and dark mode, respecting `prefers-color-scheme`, with a manual toggle persisted in `localStorage`.
- **FR-5 Contact**: no phone number, no home address, no personal IDs. Only channels the owner chooses to make public.
- **FR-6 SEO**: per-page title/description, Open Graph tags, `hreflang` alternates, sitemap, `robots.txt`.

## Non-functional requirements

- **NFR-1 Static**: output is plain HTML/CSS/minimal JS; no server or database.
- **NFR-2 Performance**: Lighthouse ≥ 95 in all categories on mobile; images optimized (WebP/AVIF, lazy-loaded).
- **NFR-3 Accessibility**: WCAG 2.1 AA — contrast, visible focus, keyboard navigation, semantic landmarks, `lang` attribute per locale, reduced-motion support.
- **NFR-4 Maintainability**: TypeScript strict, schema-validated content, linting and formatting enforced in CI.
- **NFR-5 Quality gates**: unit tests (Vitest) and e2e + accessibility tests (Playwright + axe) must pass before merging to `main`.
- **NFR-6 Free hosting** with automatic deployment on merge to `main`.

## Out of scope (for now)

- Blog, CMS, analytics, contact form backend (may be added later — see [architecture](architecture.md#future-extensions)).
