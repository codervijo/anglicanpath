# Prompt History — anglicanpath.org

<!-- Append new prompts at the bottom, newest last. Format:

## YYYY-MM-DD [optional title]
> <prompt text or short summary>

The dated H2 (`## YYYY-MM-DD`) is what `portfolio project check` parses
to surface "last AI prompt" per project. Keep entries append-only.
-->

## 2026-09-19 — scaffolded via portfolio new bootstrap

> Created project skeleton. Stack chosen, scaffolding written, git initialized.

## 2026-09-19 — v1.B: SEO-ready content platform for the first 10 articles

> Finish the SEO-ready content pages for the site's first 10 articles, using
> Astro static pages deployed to Cloudflare. Inspect first and propose a plan;
> do not write theological, historical, doctrinal or liturgical prose, and do
> not invent quotations, citations, statistics, dates or clergy names — article
> bodies come from the operator's first-hand material and stay as marked
> placeholders. Create `learn` and `paths` content collections with Zod
> schemas, an article template (breadcrumbs, single H1, reviewer line, auto
> TOC, primary sources, related block, parish CTA), technical SEO (canonical,
> OG/Twitter, Article + BreadcrumbList + Organization + conditional FAQPage
> JSON-LD, sitemap, robots, 404), drafts excluded from the production build,
> self-hosted subset fonts and no render-blocking third-party scripts, and a
> build-time gate that fails the build on an under-cooked published page.

Shipped as four commits. Operator decisions taken during the plan step:
keep `/find-a-parish/` (not `/find/`); delete the 7 leftover prototype article
stubs and the 5th path; approve `@fontsource-variable/*`; report measured
performance proxies instead of installing headless Chrome in the shared
`sites1` image.

## 2026-09-30 — v1.C / v1.D shipped; v1.E–v1.H, v2, v3 planned

> Session covered: publish-then-review page lifecycle; both pillar articles
> written, sourced and published; GSC verified and sitemap re-submitted;
> homepage SEO tags fixed; version numbering corrected to the canonical
> two-level scheme; remaining 8 content pages planned as v1.E–v1.H
> (search-volume-first ordering); own visual identity planned as v2; global
> Anglicanism planned as v3 under `/global/`.

Next steps are consolidated in `docs/prd.md` § 7.
