// Content collections for the editorial side of the site.
//
// Four collections: `learn` (articles at /learn/<slug>/), `paths`
// (guided reading paths at /paths/<pathId>/), `reviewers` (the clergy panel)
// and `pages` (/about/ and friends). All are markdown + frontmatter
// loaded by the glob loader; the entry `id` is the filename, which IS the URL
// slug.
//
// A note on lengths. The house rules want `title` <= 65 chars and
// `description` 120-160 chars, but they also want those to be a *warning* on
// draft/review pages and a *build failure* only on published ones. Zod can't
// express "fail conditionally on another field" without making every
// half-written draft unloadable, so the length rules deliberately live in
// scripts/check-content.mjs instead. Keep them there.
import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** A primary or scholarly source, rendered in the article's citations list. */
const source = z.object({
  title: z.string(),
  author: z.string().optional(),
  url: z.string().url().optional(),
  note: z.string().optional(),
});

/**
 * A contextual internal link Claude has *proposed* for the operator to place
 * while writing the body. Rendered as a dev-only review panel on drafts; it is
 * not a substitute for the real in-body links the quality gate counts.
 */
const proposedLink = z.object({
  slug: z.string(),
  anchorText: z.string(),
  placement: z.string(),
});

const learn = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/learn' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    targetKeyword: z.string(),
    secondaryKeywords: z.array(z.string()).default([]),
    searchIntent: z.enum(['informational', 'comparison', 'navigational']),
    topic: z.enum([
      'basics',
      'comparisons',
      'prayer-book',
      'sacraments',
      'history',
      'jurisdictions',
      'music',
    ]),
    /**
     * Page lifecycle. See docs/architecture.md § 2.
     *   draft        — being written; not built for production
     *   fact-checked — every claim sourced, no placeholders; not yet live
     *   published    — LIVE. Accurate, but no priest has endorsed it
     *   reviewed     — LIVE. A named priest has read and signed off
     * Publication is gated on accuracy; theological endorsement follows.
     */
    status: z.enum(['draft', 'fact-checked', 'published', 'reviewed']).default('draft'),
    /** Id of an entry in the `reviewers` collection. Required to reach
     *  `reviewed`, and only then. Never filled speculatively. The reviewer's
     *  own `articlesReviewed` must list this slug too — the gate checks both. */
    reviewer: reference('reviewers').nullable().default(null),
    /** The date the reviewer signed off on the version now live. A
     *  substantive edit sends the article back to `published` and clears it. */
    reviewedDate: z.coerce.date().nullable().default(null),
    /** Optional note from the reviewer, in their own words, shown beside the
     *  signature. Only ever text the reviewer supplied. */
    reviewerNote: z.string().nullable().default(null),
    updatedDate: z.coerce.date(),
    sources: z.array(source).default([]),
    /** Slugs of sibling articles, rendered as "Related questions". */
    related: z.array(z.string()).default([]),
    /** Guided reading paths this article belongs to. */
    paths: z.array(z.string()).default([]),
    /** Answers stay placeholders until the operator writes them; FAQPage
     *  JSON-LD is emitted only for entries with a real answer. */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    /** True while the metadata above is Claude-drafted and unreviewed. The
     *  quality gate refuses to publish a page that still has it set. */
    proposed: z.boolean().default(true),
    proposedLinks: z.array(proposedLink).default([]),
  }),
});

const paths = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/paths' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    audience: z.string(),
    /** Ordered article slugs, each with a one-line note on why it comes here. */
    steps: z.array(z.object({ article: z.string(), note: z.string() })),
    cta: z
      .object({ label: z.string(), href: z.string() })
      .default({ label: 'Find a parish near you', href: '/find-a-parish/' }),
    /** Same lifecycle as `learn`; paths carry no reviewer. */
    status: z.enum(['draft', 'fact-checked', 'published', 'reviewed']).default('draft'),
    updatedDate: z.coerce.date(),
    proposed: z.boolean().default(true),
  }),
});

/**
 * Clergy on the advisory panel — one markdown file per reviewer, frontmatter
 * only. Ships EMPTY: an entry is added only for a real priest who has agreed
 * to review, with the details they have approved. No sample entries, ever.
 * Rendered by src/components/site/AdvisoryPanel.astro and
 * src/pages/about/reviewers/[id].astro.
 */
const reviewers = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/reviewers' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      /** As the reviewer styles it, e.g. their ecclesiastical title. */
      title: z.string(),
      parish: z.string(),
      jurisdiction: z.string(),
      /** The parish's website — the outbound link on the panel. */
      url: z.string().url(),
      bio: z.string(),
      photo: image().optional(),
      /** Slugs of `learn` articles this reviewer has signed. */
      articlesReviewed: z.array(z.string()).default([]),
      joinedDate: z.coerce.date(),
      status: z.enum(['active', 'emeritus']).default('active'),
    }),
});

/**
 * Standalone editorial pages (/about/, /about/review/). The body is MDX; the
 * page lifecycle is simpler than `learn`'s:
 *   draft     — built but noindex and out of the sitemap
 *   published — indexable, provided no placeholder and no <Proposed> block
 *               remains; scripts/check-content.mjs fails the build otherwise
 * Filling the last placeholder and setting `status: published` is the whole
 * switch — no code change.
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** H1 — may differ from the <title>. */
    heading: z.string(),
    /** One line under the H1. */
    summary: z.string(),
    status: z.enum(['draft', 'published']).default('draft'),
    updatedDate: z.coerce.date(),
  }),
});

export const collections = { learn, paths, reviewers, pages };
