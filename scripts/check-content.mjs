#!/usr/bin/env node
/**
 * Content quality gate. Runs after `astro build`; wired into `pnpm build`, and
 * available on its own as `pnpm check:content`.
 *
 * A page with status "published" FAILS the build on any of these. A draft or
 * review page produces the same message as a warning and never fails, because
 * an unfinished page is supposed to be unfinished — it just must not ship.
 *
 *   - reviewer or reviewedDate missing
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
 * Reads dist/content-audit.json (see src/pages/content-audit.json.ts) for
 * frontmatter and raw bodies, and the built HTML in dist/ for anything that
 * can only be judged after rendering. The audit file is deleted on the way
 * out, pass or fail — it contains unpublished draft bodies and must not ship.
 */
import { readFile, readdir, stat, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, posix } from 'node:path';

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
  /\[\s*(?:1662|1928|1979|2019)\s+BCP:[^\]]*\]/i,
];

const red = s => `\x1b[31m${s}\x1b[0m`;
const yellow = s => `\x1b[33m${s}\x1b[0m`;
const green = s => `\x1b[32m${s}\x1b[0m`;
const dim = s => `\x1b[2m${s}\x1b[0m`;

const failures = [];
const warnings = [];

/** Record a problem: fatal for published pages, advisory for everything else. */
function problem(published, where, message) {
  (published ? failures : warnings).push({ where, message });
}

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
  const pathIds = new Set(audit.paths.map(e => e.id));

  let checked = 0;

  // ---- per-article checks -------------------------------------------------
  for (const entry of audit.learn) {
    const d = entry.data;
    const published = d.status === 'published';
    const where = `learn/${entry.id}`;
    checked += 1;

    if (d.slug !== entry.id) {
      problem(published, where, `frontmatter slug "${d.slug}" does not match the filename`);
    }
    if (d.proposed) {
      problem(published, where, 'metadata is still marked `proposed: true` — no human has reviewed the title, description or keywords');
    }
    if (!d.reviewer || !d.reviewer.name) {
      problem(published, where, 'no reviewer — a published article needs a named clergy reviewer');
    }
    if (!d.reviewedDate) {
      problem(published, where, 'no reviewedDate');
    }
    if (!Array.isArray(d.sources) || d.sources.length === 0) {
      problem(published, where, 'sources array is empty');
    }
    if (d.title.length > TITLE_MAX) {
      problem(published, where, `title is ${d.title.length} chars (max ${TITLE_MAX})`);
    }
    if (d.description.length < DESC_MIN || d.description.length > DESC_MAX) {
      problem(published, where, `description is ${d.description.length} chars (want ${DESC_MIN}-${DESC_MAX})`);
    }

    for (const pattern of DRAFT_PATTERNS) {
      if (pattern.test(entry.body)) {
        problem(published, where, `body still contains a DRAFT placeholder (${pattern.source})`);
        break;
      }
    }
    for (const f of d.faq ?? []) {
      if (DRAFT_PATTERNS.some(p => p.test(f.a))) {
        problem(published, where, `FAQ answer is still a placeholder: "${f.q}"`);
      }
    }

    for (const slug of d.related) {
      if (!learnIds.has(slug)) problem(published, where, `related references unknown article "${slug}"`);
    }
    for (const slug of d.paths) {
      if (!pathIds.has(slug)) problem(published, where, `paths references unknown path "${slug}"`);
    }

    // Rendered-HTML checks. A draft isn't built in production, so these can
    // only run when the page actually exists.
    const htmlPath = join(DIST, 'learn', entry.id, 'index.html');
    if (!existsSync(htmlPath)) {
      if (published) problem(true, where, 'status is "published" but no page was built');
      continue;
    }
    const html = await readFile(htmlPath, 'utf8');

    const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
    if (h1s !== 1) problem(published, where, `rendered page has ${h1s} <h1> elements, expected exactly 1`);

    const body = extractBody(html);
    if (body === null) {
      problem(published, where, 'could not locate the article body in the rendered page (data-article-body marker missing)');
    } else {
      const links = internalHrefs(body);
      if (links.length < MIN_INTERNAL_LINKS) {
        problem(published, where, `${links.length} internal link(s) in the body, need at least ${MIN_INTERNAL_LINKS}`);
      }
      const hitsPillar = links.some(h => PILLARS.some(p => h.includes(`/learn/${p}/`)));
      const isPillar = PILLARS.includes(entry.id);
      if (!hitsPillar && !isPillar) {
        problem(published, where, `body links to neither ${PILLARS.map(p => `/learn/${p}/`).join(' nor ')}`);
      }
    }

    if (/draft-cell/.test(html)) {
      problem(published, where, 'rendered page still shows a placeholder cell (unfilled comparison table, FAQ answer or sources list)');
    }
  }

  // ---- per-path checks ----------------------------------------------------
  for (const entry of audit.paths) {
    const d = entry.data;
    const published = d.status === 'published';
    const where = `paths/${entry.id}`;
    checked += 1;

    if (d.slug !== entry.id) problem(published, where, `frontmatter slug "${d.slug}" does not match the filename`);
    if (d.proposed) problem(published, where, 'metadata is still marked `proposed: true`');
    if (d.title.length > TITLE_MAX) problem(published, where, `title is ${d.title.length} chars (max ${TITLE_MAX})`);
    if (d.description.length < DESC_MIN || d.description.length > DESC_MAX) {
      problem(published, where, `description is ${d.description.length} chars (want ${DESC_MIN}-${DESC_MAX})`);
    }
    for (const p of DRAFT_PATTERNS) {
      if (p.test(entry.body)) { problem(published, where, 'body still contains a DRAFT placeholder'); break; }
    }
    for (const step of d.steps) {
      if (!learnIds.has(step.article)) problem(published, where, `step references unknown article "${step.article}"`);
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

  for (const w of warnings) console.log(`${yellow('↷')} ${dim(w.where)} ${w.message}`);
  for (const f of failures) console.log(`${red('✗')} ${f.where} ${f.message}`);

  if (warnings.length) {
    console.log(`\n${yellow('↷')} ${warnings.length} warning(s) on draft/review entries — not blocking.`);
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
