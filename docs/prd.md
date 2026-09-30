---
project: anglicanpath.org
prd_version: 1
project_version: v1.B
status: in-progress
owner: Vijo
last_updated: 2026-09-29
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
| v2 | our own visual identity | the site is recognisably itself — not a near-twin of anglicancompass.org — in typography, colour, layout and page furniture |

## 5. Phases

| Phase | Theme | Features | Status |
|---|---|---|---|
| **v0.A** | Kickoff / decisions lock | stack (astro), workspace conventions and deploy target fixed by `portfolio new bootstrap` | ✅ |
| **v0.B** | scaffolded | standard files written; git initialized | ✅ |
| **v0.C** | ported | tanstack-start prototype ported to Astro; placeholder copy throughout | ✅ |
| **v1.A** | Kickoff / decisions lock | repo inspected (Astro port already done, no port plan needed); four decisions locked — keep `/find-a-parish/`, delete the 7 prototype article stubs and 5th path, approve `@fontsource-variable/*`, measured perf proxies instead of headless Chrome | ✅ |
| **v1.B** | content platform | `learn` + `paths` content collections (Zod); article layout with breadcrumbs, auto TOC, frontmatter-driven sources, related block, parish CTA; Article/BreadcrumbList/FAQPage/Organization JSON-LD; 10 article + 4 path scaffolds; self-hosted fonts, zero third-party requests; build-time content quality gate | built, not deployed |
| **v1.C** | publish-then-review + first article live | page lifecycle changed from review-then-publish to publish-then-review: `status` becomes `draft \| fact-checked \| published \| reviewed`, gate re-scoped so sources and fact-checking gate publication while a named clergy reviewer gates `reviewed`; `anglican-vs-catholic` sourced and live. State machine and rationale: `docs/architecture.md` § 2 | built, not deployed |
| **v1.D** | second pillar live | `what-is-the-anglican-church` written from sources and published; both pillar articles now live, which unblocks every other article's required pillar link. Paths deferred — no path has more than 2 of its 5 steps live, so none meets the "only references published articles" bar | article done; paths deferred |
| **v2.A** | Kickoff / decisions lock | audit what currently reads as generic against anglicancompass.org and the wider Anglican-site SERP; decide the differentiators — typeface pairing, palette, layout rhythm, page furniture (ornaments, rules, drop caps), imagery policy — and record them as an ADR in `docs/architecture.md`. No implementation | planned |
| **v2.B** | identity implemented | new design tokens in `src/styles/global.css`; header, footer, article template, cards and the parish finder restyled to the locked decisions; contrast re-checked AA in both palettes; no regression in the perf budget (zero third-party requests, no JS on text pages) | planned |


**v1.C is code-complete and gate-green locally.** `anglican-vs-catholic` is
`status: published` — sourced, fact-checked, and live on the next deploy,
carrying "not yet reviewed by clergy" in its byline. The other 9 articles and
4 paths are `status: draft` and absent from the production build; the blocker
there is first-hand material, not build work. See `CONTENT_README.md`.

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
