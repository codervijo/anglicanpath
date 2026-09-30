// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { isNoindexHtml } from './src/lib/placeholders.js';

const DIST = fileURLToPath(new URL('./dist/', import.meta.url));

/**
 * A page that says `noindex` must not be offered to crawlers in the sitemap.
 * @astrojs/sitemap runs its filter in astro:build:done, after every page is
 * written, so the built HTML is the source of truth: whatever a page decided
 * about indexing, the sitemap follows. scripts/check-content.mjs re-verifies.
 */
function isIndexable(page) {
  const { pathname } = new URL(page);
  const file = `${DIST}${pathname.replace(/^\//, '')}index.html`;
  return !existsSync(file) || !isNoindexHtml(readFileSync(file, 'utf8'));
}

export default defineConfig({
  site: 'https://anglicanpath.org',
  // trailingSlash: 'always' — directory format serves /<page>/ and
  // @astrojs/sitemap lists /<page>/, so a page's <link rel="canonical">
  // MUST also end in a slash. A canonical of /<page> (no slash) 308-redirects
  // to /<page>/ — Google then can't settle on a canonical and the page comes
  // back "URL is unknown to Google". Make it explicit so every page's
  // canonical matches its served URL. Enforced by CHECK_161.
  trailingSlash: 'always',
  // MDX so an article body can drop in <ComparisonTable /> where it belongs.
  // Plain markdown syntax works unchanged inside .mdx — see CONTENT_README.md.
  integrations: [
    mdx(),
    // content-audit.json is a build artifact consumed by
    // scripts/check-content.mjs and deleted by it; it must never be listed.
    // noindex pages are dropped too — see isIndexable above.
    sitemap({ filter: page => !page.endsWith('/content-audit.json') && isIndexable(page) }),
    react(),
  ],
  output: 'static',
  // Tailwind v4 ships as a Vite plugin (no tailwind.config.js). The design
  // tokens live in src/styles/global.css (@theme inline), ported from the
  // source project's src/styles.css.
  vite: { plugins: [tailwindcss()] },
});
