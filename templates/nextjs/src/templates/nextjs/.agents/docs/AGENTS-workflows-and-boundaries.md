# Workflows and boundaries (Pages Router)

Optional, on-demand detail. Guardrails stay in [AGENTS.md](../../AGENTS.md).

## Example agent tasks

- **Add a new Sitecore component:** Create the component under `src/components/` (map regenerates automatically during `npm run dev`; otherwise run `npm run sitecore-tools:generate-map`), and ensure it is rendered in the layout/placeholder as in existing components.
- **Add an API route:** Create the route under `src/pages/api/`, add a rewrite in `next.config.js` if the route should be reached from a public URL (e.g. `/my-path` → `/api/my-handler`), and ensure the proxy `matcher` in `proxy.ts` still excludes it (or add the path to the matcher exclusions if needed).

## Boundaries

**Never edit:** `.next/`, `node_modules/`.

**Environment variables:** You may add new env vars when needed. Do it carefully: add the variable to `.env.example` (or `.env.remote.example` / `.env.container.example` in this template) with a placeholder or comment; never put real secrets in example files. If editing `.env.local` for local dev, add only the variable name and tell the user to set the value. **Never commit** `.env` or `.env.local` — they are gitignored.

**Edit with care:** `next.config.js` (rewrites, i18n), `sitecore.config.ts` (env only), `proxy.ts` (matcher and proxy order). When adding API routes or rewrites, keep middleware `matcher` and rewrite rules consistent.

**Focus on:** `src/pages/`, `src/components/`, `src/lib/`, `Layout.tsx`, `Providers.tsx`, `sitecore.config.ts`, `next.config.js`, `proxy.ts`. `.sitecore/component-map.ts` is auto-generated — do not edit manually.

**For head applications / empty starters:** Keep this app's `AGENTS.md` as the guide. Do not replace it with the Content SDK monorepo root `AGENTS.md` — that file describes the SDK source tree, not the head application.
