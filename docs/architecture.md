---
project: anglicanpath.org
last_updated: 2026-09-29
---

# anglicanpath.org — architecture

Design decisions and their rationale. `docs/prd.md` says what ships and
when; this file says how it works and why it was built that way.
`CONTENT_README.md` at the repo root is the practical how-to for
writing a page — it links here for the reasoning.

## 1. Module map

| Path | Role |
|---|---|
| `src/content.config.ts` | Zod schemas for the `learn` and `paths` collections |
| `src/content/learn/*.mdx` | Articles. Filename is the URL slug |
| `src/content/paths/*.mdx` | Guided reading paths |
| `src/lib/content.ts` | Visibility rules — which states build for production |
| `src/lib/jsonld.ts` | Article / BreadcrumbList / Organization / FAQPage builders |
| `src/lib/taxonomy.ts` | Topic labels, reading-time |
| `src/pages/learn/[slug].astro` | Article template |
| `src/pages/content-audit.json.ts` | Build-time feed for the gate; deleted after use |
| `scripts/check-content.mjs` | The content quality gate |

## 2. Editorial workflow

The publication lifecycle of an article. This is the load-bearing
design decision on the content side: it determines what can reach a
reader and what blocks a deploy.

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

## 4. Tracked refactors

- *(none open)*
