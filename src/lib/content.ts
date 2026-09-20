// Visibility rules for editorial content.
//
// Draft and review pages are built in `astro dev` only. In a production build
// they are not rendered at all, which means:
//   - they cannot be reached, so there is no placeholder page to leak;
//   - @astrojs/sitemap never sees them, so the sitemap needs no filtering;
//   - no `noindex` tag to maintain or forget.
//
// The trade-off is that cross-links between a published article and a
// still-draft one would 404 in production. Everything that emits an internal
// link therefore resolves it through `visibleEntries` / `isVisible` below,
// which degrade an unbuilt target to plain text instead of a dead link.
import { getCollection, type CollectionEntry } from 'astro:content';

/** True in `astro dev`, false in `astro build`. */
export const SHOW_UNPUBLISHED = import.meta.env.DEV;

type Editorial = CollectionEntry<'learn'> | CollectionEntry<'paths'>;

export const isVisible = (entry: Editorial): boolean =>
  entry.data.status === 'published' || SHOW_UNPUBLISHED;

export async function visibleLearn(): Promise<CollectionEntry<'learn'>[]> {
  const all = await getCollection('learn');
  return all.filter(isVisible).sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export async function visiblePaths(): Promise<CollectionEntry<'paths'>[]> {
  const all = await getCollection('paths');
  return all.filter(isVisible);
}

/** Resolve slugs to entries, dropping any that won't exist in this build. */
export async function resolveLearn(slugs: string[]): Promise<CollectionEntry<'learn'>[]> {
  const visible = await visibleLearn();
  const byId = new Map(visible.map(e => [e.id, e]));
  return slugs.map(s => byId.get(s)).filter((e): e is CollectionEntry<'learn'> => Boolean(e));
}

export const learnHref = (slug: string): string => `/learn/${slug}/`;
export const pathHref = (slug: string): string => `/paths/${slug}/`;
