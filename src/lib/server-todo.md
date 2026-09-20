# Dropped server / framework code

Source: `genai/` (TanStack Start). These files have no equivalent in Astro's
static-output model (`output: 'static'` in `astro.config.mjs`) and were **not**
ported. Listed here so the gap is visible rather than silently lost.

## Dropped

- `TODO:` `genai/src/server.ts` — TanStack Start server entry (request
  handler). Astro's static build has no server entry. If this site ever needs
  server behaviour, that becomes a Cloudflare Worker route or an Astro adapter
  decision, not a straight port. Deploy config lives in `wrangler.jsonc`.
- `TODO:` `genai/src/start.ts` — TanStack Start client/server bootstrap.
- `TODO:` `genai/src/router.tsx` + `genai/src/routeTree.gen.ts` — TanStack
  Router wiring. Replaced by Astro file-based routing under `src/pages/`.
- `TODO:` `genai/src/routes/__root.tsx` — root route. Its *visible* parts were
  ported: the shell/header/footer into `src/layouts/BaseLayout.astro`, the
  not-found view into `src/pages/404.astro`.
- `TODO:` `genai/src/lib/lovable-error-reporting.ts`,
  `genai/src/lib/error-capture.ts`, `genai/src/lib/error-page.ts` — Lovable
  preview-environment error reporting. Not applicable to a static build; the
  React `ErrorComponent` that consumed it has no Astro equivalent either.
- `TODO:` `@tanstack/react-query` (`QueryClientProvider` in `__root.tsx`) — no
  data fetching exists in the prototype, so nothing depends on it.

## Not ported (unused)

`genai/src/components/ui/` holds the full shadcn/ui set (~50 files). Only the
four components the ported pages actually use were copied into
`src/components/ui/`: `button.tsx`, `input.tsx`, `dialog.tsx`, `sheet.tsx`
(plus an Astro twin, `Button.astro`). `genai/src/hooks/use-mobile.tsx` is
unused by any ported view.

## Known content gaps

The source is a UI prototype: page copy, parish records, and the entire Daily
Office text are `[…placeholder]` strings, carried over verbatim. They are not
real content and must be filled before this site is fit to publish.
