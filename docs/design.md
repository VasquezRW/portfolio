# Design base

Reference mockup: the "Portfolio Design Base" artifact (full home page with EN/ES and theme switch, plus tokens). The tokens below are the source of truth for `@theme` in `src/styles/global.css`.

## Concept

The career is drawn as a **git history**: a main line ("career") with one branch per position that merges back when the role ends; the current role stays open to the right edge. Commits on each branch are the projects of that role. Personal projects run on a dashed branch below the main line. This graph is the only bold element; everything else stays quiet.

## Colour tokens

Neutrals lean green (sage grey). Pine leads, steel blue supports, ochre marks only "current/in progress".

| Token     | Light     | Dark      | Use                                                 |
| --------- | --------- | --------- | --------------------------------------------------- |
| `bg`      | `#eef1ee` | `#121816` | Page background                                     |
| `surface` | `#f8faf8` | `#19211e` | Alternating bands, cards, figure                    |
| `ink`     | `#16201c` | `#e4eae6` | Text                                                |
| `muted`   | `#4f5d57` | `#9caaa3` | Secondary text, axis                                |
| `line`    | `#cfd7d2` | `#2b3632` | Borders, dividers, empty tracks                     |
| `pine`    | `#1f5d4c` | `#74b9a0` | Primary: links, buttons, skill bars, current branch |
| `steel`   | `#35587a` | `#8fb1d6` | Tags, focus ring, second branch                     |
| `ochre`   | `#8f5814` | `#dba55e` | "Current role", "In progress" only                  |

All text pairs meet WCAG AA (≥ 4.5:1) in both themes. Theme: `prefers-color-scheme` by default, manual toggle stored in `localStorage`, applied as `data-theme` on `<html>`.

## Typography

One family: **Schibsted Grotesk** (Google Fonts, self-hosted via `@fontsource-variable/schibsted-grotesk`). Hierarchy through weight and size, sentence case everywhere, no all-caps labels.

| Role         | Size / weight                  | Line-height | Tracking |
| ------------ | ------------------------------ | ----------- | -------- |
| Display (h1) | clamp(34px, 5.2vw, 52px) / 800 | 1.05        | -0.025em |
| Heading (h2) | clamp(26px, 3vw, 32px) / 700   | 1.1         | -0.02em  |
| Subhead (h3) | 19px / 700                     | 1.3         | 0        |
| Body         | 16px / 400 (lede 18px)         | 1.6         | 0        |
| Small        | 13px / 500                     | 1.4         | 0        |

Body lines ≤ 70 characters. Dates and numbers use `tabular-nums`.

## Spacing, radius, layout

- Spacing scale (4px base): 4, 8, 12, 16, 24, 32, 48, 72.
- Radius: 4 (small), 8 (buttons), 14 (cards, figure), pill (tags, controls).
- Content max width 1140px; side gutter `max(5vw, 16px)`; section padding `clamp(36px, 5vw, 72px)`.
- Bands alternate `bg` / `surface` with a 1px `line` border.
- Breakpoints: ≤ 860px hero and contact stack; ≤ 600px nav links hide, experience dates move above the content.

## Sections

1. **Header** — name, section anchors, EN/ES segmented control, theme toggle. Sticky.
2. **Hero** — name as h1, headline in pine, bio and two CTAs; key facts and availability (ochre) at right with a pine rule; career graph full width beneath.
3. **Experience** — rows: dates and duration | role · company, summary, highlights with achievement bullets, stack tags.
4. **Skills** — four columns by category, plain lists; self-taught items marked. The mockup's years bars were dropped because there are no reliable per-tool years.
5. **Projects** — card grid: 16:10 preview, optional status, title, summary, tags, Code / Live demo links. A dashed "Next project" slot stays at the end.
6. **Languages and education** — CEFR scale A1–C2 with the reached level filled (English C1, Spanish native); education beside it.
7. **Contact** — public email, GitHub, LinkedIn, availability. No phone number and no CV download (the CV PDFs contain the phone).

## Rules

- No numbered markers, eyebrow labels, gradients or drop shadows.
- Motion: only the branch lines drawing in on load; disabled under `prefers-reduced-motion`.
- Focus: 2px `steel` outline, 3px offset. Targets ≥ 44px tall.
- Project previews: real screenshots/GIFs in production (`cover`); the mockup uses generated placeholders.
