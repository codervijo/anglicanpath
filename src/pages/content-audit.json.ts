// Build-time audit feed for scripts/check-content.mjs.
//
// The gate needs both the parsed frontmatter and the raw body of every entry —
// including drafts, which aren't rendered in a production build. Astro's own
// `.astro/data-store.json` holds that, but in an internal serialisation format
// that isn't a public API. Going through a prerendered endpoint uses
// getCollection() instead, which is.
//
// IMPORTANT: this file is a build artifact, not a public route.
// `pnpm build` runs the gate straight after `astro build`, and the gate deletes
// dist/content-audit.json whether it passes or fails. A bare `astro build` will
// leave it behind — it would expose unpublished draft bodies, so don't publish
// a dist produced that way. It is also excluded from the sitemap in
// astro.config.mjs.
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

export const GET: APIRoute = async () => {
  const learn = await getCollection("learn");
  const paths = await getCollection("paths");

  const payload = {
    generatedAt: new Date().toISOString(),
    learn: learn.map(e => ({ id: e.id, body: e.body ?? "", data: e.data })),
    paths: paths.map(e => ({ id: e.id, body: e.body ?? "", data: e.data })),
  };

  return new Response(JSON.stringify(payload), {
    headers: { "content-type": "application/json" },
  });
};
