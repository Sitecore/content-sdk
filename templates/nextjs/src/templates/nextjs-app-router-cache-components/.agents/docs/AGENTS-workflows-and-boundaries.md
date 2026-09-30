# Workflows and boundaries (App Router + Cache Components)

Optional, on-demand detail. Guardrails stay in [AGENTS.md](../../AGENTS.md).

## Example agent tasks

- **Add a new Sitecore component:** Create the component under `src/components/` (maps regenerate automatically during `npm run dev`; otherwise run `npm run sitecore-tools:generate-map`), and ensure it is rendered in the layout/placeholder as in existing components.
- **Add an API route:** Create the route under `src/app/api/` (e.g. `src/app/api/my-route/route.ts`), add a rewrite in `next.config.ts` if the route should be reached from a public URL, and ensure the proxy `matcher` in `proxy.ts` still excludes it (e.g. `api/` is already excluded). If the route returns cached data, decide whether to use `'use cache'` with a Sitecore tag and how it should be invalidated.
- **Add a new cache helper:** Add a file under `src/lib/cache/`. Inside the function, declare `'use cache';`, call the SDK client, compute Sitecore tags via the SDK helpers (`collectSitecorePageCacheTags`, `buildSitecoreDictionaryCacheTag`, etc.), and call `cacheTag(tag)` for each one. Match the style of `get-sitecore-page.ts`.

## Boundaries

**Never edit:** `.next/`, `node_modules/`.

**Environment variables:** You may add new env vars when needed. Do it carefully: add the variable to `.env.example` (or `.env.remote.example` / `.env.container.example` in this template) with a placeholder or comment; never put real secrets in example files. If editing `.env.local` for local dev, add only the variable name and tell the user to set the value. **Never commit** `.env` or `.env.local` — they are gitignored. `SITECORE_REVALIDATE_SECRET` is optional — see comments in `.env.*.example`.

**Edit with care:** `next.config.ts` (`cacheComponents: true`, rewrites, next-intl plugin), `sitecore.config.ts` (env only; keep dictionary cache disabled), `proxy.ts` (matcher and proxy order), `src/i18n/routing.ts` and `request.ts`, `src/lib/cache/*` (tag computation). When adding routes or rewrites, keep middleware `matcher` and rewrite rules consistent.

**Focus on:** `src/app/`, `src/components/`, `src/lib/`, `src/lib/cache/`, `src/i18n/`, `Layout.tsx`, `Providers.tsx`, `sitecore.config.ts`, `next.config.ts`, `proxy.ts`. `.sitecore/component-map.ts` and `.sitecore/component-map.client.ts` are auto-generated — do not edit manually.

**For head applications / empty starters:** Keep this app's `AGENTS.md` as the guide. Do not replace it with the Content SDK monorepo root `AGENTS.md` — that file describes the SDK source tree, not the head application.
