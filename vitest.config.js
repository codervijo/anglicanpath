// vitest.config.js
// getViteConfig gives tests Astro's Vite pipeline, so .astro components can
// be rendered with the Container API (see advisory-panel.test.ts).
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
