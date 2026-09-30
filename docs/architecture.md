---
project: anglicanpath.org
last_updated: 2026-09-30
---

# anglicanpath.org — architecture

Design decisions and their rationale. `docs/prd.md` says what ships and
when; this file says how it works and why it was built that way.
`CONTENT_README.md` at the repo root is the practical how-to for
writing a page — it links here for the reasoning.

## 1. Module map

| Path | Role |
|---|---|
| `src/content.config.ts` | Zod schemas for the `learn`, `paths`, `reviewers` and `pages` collections |
| `src/content/learn/*.mdx` | Articles. Filename is the URL slug |
| `src/content/paths/*.mdx` | Guided reading paths |
| `src/content/reviewers/*.md` | Clergy advisory panel. Ships empty |
| `src/content/pages/**/*.mdx` | `/about/`, `/about/review/` |
| `src/layouts/EditorialPage.astro` | Template for `pages`; decides `noindex` |
| `src/lib/placeholders.js` | Placeholder + noindex detection, shared by pages and gate |
| `src/lib/reviewers.ts` | Reviewer lookups; advisory panel layout |
| `src/lib/site.ts` | Site name, URL, contact email/phone, logo |
| `src/lib/content.ts` | Visibility rules — which states build for production |
| `src/lib/jsonld.ts` | Article / BreadcrumbList / Organization / FAQPage builders |
| `src/lib/taxonomy.ts` | Topic labels, reading-time |
| `src/pages/learn/[slug].astro` | Article template |
| `src/pages/content-audit.json.ts` | Build-time feed for the gate; deleted after use |
| `scripts/check-content.mjs` | The content quality gate |

## 2. Page lifecycle

**Page lifecycle** — the named states a page moves through from first
draft to clergy-endorsed, the conditions for each transition, and what
each state means for the production build. It is the load-bearing design
decision on the content side: it determines what can reach a reader and
what blocks a deploy. Where this document, `CONTENT_README.md` or a
commit message says "page lifecycle", it means this section.

### 2.1 States

```
   ┌─────────┐   facts checked    ┌──────────────┐   sources + no
   │  draft  │ ─────────────────▶ │ fact-checked │   placeholders
   └─────────┘   sources cited    └──────────────┘   ─────────────┐
        ▲                                 │                       │
        │                                 │                       ▼
        │                                 │              ┌─────────────┐
        │ correction needed               │   LIVE ──────│  published  │
        └─────────────────────────────────┴──────────────└─────────────┘
                                                                │
                                                                │ named clergy
                                                                │ reviewer signs off
                                                                ▼
                                                        ┌──────────────┐
                                                   LIVE │   reviewed   │
                                                        └──────────────┘
```

| State | Built for production | In sitemap | Reviewer line on page |
|---|---|---|---|
| `draft` | no | no | — |
| `fact-checked` | no | no | — |
| `published` | **yes** | yes | "Not yet theologically reviewed" |
| `reviewed` | **yes** | yes | "Reviewed by ‹name›, ‹title› on ‹date›" |

### 2.2 Why review comes after publication

This is a **publish-then-review** model (post-publication review),
chosen over the review-then-publish model the first version of the gate
enforced.

The original design made a named clergy reviewer a precondition of
publication. That made factual accuracy and theological endorsement a
single gate, and in practice the second held the first hostage: a page
whose every claim was checked and cited still could not go live, so
`/learn/` stayed empty and the site had nothing to rank.

Splitting them lets accuracy gate publication — which Claude and the
build can both enforce — and lets endorsement follow on a human's
timetable. The costs are accepted deliberately:

- A live page may carry doctrinal framing no priest has signed off.
  The page says so, in the byline position where a reader looks for
  exactly that.
- `AI_AGENTS.md` describes the site as "reviewed by named clergy."
  That remains the destination state, not a precondition, and the
  distinction is visible on the page rather than buried here.

### 2.3 What each transition requires

**draft → fact-checked.** Every claim checked against a source; `sources`
populated; no `DRAFT`, `VERIFY` or `UNVERIFIED` markers left; every
`<ComparisonTable>` cell filled; `proposed: false`.

**fact-checked → published.** An editorial decision, not a new
condition. The gate's publication rules are already satisfied at
`fact-checked`; moving to `published` is the operator choosing to make
it live.

**published → reviewed.** A named priest has read it. `reviewer` and
`reviewedDate` set. This is the only transition Claude cannot perform.

**any → draft.** A correction sends a page back. Returning to `draft`
removes it from the production build on the next deploy, which is the
retraction mechanism.

### 2.4 Why unpublished states are absent rather than noindexed

Unbuilt, not built-with-`noindex`. Three consequences follow, all wanted:
there is no placeholder page to leak, `@astrojs/sitemap` needs no
filtering because it only sees built pages, and there is no `noindex`
tag to maintain or forget.

The trade-off is that a live page cannot link to an unbuilt one. Every
internal link therefore resolves through `src/lib/content.ts`, which
degrades an unresolvable target to plain text; the gate fails the build
on any dead link that survives.

## 3. The content quality gate

`scripts/check-content.mjs`, run by `pnpm build` after `astro build`.
Conditions are fatal for a page in a live state and advisory otherwise,
so an unfinished draft warns and a bad publication stops the deploy.

Frontmatter and raw bodies reach it through a prerendered endpoint
(`src/pages/content-audit.json.ts`) rather than Astro's internal
`.astro/data-store.json`, which is devalue-serialised and not a public
API. The endpoint's output is deleted after the check, pass or fail,
because it contains unpublished draft bodies.

`pnpm build:only` skips the gate. Its `dist/` must not be published.

## 4. Indexing and placeholders

**Rule: a built page that still shows placeholder text is `noindex` and
absent from the sitemap.** Articles and paths satisfy it by not being built
at all (§ 2.4). Everything else — `/about/`, the office readers, the sample
parish finder — is built, so it needs the rule stated separately.

- **Pages decide their own `noindex`** from their source, via
  `src/lib/placeholders.js`: `EditorialPage` from `status` + the MDX body,
  the office readers from `src/data/office.ts`, the parish finder
  unconditionally while it holds sample data. Filling the last placeholder
  flips a page to indexable with no code change.
- **The sitemap follows the built HTML.** `astro.config.mjs` filters out any
  page whose `<meta name="robots">` says `noindex`, so the two cannot
  disagree.
- **Small placeholders inside otherwise-real pages** (homepage, `/office/`)
  render in `astro dev` only rather than noindexing the whole page.
- **The gate enforces it** on every built page: an indexable page showing
  placeholder text, or a sitemap URL that is not a built indexable page,
  fails the build. It also prints every noindex URL.
- **Sample data is not a placeholder page — it is worse.** The invented
  parishes in `src/data/parishes.ts` get no detail pages in production at
  all; the finder that lists them is noindex and says on the page that none
  of them exists.

## 5. Tracked refactors

- *(none open)*
