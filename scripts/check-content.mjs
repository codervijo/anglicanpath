#!/usr/bin/env node
/**
 * Content quality gate — enforces the page lifecycle (docs/architecture.md § 2). Runs after `astro build`; wired into `pnpm build`, and
 * available on its own as `pnpm check:content`.
 *
 * A page in a LIVE state ("published" or "reviewed") FAILS the build on any of
 * these. A "draft" or "fact-checked" page produces the same message as a
 * warning and never fails, because an unfinished page is supposed to be
 * unfinished — it just must not ship.
 *
 * Note what is NOT here: a reviewer. Accuracy gates publication; theological
 * endorsement gates the separate "reviewed" state and never blocks going live.
 *
 *   - empty sources array
 *   - description outside 120-160 characters, or title over 65
 *   - more than one <h1> in the rendered page
 *   - fewer than 2 internal links in the article body
 *   - any remaining DRAFT placeholder
 *   - a broken internal link
 *   - `proposed: true` still set (metadata never reviewed by a human)
 *   - frontmatter `slug` that disagrees with the filename
 *   - a related/path/step reference to a slug that doesn't exist
 *   - no link to anglican-vs-catholic or what-is-the-anglican-church
 *
 * Reaching "reviewed" additionally requires a named reviewer and reviewedDate,
 * and that reviewer's `articlesReviewed` must list the article (and only
 * articles they have actually signed).
 *
 * Site-wide, on every built page regardless of collection (docs/architecture.md § 5):
 *   - an INDEXABLE page (no robots noindex) that still shows placeholder text
 *     fails the build — placeholder pages must be noindex
 *   - every sitemap URL must be a built, indexable page
 * Editorial pages (`pages` collection) may only be `status: published` once
 * no <Draft>, placeholder or <Proposed> block remains in the source.
 *
 * Reads dist/content-audit.json (see src/pages/content-audit.json.ts) for
 * frontmatter and raw bodies, and the built HTML in dist/ for anything that
 * can only be judged after rendering. The audit file is deleted on the way
 * out, pass or fail — it contains unpublished draft bodies and must not ship.
 */
import { readFile, readdir, stat, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, posix } from 'node:path';
import { findHtmlPlaceholder, findSourcePlaceholder, isNoindexHtml } from '../src/lib/placeholders.js';

const DIST = 'dist';
const AUDIT = join(DIST, 'content-audit.json');

const DESC_MIN = 120;
const DESC_MAX = 160;
const TITLE_MAX = 65;
const MIN_INTERNAL_LINKS = 2;
/** Every article must route readers back to one of the two pillar pages. */
const PILLARS = ['anglican-vs-catholic', 'what-is-the-anglican-church'];

/** Matches both the MDX comment form and the HTML-comment form, plus the
 *  bracketed placeholders used in tables, FAQ answers and prayer book text. */
