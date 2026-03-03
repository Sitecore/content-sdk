# AGENTS.md — AI Guidance for Sitecore Content SDK Next.js (Pages Router) App

## Project Overview

This is a **Sitecore Content SDK** application built with **Next.js (Pages Router)** and **TypeScript**. AI agents work as developer assistants within this scaffolded head application. The app integrates with Sitecore XM Cloud for content, supports multisite and i18n, and uses Next.js API routes and Edge middleware for routing and SEO.

**Scope:** This file applies to **this application only** (a scaffolded head app). It is **not** the Content SDK monorepo — for SDK package development use that repo's `AGENTS.md`. Here we edit app code and config (pages, components, API routes, config); we do not modify SDK packages or CI.

---

## Quick Commands

```bash
npm install
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

**Environment:** Copy `.env.example` to `.env.local` and set Sitecore API endpoint, key, default site, and language. Never commit `.env` or `.env.local`.

---

## Application Structure (Pages Router)

```
src/
  pages/             # Next.js Pages Router
    [[...path]].tsx  # Catch-all Sitecore page (SSG or SSR)
    _app.tsx
    404.tsx, 500.tsx, _error.tsx
    api/             # API routes (sitemap, robots, editing, healthz)
  components/        # React components (Sitecore + app-specific)
  lib/               # sitecore-client, component-props
  Layout.tsx, Providers.tsx, Bootstrap.tsx, Scripts.tsx
