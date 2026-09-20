// Display labels and ordering for the `topic` enum in src/content.config.ts.
// Keep the keys in sync with that enum — the /learn/ index iterates TOPIC_ORDER
// and would silently drop a topic that isn't listed here.

export const TOPIC_LABELS = {
  basics: 'Basics',
  comparisons: 'Comparisons',
  'prayer-book': 'Prayer Book',
  sacraments: 'Sacraments',
  history: 'History',
  jurisdictions: 'Jurisdictions',
  music: 'Music',
} as const;

export type Topic = keyof typeof TOPIC_LABELS;

/** Order the /learn/ index groups topics in — roughly newcomer-first. */
export const TOPIC_ORDER: Topic[] = [
  'basics',
  'comparisons',
  'prayer-book',
  'jurisdictions',
  'sacraments',
  'history',
  'music',
];

export const topicLabel = (t: Topic): string => TOPIC_LABELS[t];

/** Average adult reading speed, words per minute. Used for "N min read". */
const WPM = 220;

/**
 * Reading time from a raw markdown body. Strips HTML comments first, so the
 * DRAFT/BRIEF placeholders that make up most of an unwritten article don't
 * inflate the estimate.
 */
export function readingTime(body: string): number {
  const prose = body.replace(/<!--[\s\S]*?-->/g, ' ');
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WPM));
}
