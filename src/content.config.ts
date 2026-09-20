// Content collections for the editorial side of the site.
//
// Two collections: `learn` (articles at /learn/<slug>/) and `paths`
// (guided reading paths at /paths/<pathId>/). Both are markdown + frontmatter
// loaded by the glob loader; the entry `id` is the filename, which IS the URL
// slug.
//
// A note on lengths. The house rules want `title` <= 65 chars and
// `description` 120-160 chars, but they also want those to be a *warning* on
// draft/review pages and a *build failure* only on published ones. Zod can't
// express "fail conditionally on another field" without making every
// half-written draft unloadable, so the length rules deliberately live in
// scripts/check-content.mjs instead. Keep them there.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Named clergy reviewer. Null until the operator has one; never invented. */
const reviewer = z.object({
  name: z.string(),
  title: z.string(),
});

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
  loader: glob({ pattern: '**/*.md', base: './src/content/learn' }),
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
    status: z.enum(['draft', 'review', 'published']).default('draft'),
    reviewer: reviewer.nullable().default(null),
    reviewedDate: z.coerce.date().nullable().default(null),
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
  loader: glob({ pattern: '**/*.md', base: './src/content/paths' }),
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
    status: z.enum(['draft', 'review', 'published']).default('draft'),
    updatedDate: z.coerce.date(),
    proposed: z.boolean().default(true),
  }),
});

export const collections = { learn, paths };
