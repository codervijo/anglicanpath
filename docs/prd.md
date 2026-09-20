---
project: anglicanpath.org
prd_version: 1
project_version: v1.A
status: in-progress
owner: Vijo
last_updated: 2026-09-19
---

# anglicanpath.org — PRD

## 1. Problem

<1-2 sentence problem statement — fill in: what user-facing problem
does this site solve? Who has it? Why does it matter?>

## 2. Users

<who uses this — target user, what they care about, rough audience size>

## 3. Goals & non-goals

**Goals:**
- <fill in>

**Non-goals:**
- <fill in>

## 4. Versions

Two-level versioning convention (canonical: `sites/portfolio/AI_AGENTS.md`):

- `vN` = major capability tier; SemVer-MAJOR semantics.
- `vN.X` = phase letter within a tier; internal slicing.

| Version | Theme | Acceptance |
|---|---|---|
| v0 | scaffold | local builds, CF wrangler.jsonc + public/_headers in place, repo initialized |
| v1 | the editorial site | a reader can find a source-backed, clergy-reviewed article for their question, follow a guided reading path for their background, and land on the parish finder |

## 5. Phases

| Phase | Theme | Features | Status |
|---|---|---|---|
| **v0.A** | scaffolded | `portfolio new bootstrap` ran; standard files written; git initialized | ✅ |
| **v0.B** | ported | tanstack-start prototype ported to Astro (`v15.M`); placeholder copy throughout | ✅ |
| **v1.A** | content platform | `learn` + `paths` content collections (Zod); article layout with breadcrumbs, auto TOC, frontmatter-driven sources, related block, parish CTA; Article/BreadcrumbList/FAQPage/Organization JSON-LD; 10 article + 4 path scaffolds; self-hosted fonts, zero third-party requests; build-time content quality gate | built, not deployed |
| **v1.B** | first article live | `anglican-vs-catholic` written from first-hand material, clergy-reviewed, sourced, `status: published`; gate green; deployed | planned |
| **v1.C** | pillar + paths live | `what-is-the-anglican-church` published, then the paths that only reference published articles | planned |

**v1.A is code-complete and gate-green locally. It is not shippable as
content:** all 10 articles and 4 paths are `status: draft`, so a production
build renders zero article pages. The blocker is first-hand material, not
build work. See `CONTENT_README.md`.

## 6. Open questions

- *(append-only log; mark answered with date but never delete)*
- **2026-09-19** — §1–3 of this PRD are still template text. The material
  exists in `AI_AGENTS.md` (Summary / Audience / ICP / Goals); they need
  restating here in the operator's own words.
- **2026-09-19** — Pillar-first publishing order is now a hard constraint of
  the build gate: a published article may not link to an unpublished one, and
  every article must link to `anglican-vs-catholic` or
  `what-is-the-anglican-church`. Confirm that ordering is wanted before the
  first publish.
- **2026-09-19** — `.dark` palette is defined in `src/styles/global.css` but
  nothing ever applies the class, so dark mode is unreachable outside the
  Daily Office reader's own theme switcher. Wire a toggle, or drop the
  palette?
