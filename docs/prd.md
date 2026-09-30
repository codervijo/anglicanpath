---
project: anglicanpath.org
prd_version: 1
project_version: v1.E
status: in-progress
owner: Vijo
last_updated: 2026-09-30
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
| v1 | the editorial site | the content platform is live, the two pillar articles are published, and the site is honest about who runs it and what clergy have reviewed |
| v2 | draft preview | the operator and invited clergy reviewers can read every unpublished page on a private preview site, while the production build still contains no draft text |
| v3 | the full library | all 10 articles published and all four guided reading paths live, so a reader can follow a path for their background to the parish finder |
| v4 | our own visual identity | the site is recognisably itself — not a near-twin of anglicancompass.org — in typography, colour, layout and page furniture |
| v5 | global Anglicanism | a reader can understand the Anglican Communion, GAFCON and the realignment, and find the province that governs their own country's Anglican church |

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
| **v1.E** | trust surface | `/about/` rebuilt: mission + statement of belief left as operator-written DRAFT placeholders, editorial standards / review process / independence drafted as proposed copy; flips indexable via frontmatter `status: published`. New `/about/review/` reviewer-invitation page with print stylesheet. `reviewers` content collection shipped empty, advisory panel with honest empty / few / several states; article byline states "Not yet reviewed" when no reviewer is assigned. Build gate: any built page carrying a placeholder must be `noindex` and out of the sitemap. Sample parish detail pages removed from the production build; finder noindexed. Footer year and sitewide "fictitious" line fixed. Comes before more articles because clergy are being invited now and this is the page they read first | built, not deployed; `/about/` + `/about/review/` await operator copy |
| **v2.A** | Kickoff / decisions lock | lock the preview design before any build work: hostname (`drafts.anglicanpath.org` proposed); a second Cloudflare Worker built from the same repo on every push vs a CF preview alias; flag name and scope (`SHOW_DRAFTS=1` extends today's dev-only `SHOW_UNPUBLISHED`: draft/fact-checked articles and paths, sample parish pages, dev-only placeholder copy, Draft/Proposed frames); Cloudflare Access login method (email one-time code) and who is on the policy; crawler defence (`X-Robots-Tag: noindex` on every response, `robots.txt` Disallow all, no sitemap); gate behaviour in the preview (advisory). Recorded as an ADR in `docs/architecture.md`, including why this keeps § 2.4 "unbuilt, not noindexed" intact. No implementation | planned |
| **v2.B** | operator preview live | `SHOW_DRAFTS` build flag wired through `src/lib/content.ts`, the parish and placeholder switches and the content gate; preview Worker + `drafts.` hostname deployed; noindex header, robots and sitemap suppression verified on the live preview; a production-build check proving no draft body, sample parish page or placeholder copy ships. Operator creates the Access policy (dashboard step, not scriptable from here) with only the operator on it | planned |
| **v2.C** | reviewer access | invited clergy reviewers added to the Access policy; a reviewer can read a finished article on the preview before signing; `/about/review/` copy updated to match (the "optional web editor later" line, and how a reviewer is sent the preview link); `CONTENT_README.md` gains the reviewer-preview workflow | planned |
| **v3.A** | Kickoff / decisions lock | re-confirm the content queue before writing resumes: search-volume-first order (operator decision 2026-09-30), the rule that a reading path goes live only when every step is published, and what first-hand material each remaining article needs from the operator. Draft review now happens on the v2 preview. No implementation | planned |
| **v3.B** | prayer-book cluster | `book-of-common-prayer-online` (150/mo), `1928-book-of-common-prayer` (150, KD 3), `1662-book-of-common-prayer` (90, KD 20) written from sources and published. Highest remaining demand, and the three interlink so they are cheaper written together than apart. 5/10 articles live; no reading path complete yet | planned |
| **v3.C** | the visit + jurisdictions | `first-anglican-service-what-to-expect` and `acna-and-continuing-churches-explained` published. No measured volume; justified by conversion — the first is the page that turns a reader into a parish visit, and it is the one where operator first-hand material matters most. 7/10 live; **`from-evangelical` becomes the first complete reading path** | planned |
| **v3.D** | continuing Anglicanism | `what-is-continuing-anglicanism` published. 8/10 live; `from-roman-catholic` completes | planned |
| **v3.E** | chant + prayer-book comparison | `anglican-chant` (60 / psalm tones 30 / coverdale psalter 20) and `1928-vs-1979-book-of-common-prayer` published. 10/10 live; `orthodox-curious` and `from-episcopal` complete, so **all four reading paths go live** and the `/paths/` half of the site stops being dead | planned |
| **v4.A** | Kickoff / decisions lock | audit what currently reads as generic against anglicancompass.org and the wider Anglican-site SERP; decide the differentiators — typeface pairing, palette, layout rhythm, page furniture (ornaments, rules, drop caps), imagery policy — and record them as an ADR in `docs/architecture.md`. No implementation | planned |
| **v4.B** | identity implemented | new design tokens in `src/styles/global.css`; header, footer, article template, cards and the parish finder restyled to the locked decisions; contrast re-checked AA in both palettes; no regression in the perf budget (zero third-party requests, no JS on text pages) | planned |
| **v5.A** | Kickoff / decisions lock | URL architecture **decided: everything nests under `/global/`**, which is itself the hub page. Still open: whether this is a new content collection or an extension of `learn`; the province page template, which is an entity page (primate, founding, membership, prayer book in use, Communion status) not an explainer; and how `what is gafcon` (20) is handled as a section of `/global/gafcon/` rather than a competing page. Recorded as an ADR in `docs/architecture.md`. No implementation | planned |
| **v5.B** | global hub | `/global/` (global anglicanism, 100 — the hub index), `/global/gafcon/` (700, KD 27), `/global/anglican-communion/` (250, KD 32), `/global/anglican-communion-split/` (50), `/global/anglican-realignment/` (20). 1,120/mo validated — more than the whole of v3.B–v3.E combined | planned |
| **v5.C** | province pages | `/global/church-of-south-india/` (40, KD 7), `/global/church-of-nigeria/` (30), `/global/church-of-pakistan/` (10), `/global/church-of-uganda/` (10), `/global/church-of-north-india/` (10), `/global/anglican-church-of-kenya/` (no data). 100/mo validated | planned |
| **v5.D** | country / history pages | `/global/anglicanism-in-africa/` (10); `/global/anglicanism-in-india/`, `/global/anglicanism-in-nigeria/`, `/global/anglicanism-in-pakistan/` (no data — validate before writing) | planned |

**v5 keyword data is the operator's** (Ahrefs, 2026-09-30) and is recorded
here so nothing downstream re-derives or invents it. Two cautions attach to
it. First, the two largest terms — GAFCON at KD 27 and Anglican Communion at
KD 32 — are materially harder than anything in v1 or v3, where difficulty ran KD 1
to 20; this site has no authority yet, so v5.B is a slower payoff than its
volume suggests. Second, this audience is not the stated ICP: these readers
want to understand a worldwide communion, not find a parish in North America.
That is a deliberate widening, not an oversight.

**URL architecture (operator decision, 2026-09-30): everything under
`/global/`,** rather than the root-level slugs of the original request.
`/global/` is the hub index and targets "global anglicanism" (100). The cost
is a little keyword proximity in the URL — `/global/gafcon/` rather than
`/gafcon/` — which is a weak ranking signal; the gain is one crawlable topical
cluster with a real hub, which is what the internal link graph on a
low-authority site actually runs on.

**`/anglican-realigmnent/` in the original request is a typo** and is recorded
here as `/global/anglican-realignment/`.

**Sequencing principle for v3.B–v3.E: search volume first** (operator
decision, 2026-09-30). Pages with measured demand are written before the
strategic ones, because traffic is what the workspace goal is scored on. The
cost is accepted: no reading path completes until 7 of 10 articles are live,
so `/paths/` stays thin through v3.B. Path completion is a consequence of the
order, not a driver of it.

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

## 7. Next steps

State at the end of 2026-09-30. Two articles live and indexable; the build
queue runs v1.E (operator copy), then v2 (draft preview), v3 (the
remaining 8 articles), v4 (visual identity), v5 (global Anglicanism).

### 7.1 Blocked on the operator — nothing else can fix these

1. **`www.anglicanpath.org` returns 522** (CHECK_150). DNS A records for
   `www` exist and point at Cloudflare, but no Worker route or redirect rule
   is bound to that hostname, so nothing serves it. Fix at
   https://dash.cloudflare.com → Workers & Pages → anglicanpath → Settings →
   Domains & Routes: add `www.anglicanpath.org`, or add a Redirect Rule
   `www` → apex 308. This is the only outright broken thing on the site.
2. **Clergy reviewer.** Both live articles carry "Sourced and fact-checked;
   not yet reviewed by clergy" in the byline, which every visitor sees. Once
   a named priest has read them: set `reviewer`, `reviewedDate` and
   `status: reviewed` on each. See `CONTENT_README.md`.
3. **PRD §§ 1–3 are still template text.** The material exists in
   `AI_AGENTS.md` (Summary / Audience / ICP / Goals); it needs restating here
   in the operator's own words.

4. **v1.E — `/about/` copy.** Write the three `<Draft>` sections (mission,
   statement of belief, who runs the site); approve or rewrite every
   `<Proposed>` block on `/about/` and `/about/review/`; resolve the `VERIFY`
   note on "written from study, not generated" — the live articles were
   AI-assisted, so the sentence is not yet true. Then `status: published`.
   See `CONTENT_README.md` § Editorial pages.
5. **v1.E — `hello@anglicanpath.org` cannot receive mail.** The zone has no
   MX records. Enable Email Routing:
   https://dash.cloudflare.com → anglicanpath.org → Email → Email Routing.
6. **v1.E — no phone number, no logo.** `/about/review/` promises withdrawal
   "by email or phone"; set `CONTACT_PHONE` in `src/lib/site.ts` or change
   the copy. Organization JSON-LD omits `logo` until a real one replaces the
   scaffold favicon (`LOGO_PATH`).

### 7.2 Conformance gaps — `portfolio project check anglicanpath.org`

Fixed on 2026-09-30: CHECK_039 (tsconfig), CHECK_071 (meta description),
CHECK_075 (meta robots), CHECK_076 (og:image). Still open:

- **CHECK_060 has-favicon** — still the default Lovable scaffold favicon.
- **CHECK_040 git-remote-name-matches-domain** — repo is `anglicanpath`,
  expected `anglicanpath.org`. Renaming a GitHub repo is outward-facing and
  was deliberately not done unasked.
- **CHECK_080 has-analytics** — no analytics markers. Decide whether this
  site gets any; if so it must not become a render-blocking third-party
  script, since the pages currently make zero third-party requests.
- **CHECK_154 indexnow-submitted** — 2 sitemap URLs not submitted to
  IndexNow.
- **CHECK_147 url-indexed** — 2/10 top URLs indexed. Expected lag on a site
  this young; re-check after ~30 days rather than acting on it.
- **CHECK_143 / CHECK_145 deploy-drift / deploy-fresh** — the portfolio
  inventory has no hosting row for this domain and the freshness probe
  assumes CF Pages, not Workers. Fix by running `portfolio` cleanup so
  `data/portfolio.json` reflects reality.

### 7.3 Decisions still open

- **v5.A:** new content collection vs extending `learn`; and the province
  entity template (primate, founding, membership, prayer book, Communion
  status) — it is not an explainer and needs its own furniture.
- **Reading paths.** Deferred at v1.D: none has more than 2 of 5 steps live,
  so publishing now would ship mostly-dead step lists. They unlock on their
  own at v3.C, v3.D and v3.E. No action needed unless that wait is too long.
- **Tier ordering.** v5.B alone is 1,120/mo of validated demand, more than
  all of v3.B–v3.E combined (~500/mo). It sits last, behind the v4 design
  work, so that the province template is built once on the new design. The
  volume argues for moving it up; the build economics argue for leaving it.
  Operator's call, revisit before starting v4.

### 7.4 Standing reminders

- **Indexing is now a waiting game.** GSC property verified, sitemap
  submitted and force re-fetched 2026-09-30 with both articles in it.
  Nothing further to push at it; coverage fills over ~30 days.
- **Every new page goes through the page lifecycle** — see
  `docs/architecture.md` § 2 and `CONTENT_README.md`. Accuracy gates
  publication; clergy review follows.
- **Versioning is two-level only**, `.A` is always planning. Canonical
  statement: `sites/portfolio/AI_AGENTS.md` § Versioning.