proxy.ts             # Edge middleware (multisite, redirects, personalize)
.sitecore/           # component-map.ts, import-map.ts, sites.json, metadata.json
sitecore.config.ts   # Sitecore config (api, defaultSite, defaultLanguage, multisite, etc.)
next.config.js       # i18n (locales, defaultLocale), rewrites, images
```

---

## Key concepts for this app

These are the main head-app–specific concepts. Details are in the sections below.

### Middleware (Edge proxy)

- **Where:** `src/proxy.ts`. Next.js runs middleware from `middleware.ts` at root or in `src/` — if the app only has `proxy.ts`, add `src/middleware.ts` that re-exports it.
- **What it does:** Runs on each request (respecting the `config.matcher`). Chain order is **fixed:** MultisiteProxy → RedirectsProxy → PersonalizeProxy. Multisite resolves site (e.g. hostname or cookie) and rewrites; redirects and personalization run after.
- **Config:** Uses `sitecore.config.ts` (multisite, redirects, personalize) and `.sitecore/sites.json`. **Do not change proxy order.** Use the `skip` callback and matcher to exclude `/api`, `/_next`, static files, and health checks so the proxy stays lightweight.

### SitecoreClient

- **Where:** Single shared instance in `src/lib/sitecore-client.ts` — `new SitecoreClient({ ...scConfig })` with config from `sitecore.config.ts`.
- **Use for:** `getPage`, `getDictionary`, `getComponentData`, `getPreview`, `getDesignLibraryData`, `getPagePaths`. All Sitecore data fetching in the app goes through this client (in `[[...path]].tsx` getStaticProps/getServerSideProps and in API routes).
- **Do not:** Create a second client or instantiate SitecoreClient elsewhere. Path comes from `extractPath(context)`; locale from `context.locale` (Next.js i18n).

### Catch-all route

- **Where:** `src/pages/[[...path]].tsx`. This is the **only** page component that renders Sitecore content; the optional `[[...path]]` segment captures the content path.
- **Flow:** Use `extractPath(context)` (from `@sitecore-content-sdk/nextjs/utils`) to get the path array; use `context.locale` for locale. In getStaticProps/getServerSideProps: `client.getPage(path, { locale: context.locale })`, then `client.getDictionary({ site: page.siteName, locale: page.locale })` and `client.getComponentData(page.layout, context, components)`. For SSG, paths from `client.getPagePaths(sites, context?.locales)` with `sites` from `.sitecore/sites.json`. For preview, use `context.preview` and `context.previewData` with `client.getPreview(context.previewData)` or `client.getDesignLibraryData(context.previewData)`.
- **Do not:** Add another page or catch-all for Sitecore content; keep this single entry point.

### How locale works

- **Config:** `next.config.js` → `i18n.locales` and `i18n.defaultLocale`. Match (or subset) Sitecore languages. There is no `[locale]` in the URL path; Next.js i18n handles locale via its built-in behavior (e.g. prefix or cookie).
- **In the app:** Per-request locale is `context.locale` in `getStaticProps` and `getServerSideProps`. Pass it to `client.getPage(path, { locale: context.locale })`. After fetching the page, use `page.siteName` and `page.locale` (or `context.locale`) for `client.getDictionary` and `client.getComponentData`.
- **Do not:** Assume locale from headers or a different source; always use `context.locale` and the page’s site/locale for Sitecore calls.

### More (component map, editing, env)

- **Component map:** `.sitecore/component-map.ts` — register every Sitecore component here; keep in sync with `src/components/`. Used by `getComponentData` and by the editing API routes.
- **Editing/preview:** Use `context.preview` and `context.previewData` in the catch-all page; when in preview, use `client.getPreview(context.previewData)` or `client.getDesignLibraryData(context.previewData)`. Editing API routes: `src/pages/api/editing/config.ts`, `render.ts`, `feaas/render.ts`.
- **Env:** All config via environment variables in `sitecore.config.ts`. Document vars in `.env.example` (or `.env.remote.example` / `.env.container.example`); never commit `.env` or `.env.local`.

---

## Next.js Pages Router specifics

### Routing and data fetching

- **_app.tsx:** Wraps the app and receives the page/layout from the catch-all's getStaticProps/getServerSideProps. Do not fetch Sitecore data in _app; all data flows from `[[...path]].tsx`.
- **Single page for Sitecore content:** `src/pages/[[...path]].tsx` is the catch-all. Path comes from `extractPath(context)` (from `@sitecore-content-sdk/nextjs/utils`); locale from `context.locale` (Next.js i18n).
- **SSG:** Uses `getStaticPaths` and `getStaticProps`. Paths from `client.getPagePaths(sites, context?.locales)` with `sites` from `.sitecore/sites.json`. Use `revalidate` for ISR.
- **SSR:** Uses `getServerSideProps` only; no `getStaticPaths`.
- **Preview:** `context.preview` and `context.previewData`; use `client.getPreview(context.previewData)` or `client.getDesignLibraryData(context.previewData)` when applicable.
- **Page data:** `client.getPage(path, { locale: context.locale })`, then `client.getDictionary({ site: page.siteName, locale: page.locale })` and `client.getComponentData(page.layout, context, components)` for component props.

### i18n (Pages Router)

- **Config:** `next.config.js` → `i18n.locales` and `i18n.defaultLocale`. Match (or subset) Sitecore languages.
- **Per-request locale:** Provided by Next.js as `context.locale` in `getStaticProps` / `getServerSideProps`. No `[locale]` in the path; locale is from Next.js i18n.

### Multisite and Edge middleware (proxy)

- **Site list:** `.sitecore/sites.json` — typically generated by the Sitecore CLI or deployment. Used by middleware and API routes. Avoid hand-editing unless you know the format.
- **Edge middleware:** Implemented in **`src/proxy.ts`**. Next.js only runs middleware from a file named `middleware.ts` at root or in `src/`. If this app has only `proxy.ts`, add `src/middleware.ts` that re-exports it (e.g. `export { default } from './proxy';`) so the proxy runs.
- **Proxy chain (order matters):** `defineProxy(multisite, redirects, personalize).exec(req)`:
  - **MultisiteProxy** — resolves site from request (e.g. hostname or cookie), rewrites to internal path; uses `scConfig.api.edge` and `scConfig.multisite` (e.g. `useCookieResolution`).
  - **RedirectsProxy** — handles redirects; uses `scConfig.redirects`, `scConfig.api.edge`, `scConfig.api.local`.
  - **PersonalizeProxy** — personalization; uses `scConfig.personalize`; often disabled in dev.
- **Skip function:** Each proxy has a `skip` callback. Use it to avoid running on certain paths (e.g. `/api`, `/_next`, static files) for performance.
- **Config:** `sitecore.config.ts` → `multisite.enabled`, `redirects.enabled`, `personalize`; never commit secrets.

### API routes

- **Sitemap:** `src/pages/api/sitemap.ts` — `SitemapMiddleware(scClient, sites).getHandler()`. Serves sitemap XML; uses `sites` from `.sitecore/sites.json`.
- **Robots:** `src/pages/api/robots.ts` — `RobotsMiddleware(scClient, sites).getHandler()`. Serves `robots.txt`; site can be resolved from request.
- **Editing:** `src/pages/api/editing/config.ts`, `render.ts`, `feaas/render.ts` — used by Sitecore Editor (XM Cloud); use SDK middleware/handlers and `.sitecore/component-map`, `.sitecore/metadata.json`.
- **Health:** `src/pages/api/healthz.ts` — health check. Rewrite in `next.config.js`: `/healthz` → `/api/healthz`.
- **Rewrites:** `next.config.js` → `rewrites()` for `/robots.txt`, `/sitemap*.xml`, `/feaas-render` to the corresponding API routes.

### Sitecore client and config

- **Client:** `src/lib/sitecore-client.ts` — `new SitecoreClient({ ...scConfig })`. Use this instance for `getPage`, `getDictionary`, `getComponentData`, `getPreview`, `getPagePaths`, etc.
- **Config:** `sitecore.config.ts` — `defineConfig({ api, defaultSite, defaultLanguage, editingSecret, redirects, multisite, personalize })`. Use env vars; no hardcoded secrets.

### Component map and layout

- **Component map:** `.sitecore/component-map.ts` — register all Sitecore components. Keep in sync with components under `src/components/`.
- **Layout:** `Layout.tsx` renders page layout and placeholders; `Providers` wrap component props and page context; `Bootstrap` handles site name and preview mode.
- **404 / 500 / _error:** When the catch-all returns `notFound: true` (no page), Next.js renders `404.tsx`. When the server returns 500, Next.js renders `500.tsx`. Both can optionally fetch and show Sitecore error content via `client.getErrorPage(ErrorPage.NotFound)` / `ErrorPage.InternalServerError` in their getStaticProps (when `scConfig.generateStaticPaths`); otherwise they show a simple fallback. `_error.tsx` is Next.js's error boundary for uncaught errors (client and server); it does not fetch from Sitecore.

---

## Best practices

- **Quick checks:** If path or locale is wrong, ensure you use `extractPath(context)` and `context.locale` (from getStaticProps/getServerSideProps); do not assume path or locale from elsewhere. Keep the proxy chain order (Multisite → Redirects → Personalize).
- **Security:** Use only environment variables in `sitecore.config.ts`; never hardcode API keys, editing secret, or host URLs. Do not expose secrets in client-side code or in logs. Validate and sanitize user input at boundaries.
- **Performance:** Keep middleware lightweight; use the proxy `skip` callback and `matcher` so middleware does not run on `/api`, `_next`, static files, or health checks. Use `revalidate` in getStaticProps for ISR where appropriate. Prefer server-side data fetching for Sitecore content.
- **Sitecore patterns:** Use SDK field components (`<Text>`, `<RichText>`, `<Image>`) and validate field existence before render. Register new components in `.sitecore/component-map.ts`. Keep the single Sitecore client instance in `lib/sitecore-client.ts` and pass it (or use it) in API routes and getStaticProps/getServerSideProps.
- **Consistency:** Follow the existing patterns in `[[...path]].tsx`, `_app.tsx`, and API routes. When adding API routes, add the corresponding rewrite in `next.config.js` and keep the middleware matcher in sync.

---

## DO & DON'T (app-level)

| DO | DON'T |
|----|-------|
| Use `extractPath(context)` and `context.locale` for page data | Assume path or locale from elsewhere |
| Use `client.getPage`, `getDictionary`, `getComponentData` per existing patterns | Fetch in client components when SSR/SSG is intended |
| Keep `proxy.ts` / middleware matcher in sync with excluded paths | Add heavy logic to middleware without `skip` for `/api`, `_next`, etc. |
| Use `.sitecore/sites.json` for multisite list in API routes and middleware | Hardcode site list or commit `.env` |
| Follow existing SSG/SSR and preview patterns in `[[...path]].tsx` | Change getStaticPaths/getStaticProps contract without updating callers |
| Use Sitecore field components (`<Text>`, `<RichText>`, `<Image>`) and validate fields | Expose API keys or editing secret in client code |
| Document required env vars in `.env.example` only | Commit `.env` or `.env.local` |
| Run `npm run build` after changes to verify the app builds | Add npm dependencies without explicit user approval |

---

## Guardrails for agentic AI

- **Preserve behavior:** Do not change the contract of `getStaticPaths` / `getStaticProps` (or getServerSideProps), the proxy chain order, or the shape of page props/layout without updating all consumers. Preserve SSG/SSR and preview behavior.
- **Do not expand scope:** Limit edits to the app (pages, components, API routes, config). Do not modify SDK packages or monorepo tooling unless explicitly asked. Do not change CI, lockfiles, or root config.
- **Follow existing patterns:** When adding pages, API routes, or components, mirror the existing structure and naming. Use the same Sitecore client, component map, and env-based config. Do not introduce new patterns (e.g. a second client or a different way to resolve site/locale) without clear need.
- **Verify and stay safe:** After edits, the app should build with `npm run build`. Do not commit secrets or `.env`; only document variables in `.env.example`. Do not add npm dependencies without explicit approval. When in doubt, prefer the existing implementation and ask for clarification.
- **If the user asks for something that conflicts with these guardrails** (e.g. changing proxy order, committing `.env`, or skipping the component map), explain the constraint and suggest a safe alternative rather than complying.

---

## Example agent tasks

- **Add a new Sitecore component:** Create the component under `src/components/`, register it in `.sitecore/component-map.ts`, and ensure it is rendered in the layout/placeholder as in existing components.
- **Add an API route:** Create the route under `src/pages/api/`, add a rewrite in `next.config.js` if the route should be reached from a public URL (e.g. `/my-path` → `/api/my-handler`), and ensure the proxy `matcher` in `proxy.ts` still excludes it (or add the path to the matcher exclusions if needed).

---

## Boundaries

**Never edit:** `.next/`, `node_modules/`.

**Environment variables:** You may add new env vars when needed. Do it carefully: add the variable to `.env.example` (or `.env.remote.example` / `.env.container.example` in this template) with a placeholder or comment; never put real secrets in example files. If editing `.env.local` for local dev, add only the variable name and tell the user to set the value. **Never commit** `.env` or `.env.local` — they are gitignored.

**Edit with care:** `next.config.js` (rewrites, i18n), `sitecore.config.ts` (env only), `proxy.ts` (matcher and proxy order). When adding API routes or rewrites, keep middleware `matcher` and rewrite rules consistent.

**Focus on:** `src/pages/`, `src/components/`, `src/lib/`, `Layout.tsx`, `Providers.tsx`, `sitecore.config.ts`, `next.config.js`, `proxy.ts`, `.sitecore/component-map.ts`.

---

## References

- **Skills.md** — Capability groupings for this app; [.agents/skills/](.agents/skills/) provides each capability as an Agent Skill (when-to-use, hard rules, stop conditions) for tools that support the [Agent Skills](https://agentskills.io) standard.
- **CLAUDE.md** — Full coding standards and Sitecore patterns for this template.
- **.cursor/rules/** — Project and Sitecore rules.
- [Sitecore Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html) — Official docs.
- [Next.js Pages Router](https://nextjs.org/docs/pages) — Data fetching, API routes, i18n.

**For head applications / empty starters:** If you use this template for your head application (e.g. empty starter), keep this AGENTS.md as that head application's guide. Do not replace it with the Content SDK monorepo root AGENTS.md — that file describes the SDK source tree, not the head application. Adjust only what is specific to your project (e.g. custom layout or workflow). See the Content SDK README "AI Development Support" section for more on which AGENTS.md to use.

---

**Remember:** When in doubt, follow existing patterns in this app and refer to `CLAUDE.md` and `.cursor/rules/` for Sitecore and code standards.
