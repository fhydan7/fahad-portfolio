# Fahad Yahya Dahish — Strategy, Analytics & BI Platform

A personal Strategy/Analytics/Business Intelligence platform. Next.js 16 (App Router) +
TypeScript + Tailwind CSS v4 + Recharts.

## Setup

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint    # ESLint (clean as of this delivery)
```

Requires normal internet access on first build/dev run, because `app/layout.tsx` loads
Fraunces / IBM Plex Sans / IBM Plex Mono from Google Fonts via `next/font/google`. If you
build in a network-restricted environment (e.g. a sandboxed CI runner with no access to
`fonts.googleapis.com`), the build will fail on font fetch only — every other route,
component, and type in this project compiles and type-checks cleanly (verified repeatedly
with a temporary system-font swap during development). On a normal machine or standard
hosting (Vercel, etc.) this is a non-issue.

## Content policy

Every real fact on this site (name, role, employer, education, certifications, honors,
publication, contact details, and the two named projects) is sourced from
`Fahad_Yahya_Dahish_CV.pdf` (bundled in `/public`) — nothing else. No internal system
names (databases, schemas, employer-internal tools) and no unpublished internal metrics
appear anywhere in the codebase; this was verified with a full-repo text search before
delivery. The Dashboard Lab is explicitly synthetic demonstration data (Section 10/49 of
the original brief) and is never described as real company data anywhere in the UI or
content files.

If you add real project details later through `lib/content/*.ts`, keep that same
discipline: real facts only from sources you're comfortable publishing, no internal
system names, and clearly marked placeholders for anything else.

## What's implemented (maps to the original brief's 10-phase build sequence)

- **Phase 1** — Design system, fixed nav, Home, About, Recruiter View
- **Phase 2** — Career, Expertise, Projects (list + detail), Case Studies (list + detail), Resume
- **Phase 3** — Synthetic data model (`lib/data/`), deterministic generator, KPI calculation
  engine (`lib/kpi/`) — every KPI is computed live, nothing is hard-coded
- **Phase 4** — Dashboard Lab shell: top tab strip for switching dashboards, a compact
  global filter bar (date range, business line, region, location, department, service),
  shared chart/KPI/insight/gauge components
- **Phase 5–7** — All 11 dashboards implemented and filter-responsive, in a single-screen
  "control room" layout (dark navy/cyan theme, glowing bracket-cornered panels, arc gauges
  for headline KPIs): Executive Strategy, Healthcare Executive, Home Healthcare, Patient
  Retention (with cohort heatmap), Revenue & Profitability, Capacity & Utilization, Patient
  Journey (with funnel), Business Analysis tracker, Project/Initiative Portfolio, Workforce
  Analytics, Data Quality
- **Phase 8** — Strategy Command Center (vision→action flow + Balanced Scorecard), KPI
  Library (search/filter + detail drawer), Management Simulation (6 scenarios)
- **Industry Use Cases** (`/use-cases`) — 10 illustrative strategic/business/data-analysis
  case studies across different Saudi industries (retail, e-commerce, food & beverage,
  coffee shops, football, government, B2B sales, hospitality, logistics, real estate).
  These are clearly labeled as hypothetical demonstrations, not real client work — see
  `lib/content/useCases.ts`.
- **Phase 9** — Technical Portfolio ("Behind the Dashboard"), Research (with your real 2024
  publication), Contact (validated form with a honeypot field, no backend wired), Admin
  (an honest MVP — see below)

## The "single-screen cockpit" design

Each dashboard page is a `.cockpit`-themed container that overrides the shared CSS
variables (see `app/globals.css`) so every existing component — cards, KPI cards, tags,
buttons, tables — automatically re-skins without needing cockpit-specific component code.
The layout is a flex column (tab/filter row → header row → scrollable body) sized to the
viewport; it's designed to fit a typical desktop screen without scrolling, with individual
panels (tables, insight lists) getting their own internal scroll as a safety net on smaller
screens, rather than clipping content outright.

Note on scope: the reference image included decorative elements (a world map, a donut
chart) that don't correspond to any real business dimension in this project's data model,
so those weren't literally cloned — the goal was to match the *visual language* (dark
navy/cyan, glowing bracket-cornered panels, arc gauges, dense single-screen layout) using
panels that are actually backed by real, calculated data.

## Known gaps / what to do next (Phase 10 and beyond)

- **Admin is not a real CMS yet.** It's a local-only draft editor (browser localStorage).
  A production version needs authentication and a real datastore, then write access back
  into `lib/content/*.ts` (or a headless CMS).
- **Contact form has no backend.** Wire it to an email service (Resend, SendGrid, a
  serverless function, etc.) before relying on it.
- **No automated tests yet.** The brief's testing checklist (KPI formulas, filter
  combinations, division-by-zero, empty states, light/dark mode, responsive breakpoints,
  and now the cockpit layout at smaller viewport heights) should be run through manually
  or turned into a test suite before calling this "production ready."
- **Accessibility / performance / SEO polish** (Phase 10) has only had a first pass —
  semantic structure and focus states are in place, but a full WCAG and Lighthouse pass
  hasn't been done, and the cockpit's cyan-on-navy contrast should get a dedicated check.
- **Years of experience** is the one remaining placeholder metric on Home — not stated on
  the CV, so left blank rather than guessed.

## Architecture notes

- `lib/data/generate.ts` — the synthetic data generator (deterministic, seeded). Extends
  the original star schema with `fact_patient_cohort` (for the retention cohort matrix) —
  documented here since it's not in the original table list.
- `lib/kpi/formulas.ts` — every KPI formula, documented, in one place.
- `lib/kpi/engine.ts` — one function per dashboard; all pure, all computed from filtered
  synthetic data.
- `lib/content/*.ts` — everything about Fahad specifically (profile, projects, career,
  case studies, KPI Library entries, dashboard config/metadata, simulation scenarios).
  This is the file set an Admin CMS would eventually write to.
- `app/dashboard-lab/[slug]/page.tsx` — one dynamic route rendering all 11 dashboards,
  driven by `lib/content/dashboardConfigs.ts` plus a per-dashboard panel layout.
- `components/dashboard/GaugeChart.tsx` — the arc-gauge component used for headline KPIs
  in the cockpit layout.
