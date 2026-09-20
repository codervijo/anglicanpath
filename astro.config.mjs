// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://anglicanpath.org',
  // trailingSlash: 'always' — directory format serves /<page>/ and
  // @astrojs/sitemap lists /<page>/, so a page's <link rel="canonical">
  // MUST also end in a slash. A canonical of /<page> (no slash) 308-redirects
  // to /<page>/ — Google then can't settle on a canonical and the page comes
  // back "URL is unknown to Google". Make it explicit so every page's
  // canonical matches its served URL. Enforced by CHECK_161.
  trailingSlash: 'always',
  integrations: [sitemap(), react()],
  output: 'static',
  // Tailwind v4 ships as a Vite plugin (no tailwind.config.js). The design
  // tokens live in src/styles/global.css (@theme inline), ported from the
  // source project's src/styles.css.
  vite: { plugins: [tailwindcss()] },
});
