# AI Agent Context — anglicanpath.org

## Summary

*one paragraph: what this site is, what it does*

anglicanpath.org is a non-profit resource that helps people discover the Anglican faith, find a traditional Anglican parish, and pray the Daily Office. It has three layers: fair, source-backed explainer articles for people exploring Anglicanism (starting with comparisons such as "Anglican vs Catholic"); a parish finder covering ACNA and Continuing Anglican jurisdictions, with verified details on prayer book, churchmanship, and service times; and a traditional Daily Office based on the 1928 and 1662 Books of Common Prayer. It is written from an openly traditional Anglican conviction, reviewed by named clergy, and free of ads and paywalls.

## Audience

*one sentence: who this is for (broad demographic)*

Christians exploring Anglicanism from Evangelical, Roman Catholic, Orthodox-curious, or Episcopal backgrounds, and traditional Anglicans in ACNA and Continuing parishes who pray the Daily Office.

## ICP

*the specific ideal customer — demographics, pain points, what they use today. More detail than Audience: Audience is the broad demo ("homeowners with EV chargers"), ICP is the specific targetable subset ("Tesla owners in CA who installed in last 90d, paid $2k+")*

A churchgoing Christian in North America, often in their 20s to 40s, who is drawn to liturgy, sacraments, and historic Christianity but unsure where Anglicanism fits. They typically come from an Evangelical or Reformed church, are weighing Rome or Orthodoxy, or are an Episcopalian unsettled by recent changes and looking for a traditional parish. They are searching questions like "anglican vs catholic" and "is anglican protestant," and currently find answers mainly in Reddit threads. They want a fair explanation, primary sources, and a concrete next step: a nearby parish where the worship matches what they have read. A secondary ICP is the lay or clergy member of a small ACNA or Continuing parish who wants a traditional online Daily Office and trustworthy material to hand to newcomers.

## Goals

*1-2 sentences: primary business / product goal*

Become the most trusted starting point for people exploring traditional Anglicanism, and move readers from questions to a parish visit. Near-term milestones: the "Anglican vs Catholic" page ranks in the top 10, parishes are verified in the finder through ACNA and Continuing contacts, and the 1928 office gets daily repeat use.

## Tech stack

