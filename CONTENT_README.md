# Writing content for anglicanpath.org

Everything readers see under `/learn/` and `/paths/` lives in
`src/content/` as MDX. Nothing else needs editing to publish an article.

```
src/content/
├── learn/   one .mdx per article  →  /learn/<filename>/
└── paths/   one .mdx per path     →  /paths/<filename>/
```

The filename **is** the URL slug. Renaming a file changes the URL.

---

## The one rule that matters

**Claude does not write the body.** Titles, descriptions, keywords,
outlines, section briefs, FAQ question wording and proposed internal
links are drafted for you to review; the prose under each heading is
yours, written from first-hand material. Every unwritten block is a
marker:

```mdx
{/* DRAFT: first-hand material needed — what this section must answer */}
```

You write by **replacing the marker with prose**. The build gate refuses
to publish a page that still has one.

> MDX has no HTML comments, so `<!-- DRAFT: ... -->` is written
> `{/* DRAFT: ... */}`. The gate catches both, plus `[DRAFT: ...]` and
> any `[1662 BCP: ...]`-style prayer book placeholder.

Prayer book text is never reproduced from memory. Leave
`[1928 BCP: text to be inserted]` until you have the book in front of
you.

---

## Draft → review → published

`status:` in frontmatter controls everything.

| status | Built in `astro dev` | Built for production | In the sitemap | Gate |
|---|---|---|---|---|
| `draft` | yes | **no** | no | warns |
| `review` | yes | **no** | no | warns |
| `published` | yes | yes | yes | **fails the build on any problem** |

Unpublished pages are not built for production at all — there is no
placeholder page to leak and no `noindex` tag to forget. The trade-off is
that **a published article cannot link to an unpublished one**: the gate
reports that as a broken internal link. Publish the two pillar articles
(`anglican-vs-catholic`, `what-is-the-anglican-church`) first; every other
article is required to link to one of them.

### To publish an article

1. Replace every `{/* DRAFT: ... */}` with prose.
2. Place at least **two** contextual internal links in the body. The
   proposed ones are listed in frontmatter under `proposedLinks` and shown
   in the dev-only editorial panel on the page itself.
3. Fill every cell of any `<ComparisonTable>` — replace each `null`.
4. Write every `faq` answer, or delete the entries you don't want.
   Placeholder answers are never emitted as FAQPage structured data.
5. Add `sources` (below).
6. Add a `reviewer` and `reviewedDate` (below).
7. Set `proposed: false` — this is your sign-off that the title,
   description and keywords are yours, not Claude's.
8. Set `status: published`.
9. `pnpm build`. If the gate complains, it is right.

---

## Adding a reviewer

```yaml
reviewer:
  name: "The Revd Jane Doe"
  title: "Rector, St Example's, Springfield"
reviewedDate: 2026-10-04
```

Both are required to publish. They render as a
"Reviewed by … on …" line under the summary, and as `reviewedBy` in the
Article structured data. Leave them `null` until a named person has
actually read the finished article — never fill them speculatively.

## Adding sources

```yaml
sources:
  - title: "The Book of Common Prayer (1662)"
    author: "Church of England"
    url: "https://example.org/1662"
    note: "Preface, on the purpose of the revision"
```

`title` is required; `author`, `url` and `note` are optional. They render
under **Primary sources** with citation styling. An empty list blocks
publication.

---

## Frontmatter reference

Defined and validated in `src/content.config.ts`.

| Field | Notes |
|---|---|
| `title` | Aim for ≤ 60 characters; over 65 fails the gate. |
| `description` | Meta description. Must be 120–160 characters. |
| `slug` | Must equal the filename. |
| `targetKeyword` | The one query this page is written to win. |
| `secondaryKeywords` | Variants the outline should cover. |
| `searchIntent` | `informational` · `comparison` · `navigational` |
| `topic` | `basics` · `comparisons` · `prayer-book` · `sacraments` · `history` · `jurisdictions` · `music` |
| `status` | `draft` · `review` · `published` |
| `reviewer` / `reviewedDate` | See above. |
| `updatedDate` | Bump when you meaningfully revise. Drives `dateModified`. |
| `sources` | See above. |
| `related` | Slugs; render as "Related questions". |
| `paths` | Reading paths this article belongs to. |
| `faq` | `q` / `a` pairs. Optional. |
| `proposed` | `true` while the metadata is Claude's draft. |
| `proposedLinks` | Suggested internal links, shown in the dev panel only. |

Length rules live in the gate rather than the schema on purpose — a
half-written draft with a 40-character description must still load in
`astro dev`.

---

## Components you can use in a body

```mdx
<ComparisonTable
  caption="Anglican and Roman Catholic teaching compared."
  columns={["Anglican", "Roman Catholic"]}
  rows={[
    { question: "Final authority", cells: ["…", "…"] },
    { question: "The papacy",      cells: [null, null] },
  ]} />
```

A `null` cell renders as a visible placeholder and blocks publication.
Everything else is ordinary Markdown — headings, lists, links,
blockquotes, tables.

**Headings:** the `#` H1 is generated from `title`. Start body headings at
`##`. A stray `#` in the body fails the gate. The table of contents builds
itself from your `##`s.

---

## Reading paths

`src/content/paths/*.mdx`. The body is a short introduction; the reading
list comes from frontmatter:

```yaml
steps:
  - article: what-is-the-anglican-church
    note: "Start with what Anglicanism is on its own terms."
```

A step pointing at an article that isn't published renders as plain text
with "not yet published" rather than a dead link.

---

## Commands

All builds run inside the shared `sites1` container — this repo has no
host toolchain, and **pnpm is the only supported package manager**.

```bash
# from ~/work/projects/sites/
make buildsh                      # shell into the container

# then, from /usr/src/app/anglicanpath.org/
pnpm dev                          # drafts visible, editorial panel on
pnpm build                        # astro build + the content gate
pnpm check:content                # the gate alone, against the last build
pnpm test                         # vitest
pnpm clean:cache                  # see below
```

### When `astro dev` throws and `astro build` doesn't

Vite pre-bundles dependencies into `node_modules/.vite/deps` and bakes the
resolved paths in. Swap a dependency's version and that cache still points at
the old copy, so the dev server imports a package that no longer matches the
installed Astro — typically surfacing as a `TypeError` about a missing export
(`renderStreaming is not a function`, say) with a stack trace naming a version
you no longer have installed. The production build doesn't use that cache, so
it keeps working, which makes the failure look stranger than it is.

```bash
pnpm clean:cache && pnpm dev
```

Do this after any dependency change.

Or without the shell:

```bash
docker exec -w /usr/src/app/anglicanpath.org sites1 pnpm build
```

`pnpm build:only` skips the gate. Its `dist/` contains
`content-audit.json`, which includes unpublished draft bodies — never
publish a `dist/` built that way.

---

## What the gate checks

Fails the build for a `published` page, warns for `draft` / `review`:

- reviewer or reviewedDate missing
- `sources` empty
- description outside 120–160, or title over 65
- more than one `<h1>` in the rendered page
- fewer than 2 internal links in the body
- any remaining DRAFT placeholder (body, FAQ answer, or table cell)
- `proposed: true` still set
- `slug` disagrees with the filename
- `related` / `paths` / `steps` pointing at a slug that doesn't exist
- no link to either pillar article

Broken internal links fail the build always, whatever the status — if it
is in `dist/`, it shipped.
