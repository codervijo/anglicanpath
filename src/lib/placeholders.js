// Placeholder detection, shared by the pages (to decide `noindex`) and by
// scripts/check-content.mjs (to refuse an indexable page that still carries
// one). Plain JS so the Node gate can import it without a TS step.
//
// The rule it serves (docs/architecture.md § 5): a built page that still
// contains placeholder text is `noindex` and absent from the sitemap. Pages
// compute their own `noindex` from these helpers, so filling the last
// placeholder flips a page to indexable with no code change.

/** Markers in authored source: MDX/HTML comments, the <Draft> component, and
 *  bracketed stand-ins in data files. */
export const SOURCE_PATTERNS = [
  /\{\/\*\s*DRAFT:/i,
  /<!--\s*DRAFT:/i,
  /<Draft\b/,
  /\[DRAFT:/i,
  /UNVERIFIED/,
  /\{\/\*\s*VERIFY:/i,
  /\[\s*(?:1662|1928|1979|2019)\s+BCP:[^\]]*\]/i,
  /\[[^\]\n]{0,160}\b(?:placeholder|to be written)\b[^\]\n]{0,160}\]/i,
  /\[Draft [^\]\n]*\]/,
  /\[Year\]/,
];

/** Markers in rendered HTML. Checked against the raw HTML. */
const HTML_RAW_PATTERNS = [/<!--\s*DRAFT:/i, /\bdata-draft\b/];

/** Markers checked against visible text only — tags, scripts and styles are
 *  stripped first, so Tailwind classes such as `placeholder:text-…` and
 *  serialised island props can't false-positive. */
const HTML_TEXT_PATTERNS = [
  /\[DRAFT:/i,
  /UNVERIFIED/,
  /\[\s*(?:1662|1928|1979|2019)\s+BCP:[^\]]*\]/i,
  /\[[^\]\n]{0,160}\b(?:placeholder|to be written)\b[^\]\n]{0,160}\]/i,
  /\[Draft [^\]\n]*\]/,
  /\[Year\]/,
];

/** First placeholder pattern found in authored source, or null. */
export function findSourcePlaceholder(text) {
  const hit = SOURCE_PATTERNS.find(p => p.test(text));
  return hit ? hit.source : null;
}

export const hasSourcePlaceholder = text => findSourcePlaceholder(text) !== null;

/** Visible text of an HTML document, with comments removed. */
export function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ');
}

/** First placeholder found in rendered HTML, as a short excerpt, or null. */
export function findHtmlPlaceholder(html) {
  for (const p of HTML_RAW_PATTERNS) {
    const m = html.match(p);
    if (m) return m[0];
  }
  const text = visibleText(html);
  for (const p of HTML_TEXT_PATTERNS) {
    const m = text.match(p);
    if (m) return m[0].slice(0, 80);
  }
  return null;
}

/** True if the page's <meta name="robots"> contains noindex. */
export const isNoindexHtml = html =>
  /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