Astro project under the sites/* workspace. Build path goes
through the parent `sites/Makefile` (Docker-orchestrated) which delegates
per-stack work to the central builder at `~/work/projects/builder/`.

## Project structure

- `src/` — application source
- `src/content/` — the editorial content: `learn/*.mdx` (articles) and
  `paths/*.mdx` (guided reading paths). Schemas in `src/content.config.ts`.
  **How to write one: `CONTENT_README.md` at the repo root.**
- `public/` — static assets copied to `dist/` at build (favicons, OG images, `_headers`)
- `docs/` — PRD, Prompts log
- `Makefile` — thin forwarder to `../Makefile`
- `wrangler.jsonc` — Cloudflare deploy config
- `scripts/check-content.mjs` — build-time content quality gate; runs as part
  of `pnpm build` and fails the build on an under-cooked published page

## Building info

All dev work runs inside the parent `sites1` docker container. The host doesn't
need Node/pnpm installed; the container does. The parent `Makefile`
(`../Makefile` from this dir) is the canonical entry point.

### Why docker

- Pinned Node + pnpm versions match Cloudflare's build env.
- Avoids polluting the host with per-project node_modules.
- Same image serves every sibling project under sites/.

### Common Makefile targets

This project's local `Makefile` forwards every target to `../Makefile` with
`proj=anglicanpath.org`, so these all work either from this dir or from `sites/`:

| Command | What it does |
|---|---|
| `make buildsh` *(from `sites/`)* | Drop into a bash shell inside the docker container at `/usr/src/app` (= `sites/` mounted in). |
| `make run` *(from here)* / `make run proj=anglicanpath.org` *(from `sites/`)* | `pnpm install` then start dev server (auto-detected). |
| `make check-vite proj=anglicanpath.org` | Start the dev server, skipping install. |
| `make test proj=anglicanpath.org` | `pnpm install` + `pnpm build` + `pnpm test`. **Hard-fails outside docker** — `make buildsh` first, or `docker exec`. |
| `make deps` | Install pnpm globally (image bootstrap). |
| `make clean` *(from `sites/`)* | Remove root `package.json`, lockfile, node_modules. Don't run inside a project dir. |

### Running Make targets from a Claude Code session

The Bash tool runs on the host as `vijo`, not inside docker. To execute a
target inside the container, find the running container and `docker exec` in:

```bash
docker ps                                               # find the sites1 container name
docker exec -w /usr/src/app <name> make test proj=anglicanpath.org
```

## Deployment info

- **Platform:** Cloudflare Workers (Static Assets) — *not* Vercel.
- **Config:** `wrangler.jsonc` at the repo root — points `assets.directory` at `./dist`, and sets `not_found_handling: "404-page"` (this is a static MPA, not an SPA; the SPA setting returned HTTP 200 + the homepage for every unmatched path, which Google indexes as a soft 404) and `html_handling: "force-trailing-slash"` to match Astro's `trailingSlash: 'always'`.
- **Headers:** `public/_headers` — cache (`/assets/*` immutable, HTML no-cache) + security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`). Vite copies `public/` into `dist/` at build, so the file ships with the assets.
- **Build:** `pnpm build` → `dist/`. Wrangler picks up `dist/` via `wrangler.jsonc`.
- **Deploy:** `wrangler deploy` (locally) or via Cloudflare's Git integration on push.
  Initial GitHub repo + CF Pages project setup is automated by the portfolio CLI:
  `cd ../portfolio && make run ARGS="deploy anglicanpath.org"` runs `gh repo create` and
  POSTs to the CF Pages API with `build_command="pnpm run build"` set explicitly
  (avoids the bun-detection trap kwizicle.com hit). Idempotent; safe to re-run.
- **Vite version:** must be ≥ 6.0.0 — Wrangler's Vite integration rejects Vite 5.
- **Env vars:** set `VITE_*` vars (e.g. `VITE_GA_ID`) in the Cloudflare Workers project's environment-variable settings — they're inlined at build time.
- **Live URL:** https://anglicanpath.org/  *(update once first deploy succeeds)*
- **Canonical host:** the **apex** (`https://anglicanpath.org/`) is the ONLY canonical host fleet-wide — `www` and `http` must 308→apex, and there is no `www`-canonical option. Set Astro's `site: "https://anglicanpath.org"` (apex, never `www`) so every `<link rel="canonical">` and the generated sitemap `<loc>` URLs use the apex. Enforced by CHECK_150 (redirect) + CHECK_158 (canonical tags) + CHECK_159 (sitemap) + CHECK_160 (GSC-registered sitemap).
- **Legacy:** if a `vercel.json` or `.vercelignore` is present from a Lovable export, it's inert on Cloudflare and safe to delete.

## Content strategy

*what content this site needs — page types, initial topics, format mix (long-form vs reference vs tool)*

Page types: long-form explainer and comparison articles; guided reading paths (Evangelical → Anglican, Roman Catholic → Anglican, Orthodox-curious → Anglican, Episcopal → ACNA/Continuing); parish finder listings and detail pages; dated Daily Office pages (for example /office/1928/morning/2026-09-18); and later, prayer book comparison pages by topic and an Anglican chant guide. Topics, in priority order from keyword data: Anglican vs Catholic (1.5K US / 4.5K global searches a month, difficulty 1; covers "is anglican protestant" and "church of england vs catholic" as sections), What is the Anglican Church (900), the 1928 Book of Common Prayer (150, difficulty 3), and the Book of Common Prayer online across editions (150); then strategic pages with little measured volume that lead readers toward a parish (What is Continuing Anglicanism, ACNA and the Continuing churches explained, What to expect at your first Anglican service); then small, easy terms (Anglican chant, the 1662 prayer book, 1928 vs 1979). Format mix: roughly 60% articles and paths, 25% dated office pages, 15% finder and utility pages. Every article is written from first-hand material, carries a named clergy reviewer, cites primary sources, and links to the main page and the finder.

### Post-deploy checklist (do these once after the first successful deploy)

- [ ] Verify in **Google Search Console** at https://search.google.com/search-console — add as `sc-domain:anglicanpath.org` property; verify via DNS TXT record. Until this is done, no SEO traffic data is observable for this site (and the workspace-wide `30 commercial sites with traffic` goal can't credit it).
- [ ] Submit the sitemap (`https://anglicanpath.org/sitemap-index.xml` — the apex host; `@astrojs/sitemap` emits `-index`, not `/sitemap.xml`) inside GSC. *(The deploy pipeline auto-submits the robots.txt-declared sitemap; this is the manual fallback.)*
- [ ] Update the **Live URL** above with the actual deploy URL.
- [ ] Run `make run ARGS="cleanup"` from `sites/portfolio/` so `data/portfolio.json` reflects the new project's state (and `project status anglicanpath.org` resolves cleanly).

## How to run

```bash
# from this dir, after `make buildsh` from sites/:
make deps      # → pnpm install via the central builder
make run       # → dev server
make build     # → dist/
make test      # → pnpm install + build + test (must be inside container)
```

## How this project is checked

This project is enforced against shared sites/* conventions by
`portfolio project check anglicanpath.org` (run from `sites/portfolio/`).
Conformance is driven by the universal check catalog (CHECK_*) —
e.g. CHECK_020 (own-git-repo), CHECK_002 (has-ai-agents-md),
CHECK_007 (has-docs-prompts), CHECK_008 (has-docs-growth — `docs/growth.md`
exists — the per-project growth-experiment log; see Growth log section
below), CHECK_001 (has-readme), CHECK_009 (has-gitignore), CHECK_035
(vite-version-ok), CHECK_003 / CHECK_004 (AI_AGENTS.md `## Building info` +
`## Deployment info` headings). See the full catalog with
`portfolio check catalog`. The bootstrap output satisfies all of these on
day zero — keep it that way.

If `project check` flags a regression, fix it. v6.C's `portfolio project fix`
will eventually auto-fix; until then, hand-edit.

## Growth log — per-project experiment tracker

`docs/growth.md` is this project's append-only log of growth experiments
(content, SEO, marketing, structural changes). Each entry is a dated H2
with a measurable hypothesis + KPI + observation window (default 28d).
Read **the full workflow inside `docs/growth.md`** — it's self-sustaining
so you don't have to remember the lifecycle from outside the file.

Update it whenever you do something growth-relevant on this site. The
data source is GSC (`portfolio gsc sync` from the portfolio dir); this
file narrates *why*.

## Strategy reminder — ship fast, let the market decide

This sites/* workspace is shipping commercial sites toward a
**30-site SEO-traffic goal**. The convention is **build & ship fast,
then let GSC data drive what to invest more in.** Don't over-polish
before launch. Get a minimum-viable version live, indexed, then
iterate on whichever sites actually attract traffic.

Translation for this project: prefer shipping over perfection. The
SEO baseline files (`public/robots.txt`, `public/sitemap.xml`),
deploy config, and dev tooling (`vitest`) are pre-scaffolded so you
can ship today.

## Versioning

This project follows the sites/* **canonical versioning convention** (defined
in `sites/portfolio/AI_AGENTS.md`):

- **`vN`** — major capability tier. Each is a coherent shipped capability and
  may break compat with the previous tier. SemVer-MAJOR semantics.
- **`vN.X`** — phase letter within a tier (A / B / C / …). Internal slicing of
  build work; signals "order/scope can shift." Each phase still ships
  independently.
- **`vN.X.Y`** — numeric sub-phase for follow-up work that lands AFTER `vN.X`
  shipped (e.g. polish, bug fixes, scope cuts).

Two-layer notation separates **external version** (what consumers see) from
**internal phasing** (how the team slices work). Letters signal *un-promised* —
nobody mistakes `v1.B` for a SemVer minor release.

**Always use this numbering when planning or shipping work on this project.**
Specifically:

- Every entry in `docs/prd.md`'s phases table uses `vN.X` (or `vN.X.Y`).
- Every commit message that ships a phase mentions its version (e.g.
  `v1.B — auth flow`).
- Every entry in `docs/Prompts.md` references the version of the work it
  describes when relevant.

Don't introduce a parallel scheme (no `0.1.0` / `Sprint 3` / etc.). When in
doubt, the canonical statement is `sites/portfolio/AI_AGENTS.md`.

Track this project's progress in `docs/prd.md` against this taxonomy. v0.A is
the bootstrap (this scaffold); v1.A is the first real shipped capability.

## Conventions

- Stack: astro
- **Package manager: pnpm only.** No `bun.lockb`, no `package-lock.json`, no `yarn.lock` — they cause CF Pages to pick the wrong manager and break the build. The `pnpm-lock.yaml` is the only lockfile that should ever be committed.
- **Content is MDX in `src/content/`, never hardcoded in a page.** Articles and
  paths are content-collection entries; `status: draft` / `review` entries are
  rendered in `astro dev` only and are absent from a production build, so the
  sitemap and every index are clean by construction. Don't add a `noindex`
  path for them — see `src/lib/content.ts`.
- **`pnpm build` runs the content gate** (`scripts/check-content.mjs`) after
  `astro build`. `pnpm build:only` skips it and leaves `content-audit.json`
  — which contains unpublished draft bodies — in `dist/`. Never publish that.
- Build path: this project's `Makefile` → `../Makefile` → `~/work/projects/builder/`
- Cloudflare deploy constraints: Vite ≥ 6, frozen-lockfile install, no `_redirects` SPA fallback (handled by `wrangler.jsonc`'s `not_found_handling` instead).
- **Versioning**: two-level `vN` / `vN.X` — see Versioning section above and `sites/portfolio/AI_AGENTS.md` for the canonical statement.

## Out of scope / don't touch

- *(leave blank — fill in when something is)*