const DRAFT_PATTERNS = [
  /\{\/\*\s*DRAFT:/i,
  /<!--\s*DRAFT:/i,
  /\[DRAFT:/i,
  // Prose Claude wrote from general knowledge rather than from the operator's
  // first-hand material. It carries no checked citations, so it is treated
  // exactly like an empty section until a human has verified every claim and
  // deliberately removed the marker.
  /UNVERIFIED/,
  /\{\/\*\s*VERIFY:/i,
  /\[\s*(?:1662|1928|1979|2019)\s+BCP:[^\]]*\]/i,
];

const red = s => `\x1b[31m${s}\x1b[0m`;
const yellow = s => `\x1b[33m${s}\x1b[0m`;
const green = s => `\x1b[32m${s}\x1b[0m`;
const dim = s => `\x1b[2m${s}\x1b[0m`;

const failures = [];
const warnings = [];

/**
 * Record a problem. Fatal for a page in a live lifecycle state, advisory
 * otherwise — an unfinished draft is supposed to be unfinished; it just must
 * not ship. See docs/architecture.md § 2.
 */
function problem(live, where, message) {
  (live ? failures : warnings).push({ where, message });
}

/** Live states: what a reader can actually reach. */
const LIVE = new Set(['published', 'reviewed']);

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const full = join(dir, name);
    const s = await stat(full);
    if (s.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/** All hrefs in a chunk of HTML that point somewhere on this site. */
function internalHrefs(html) {
  return [...html.matchAll(/href="([^"]+)"/g)]
    .map(m => m[1])
    .filter(h => h.startsWith('/') && !h.startsWith('//'));
}

/** Does a site-relative URL resolve to something in dist? */
function resolves(href, files) {
  const clean = href.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return files.has('index.html');
  const p = clean.replace(/^\//, '');
  return files.has(p) || files.has(posix.join(p.replace(/\/$/, ''), 'index.html'));
}

function extractBody(html) {
  const m = html.match(/<div[^>]*data-article-body[^>]*>([\s\S]*?)<\/div>\s*(?=<section|<aside|<\/article)/);
  return m ? m[1] : null;
}

async function main() {
  if (!existsSync(AUDIT)) {
    console.error(red('✗ dist/content-audit.json is missing — run `astro build` first.'));
    process.exit(1);
  }

  const audit = JSON.parse(await readFile(AUDIT, 'utf8'));
  const distFiles = new Set(
    (await walk(DIST)).map(f => relative(DIST, f).split(/[\\/]/).join('/')),
  );

  const learnIds = new Set(audit.learn.map(e => e.id));
  const learnById = new Map(audit.learn.map(e => [e.id, e]));
  const reviewerById = new Map(audit.reviewers.map(r => [r.id, r]));
  const pathIds = new Set(audit.paths.map(e => e.id));

  let checked = 0;

  // ---- per-article checks -------------------------------------------------
  for (const entry of audit.learn) {
    const d = entry.data;
    const live = LIVE.has(d.status);
    const where = `learn/${entry.id}`;
    checked += 1;

    if (d.slug !== entry.id) {
      problem(live, where, `frontmatter slug "${d.slug}" does not match the filename`);
    }
    if (d.proposed) {
      problem(live, where, 'metadata is still marked `proposed: true` — no human has reviewed the title, description or keywords');
    }
    // Theological endorsement gates `reviewed`, NOT publication. A page may go
    // live once it is accurate; a named priest signs off afterwards.
    if (d.status === 'reviewed') {
      if (!d.reviewer || !d.reviewer.id) {
        problem(true, where, 'status is "reviewed" but there is no named clergy reviewer');
      } else {
        const r = reviewerById.get(d.reviewer.id);
        if (!r) problem(true, where, `reviewer "${d.reviewer.id}" is not in the reviewers collection`);
        else if (!r.data.articlesReviewed.includes(entry.id)) {
          problem(true, where, `reviewer "${d.reviewer.id}" does not list this article in articlesReviewed`);
        }
      }
      if (!d.reviewedDate) {
        problem(true, where, 'status is "reviewed" but there is no reviewedDate');
      }
    } else if (d.reviewer || d.reviewedDate) {
      problem(live, where, `status is "${d.status}" but a reviewer is set — use status: reviewed`);
    }
    if (!Array.isArray(d.sources) || d.sources.length === 0) {
      problem(live, where, 'sources array is empty');
    }
    if (d.title.length > TITLE_MAX) {
      problem(live, where, `title is ${d.title.length} chars (max ${TITLE_MAX})`);
    }
    if (d.description.length < DESC_MIN || d.description.length > DESC_MAX) {
      problem(live, where, `description is ${d.description.length} chars (want ${DESC_MIN}-${DESC_MAX})`);
    }

    for (const pattern of DRAFT_PATTERNS) {
      if (pattern.test(entry.body)) {
        problem(live, where, `body still contains a DRAFT placeholder (${pattern.source})`);
        break;
      }
    }
    for (const f of d.faq ?? []) {
      if (DRAFT_PATTERNS.some(p => p.test(f.a))) {
        problem(live, where, `FAQ answer is still a placeholder: "${f.q}"`);
      }
    }

    for (const slug of d.related) {
      if (!learnIds.has(slug)) problem(live, where, `related references unknown article "${slug}"`);
    }
    for (const slug of d.paths) {
      if (!pathIds.has(slug)) problem(live, where, `paths references unknown path "${slug}"`);
    }

    // Rendered-HTML checks. A draft isn't built in production, so these can
    // only run when the page actually exists.
    const htmlPath = join(DIST, 'learn', entry.id, 'index.html');
    if (!existsSync(htmlPath)) {
      if (live) problem(true, where, `status is "${d.status}" but no page was built`);
      continue;
    }
    const html = await readFile(htmlPath, 'utf8');

    const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
    if (h1s !== 1) problem(live, where, `rendered page has ${h1s} <h1> elements, expected exactly 1`);

    const body = extractBody(html);
    if (body === null) {
      problem(live, where, 'could not locate the article body in the rendered page (data-article-body marker missing)');
    } else {
      const links = internalHrefs(body);
      if (links.length < MIN_INTERNAL_LINKS) {
        problem(live, where, `${links.length} internal link(s) in the body, need at least ${MIN_INTERNAL_LINKS}`);
      }
      const hitsPillar = links.some(h => PILLARS.some(p => h.includes(`/learn/${p}/`)));
      const isPillar = PILLARS.includes(entry.id);
      if (!hitsPillar && !isPillar) {
        problem(live, where, `body links to neither ${PILLARS.map(p => `/learn/${p}/`).join(' nor ')}`);
      }
    }

    if (/draft-cell/.test(html)) {
      problem(live, where, 'rendered page still shows a placeholder cell (unfilled comparison table, FAQ answer or sources list)');
    }
  }

  // ---- per-path checks ----------------------------------------------------
  for (const entry of audit.paths) {
    const d = entry.data;
    const live = LIVE.has(d.status);
    const where = `paths/${entry.id}`;
    checked += 1;

    if (d.slug !== entry.id) problem(live, where, `frontmatter slug "${d.slug}" does not match the filename`);
    if (d.proposed) problem(live, where, 'metadata is still marked `proposed: true`');
    if (d.title.length > TITLE_MAX) problem(live, where, `title is ${d.title.length} chars (max ${TITLE_MAX})`);
    if (d.description.length < DESC_MIN || d.description.length > DESC_MAX) {
      problem(live, where, `description is ${d.description.length} chars (want ${DESC_MIN}-${DESC_MAX})`);
    }
    for (const p of DRAFT_PATTERNS) {
      if (p.test(entry.body)) { problem(live, where, 'body still contains a DRAFT placeholder'); break; }
    }
    for (const step of d.steps) {
      if (!learnIds.has(step.article)) problem(live, where, `step references unknown article "${step.article}"`);
    }
  }

  // ---- reviewers: a listed article must really carry that signature -------
  for (const r of audit.reviewers) {
    const where = `reviewers/${r.id}`;
    for (const slug of r.data.articlesReviewed) {
      const a = learnById.get(slug);
      if (!a) {
        problem(true, where, `articlesReviewed lists unknown article "${slug}"`);
      } else if (a.data.status !== 'reviewed' || a.data.reviewer?.id !== r.id) {
        problem(true, where, `articlesReviewed lists "${slug}", but that article is not status: reviewed by ${r.id}`);
      }
    }
  }

  // ---- editorial pages (/about/, /about/review/) ----------------------------
  for (const entry of audit.pages) {
    const d = entry.data;
    const live = d.status === 'published';
    const where = `pages/${entry.id}`;
    checked += 1;
    const hit = findSourcePlaceholder(entry.body);
    if (hit) problem(live, where, `still contains a placeholder (${hit}) — keep status: draft until it is written`);
    if (/<Proposed\b/.test(entry.body)) {
      problem(live, where, 'still contains <Proposed> copy — approve it and remove the wrapper before publishing');
    }
    if (d.title.length > TITLE_MAX) problem(live, where, `title is ${d.title.length} chars (max ${TITLE_MAX})`);
    if (d.description.length < DESC_MIN || d.description.length > DESC_MAX) {
      problem(live, where, `description is ${d.description.length} chars (want ${DESC_MIN}-${DESC_MAX})`);
    }
  }

  // ---- site-wide: placeholder pages must be noindex and out of the sitemap -
  const noindexed = [];
  const indexable = new Set();
  for (const rel of [...distFiles].filter(f => f.endsWith('.html'))) {
    const html = await readFile(join(DIST, rel), 'utf8');
    const url = '/' + rel.replace(/index\.html$/, '');
    if (isNoindexHtml(html)) {
      noindexed.push(url);
      continue;
    }
    indexable.add(url);
    const hit = findHtmlPlaceholder(html);
    if (hit) {
      failures.push({ where: url, message: `indexable page shows placeholder text "${hit}" — make it noindex or fill it` });
    }
  }
  for (const f of [...distFiles].filter(f => /^sitemap-\d+\.xml$/.test(f))) {
    const xml = await readFile(join(DIST, f), 'utf8');
    for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const url = new URL(loc).pathname;
      if (!indexable.has(url)) {
        failures.push({ where: f, message: `sitemap lists ${url}, which is not a built, indexable page` });
      }
    }
  }

  // ---- site-wide broken internal links ------------------------------------
  const htmlFiles = [...distFiles].filter(f => f.endsWith('.html'));
  const broken = new Map();
  for (const rel of htmlFiles) {
    const html = await readFile(join(DIST, rel), 'utf8');
    for (const href of internalHrefs(html)) {
      if (!resolves(href, distFiles)) {
        if (!broken.has(href)) broken.set(href, new Set());
        broken.get(href).add(rel);
      }
    }
  }
  for (const [href, pages] of broken) {
    // Everything in dist is a page that shipped, so a dead link here is always
    // a build failure regardless of any entry's status.
    failures.push({ where: [...pages].join(', '), message: `broken internal link: ${href}` });
  }

  // ---- report -------------------------------------------------------------
  console.log(`\ncheck:content — ${checked} entries, ${htmlFiles.length} built pages\n`);
  for (const url of noindexed.sort()) console.log(`${yellow('↷')} ${dim('noindex')} ${url}`);
  if (noindexed.length) console.log('');

  for (const w of warnings) console.log(`${yellow('↷')} ${dim(w.where)} ${w.message}`);
  for (const f of failures) console.log(`${red('✗')} ${f.where} ${f.message}`);

  if (warnings.length) {
    console.log(`\n${yellow('↷')} ${warnings.length} warning(s) on draft/fact-checked entries — not blocking.`);
  }
  if (failures.length) {
    console.log(`\n${red('✗')} ${failures.length} failure(s). Build rejected.\n`);
    process.exitCode = 1;
    return;
  }
  console.log(`\n${green('✓')} content gate passed.\n`);
}

try {
  await main();
} catch (err) {
  console.error(red(`✗ check:content crashed: ${err.stack ?? err}`));
  process.exitCode = 1;
} finally {
  // Always remove the audit feed: it carries unpublished draft bodies.
  if (existsSync(AUDIT)) await unlink(AUDIT);
}
