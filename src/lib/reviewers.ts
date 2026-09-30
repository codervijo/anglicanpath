// Reviewer lookups shared by the advisory panel, the reviewer profile pages
// and the article byline. The `reviewers` collection ships empty; every
// consumer must render its empty state honestly rather than hide it.
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Reviewer = CollectionEntry<'reviewers'>;

/** How the advisory panel lays itself out for a given number of reviewers. */
export type PanelLayout = 'empty' | 'few' | 'several';

export const panelLayout = (count: number): PanelLayout =>
  count === 0 ? 'empty' : count <= 2 ? 'few' : 'several';

export const reviewerHref = (id: string): string => `/about/reviewers/${id}/`;

const byName = (a: Reviewer, b: Reviewer) => a.data.name.localeCompare(b.data.name);

export async function allReviewers(): Promise<Reviewer[]> {
  return (await getCollection('reviewers')).sort(byName);
}

export async function activeReviewers(): Promise<Reviewer[]> {
  return (await allReviewers()).filter(r => r.data.status === 'active');
}

export async function emeritusReviewers(): Promise<Reviewer[]> {
  return (await allReviewers()).filter(r => r.data.status === 'emeritus');
}

/** Resolve an article's `reviewer` reference, or null. */
export async function resolveReviewer(
  ref: { collection: 'reviewers'; id: string } | null,
): Promise<Reviewer | null> {
  if (!ref) return null;
  return (await getEntry(ref)) ?? null;
}
