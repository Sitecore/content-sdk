# AGENTS.md — AI Guidance for Sitecore Content SDK Next.js (App Router) App

## Project Overview

This is a **Sitecore Content SDK** application built with **Next.js (App Router)** and **TypeScript**. AI agents work as developer assistants within this scaffolded head application. The app integrates with Sitecore XM Cloud for content, uses **file-based routing with `[site]` and `[locale]`**, next-intl for i18n, and Edge middleware for multisite, redirects, and personalization.

**Scope:** This file applies to **this application only** (a scaffolded head app). It is **not** the Content SDK monorepo — for SDK package development use that repo's `AGENTS.md`. Here we edit app code and config (app router, components, API routes, i18n); we do not modify SDK packages or CI.

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

## Application Structure (App Router)

```
src/
  app/                           # Next.js App Router
    layout.tsx                    # Root layout
    [site]/                       # Site segment (multisite)
      layout.tsx                  # Site layout (Bootstrap, draftMode)
      [locale]/                   # Locale segment (i18n)
        [[...path]]/
          page.tsx                # Sitecore page
          not-found.tsx           # 404 with Sitecore error page
    not-found.tsx                 # Root not-found
    api/                          # Route handlers
      sitemap/route.ts, robots/route.ts, editing/config/route.ts, editing/render/route.ts
  components/                    # React components (Sitecore + app-specific)
  lib/                           # sitecore-client, component-props
  i18n/                          # next-intl
    routing.ts                    # locales, defaultLocale, localePrefix
    request.ts                    # getRequestConfig, getDictionary per site
  Layout.tsx, Providers.tsx, Bootstrap.tsx, Scripts.tsx
proxy.ts                         # Edge middleware (locale, multisite, redirects, personalize)
.sitecore/                       # component-map.ts, component-map.client.ts, import-map.*, sites.json, metadata.json
sitecore.config.ts               # Sitecore config (api, defaultSite, defaultLanguage, multisite, etc.)
next.config.ts                   # next-intl plugin, rewrites, images
```

---

## Key concepts for this app

These are the main head-app–specific concepts. Details are in the sections below.

### Middleware (Edge proxy)

- **Where:** `src/proxy.ts`. Next.js runs middleware from `middleware.ts` at root or in `src/` — if the app only has `proxy.ts`, add `src/middleware.ts` that re-exports it.
- **What it does:** Runs on each request (respecting the `matcher`). Chain order is **fixed:** LocaleProxy → AppRouterMultisiteProxy → RedirectsProxy → PersonalizeProxy. Locale must run first so i18n and multisite see the correct locale.
- **Config:** Uses `sitecore.config.ts` (multisite, redirects, personalize), `.sitecore/sites.json`, and `src/i18n/routing.ts` (locales). **Do not change proxy order.** Keep the matcher excluding API, `_next/`, sitemap, robots, and static assets so the proxy stays lightweight.

### SitecoreClient

- **Where:** Single shared instance in `src/lib/sitecore-client.ts` — `new SitecoreClient({ ...scConfig })` with config from `sitecore.config.ts`.
- **Use for:** `getPage`, `getDictionary`, `getErrorPage`, `getPreview`, `getDesignLibraryData`, `getAppRouterStaticParams`. All Sitecore data fetching in the app goes through this client.
- **Do not:** Create a second client or instantiate SitecoreClient elsewhere. Pass `site` and `locale` from route params (or `parseRewriteHeader` in not-found), not from global state.

### Catch-all route

- **Where:** `src/app/[site]/[locale]/[[...path]]/page.tsx`. This is the **only** page component that renders Sitecore content; the optional `[[...path]]` segment captures the content path.
- **Flow:** `params` is a Promise (Next.js 15+) — `await params` to get `{ site, locale, path? }`. Call `client.getPage(path ?? [], { site, locale })`. For preview, use `draftMode()` and `client.getPreview(editingParams)` or `client.getDesignLibraryData(editingParams)` from `searchParams`. Call `setRequestLocale(\`${site}_${locale}\`)` at the top of the page for next-intl.
- **Do not:** Add another catch-all or page at a different path for Sitecore pages; keep this single entry point.

### How locale works

- **In the URL:** All content routes are `/[site]/[locale]/...path` (e.g. `/default/en`, `/default/en/about`). Middleware (LocaleProxy, then AppRouterMultisiteProxy) rewrites incoming requests into this shape.
- **In the app:** next-intl uses a single `requestLocale` per request. This app encodes both site and locale as `requestLocale = \`${site}_${locale}\``. In the page, call `setRequestLocale(\`${site}_${locale}\`)` so next-intl and `src/i18n/request.ts` see it. In `request.ts`, parse `requestLocale` (e.g. `split('_')`) to get site and locale, then load the dictionary with `client.getDictionary({ locale, site })`.
- **Config:** `src/i18n/routing.ts` defines `locales` and `defaultLocale`; align these with Sitecore languages (e.g. from `sitecore.config.ts`). **Do not** change the `{site}_{locale}` convention without updating request.ts and all pages that call `setRequestLocale`.

### More (component maps, editing, env)

- **Component maps:** `.sitecore/component-map.ts` (Server) and `.sitecore/component-map.client.ts` (Client). Register every Sitecore component here; keep in sync with `src/components/`.
- **Editing/preview:** Use `draftMode()` in Server Components; when enabled, use `client.getPreview(searchParams)` or `client.getDesignLibraryData(searchParams)`. Editing API routes live under `src/app/api/editing/`.
- **Env:** All config via environment variables in `sitecore.config.ts`. Document vars in `.env.example` (or `.env.remote.example` / `.env.container.example`); never commit `.env` or `.env.local`.

---

## Next.js App Router specifics

### Routing: `[site]` / `[locale]` / `[[...path]]`

- **URL shape:** `/[site]/[locale]/...path` (e.g. `/default/en`, `/default/en/about`). Site and locale are **in the path**; the Edge proxy rewrites incoming requests to this shape.
- **Page component:** `src/app/[site]/[locale]/[[...path]]/page.tsx`. Receives `params: Promise<{ site, locale, path? }>`. Use `await params`; pass `site` and `locale` to `client.getPage(path ?? [], { site, locale })`.
- **Layout hierarchy:** `app/layout.tsx` → `app/[site]/layout.tsx` (per-site; runs Bootstrap with `siteName={site}` and `draftMode()`) → page. Do not put site/locale-specific data fetching in the root layout; use the `[site]` or page layout.

### i18n (next-intl)

- **Config:** `src/i18n/routing.ts` — `defineRouting({ locales, defaultLocale, localePrefix })`. Align `locales` with Sitecore languages; often sourced from `sitecore.config.ts` (e.g. `defaultLanguage`).
- **Request config:** `src/i18n/request.ts` — `getRequestConfig` receives `requestLocale`. The app uses `{site}_{locale}` (e.g. set by `setRequestLocale(\`${site}_${locale}\`)` in the page). Parse with `requested?.split('_')` to get `parsedSite` and `parsedLocale`; load dictionary with `client.getDictionary({ locale, site: parsedSite })` and return `{ locale, messages }`.
- **In pages:** Call `setRequestLocale(\`${site}_${locale}\`)` at the top of the page so next-intl and request config see the correct locale.

### Multisite and Edge middleware (proxy)

- **Site list:** `.sitecore/sites.json` — typically generated by the Sitecore CLI or deployment. Used by middleware and API route handlers. Avoid hand-editing unless you know the format.
- **Edge middleware:** Implemented in **`src/proxy.ts`**. Next.js only runs middleware from a file named `middleware.ts` at root or in `src/`. If this app has only `proxy.ts`, add `src/middleware.ts` that re-exports it (e.g. `export { default } from './proxy';`) so the proxy runs.
- **Proxy chain (order is critical):** `defineProxy(locale, multisite, redirects, personalize).exec(req)`:
  - **LocaleProxy** — runs first; uses `sites` and `routing.locales` from `src/i18n/routing.ts`. Required for App Router so locale is set before multisite.
  - **AppRouterMultisiteProxy** — rewrites to `/[site]/[locale]/[...path]`; uses `scConfig.multisite`.
  - **RedirectsProxy** — redirects; uses `scConfig.redirects`, `scConfig.api.edge`, `scConfig.api.local`.
  - **PersonalizeProxy** — personalization; uses `scConfig.personalize`; often disabled in dev.
- **Matcher:** Exclude API routes, `_next/`, sitemap, robots, healthz, Sitecore paths, and static assets so middleware does not run on every static request. The matcher is defined in `config` in `proxy.ts` (or in `middleware.ts` if it re-exports the proxy).
- **Config:** `sitecore.config.ts` → `multisite`, `redirects`, `personalize`; never commit secrets.

### Data fetching and preview

- **Page data:** In the page (or a Server Component), use `client.getPage(path ?? [], { site, locale })`. For preview, use `draftMode()`; if `draft.isEnabled`, use `client.getPreview(editingParams)` or `client.getDesignLibraryData(editingParams)` from `searchParams`; otherwise use `getPage` with `site` and `locale`.
- **SSG:** `generateStaticParams` — use `client.getAppRouterStaticParams(sites, routing.locales)` (sites from `.sitecore/sites.json`). Return at least one default param when not generating full paths (e.g. dev or when `generateStaticPaths` is off).
- **Metadata:** `generateMetadata` in the same segment can call `client.getPage(path ?? [], { site, locale })` and derive `title` (e.g. from route fields). Next.js will cache as appropriate.

### Server vs Client components

- **Default:** Components are Server Components. Use `'use client'` only for interactivity (e.g. hooks, event handlers).
- **draftMode:** Used in layout and page; call `await draftMode()` in Server Components that need to know preview state.

### Not-found and error page

- **Segment not-found:** `src/app/[site]/[locale]/[[...path]]/not-found.tsx`. Uses `getCachedPageParams()` from `@sitecore-content-sdk/nextjs` for site/locale, then `client.getErrorPage(ErrorPage.NotFound, { site, locale })` and renders layout if a page is returned.
- **Root not-found:** `src/app/not-found.tsx` — minimal fallback when no segment handles the route.

### API route handlers

- **Sitemap:** `src/app/api/sitemap/route.ts` — `createSitemapRouteHandler({ client, sites })`. Export `{ GET }`; use `sites` from `.sitecore/sites.json`. Set `export const dynamic = 'force-dynamic'` if the handler relies on request.
- **Robots:** `src/app/api/robots/route.ts` — `createRobotsRouteHandler({ client, sites })`. Same pattern.
- **Editing:** `src/app/api/editing/config/route.ts` and `editing/render/route.ts` — use `createEditingConfigRouteHandler` and the appropriate render handler with `components`, `clientComponents` (`.sitecore/component-map.client.ts`), `metadata`, and `client`. Set `dynamic = 'force-dynamic'` where needed.
- **Rewrites:** `next.config.ts` → rewrites for `/sitemap*.xml`, `/robots.txt` with `locale: false` so they are not localized.

### Sitecore client and config

- **Client:** `src/lib/sitecore-client.ts` — `new SitecoreClient({ ...scConfig })`. Use for `getPage`, `getDictionary`, `getErrorPage`, `getPreview`, `getAppRouterStaticParams`, etc.
- **Config:** `sitecore.config.ts` — `defineConfig({ api, defaultSite, defaultLanguage, editingSecret, redirects, multisite, personalize })`. Use env vars only; no hardcoded secrets.

### Component maps and layout

- **Server/client components:** `.sitecore/component-map.ts` (Server); `.sitecore/component-map.client.ts` (Client). Register all Sitecore components; keep in sync with `src/components/`.
- **Layout:** `Layout.tsx` renders page layout and placeholders; `Providers` wrap page and component context; `Bootstrap` in `[site]/layout.tsx` receives `siteName={site}` and preview state.

---

## Best practices

- **Quick checks:** If locale or dictionary is wrong, ensure `setRequestLocale(\`${site}_${locale}\`)` is called at the top of the page and `src/i18n/request.ts` parses `requestLocale` and calls `client.getDictionary`. If not-found doesn't show Sitecore content, use `parseRewriteHeader(headers())` for site/locale. Always `await params` (Next.js 15+).
- **Security:** Use only environment variables in `sitecore.config.ts`; never hardcode API keys, editing secret, or host URLs. Do not expose secrets in client-side code or in logs. Validate and sanitize user input at boundaries.
- **Performance:** Keep middleware lightweight; use the proxy `matcher` so it does not run on API routes, `_next`, sitemap, robots, or static assets. Use Server Components for data fetching; add `'use client'` only where interactivity is needed. Use `generateStaticParams` and caching as in the existing page.
- **Sitecore patterns:** Use SDK field components (`<Text>`, `<RichText>`, `<Image>`) and validate field existence before render. Register new components in `.sitecore/component-map.ts` and `.sitecore/component-map.client.ts` as appropriate. Use the single Sitecore client in `lib/sitecore-client.ts` for all data fetching.
- **Consistency:** Follow the existing patterns in `[site]/[locale]/[[...path]]/page.tsx`, layout hierarchy, `i18n/request.ts` (site_locale), and API route handlers. When adding routes or rewrites, keep the middleware matcher and next-intl config in sync.

---

## DO & DON'T (app-level)

| DO | DON'T |
|----|-------|
| Use `params` as Promise and `await params` in pages and layouts | Use `params` synchronously (Next.js 15+) |
| Pass `{ site, locale }` to `client.getPage` and `getDictionary` | Assume site/locale from headers inside page without using params |
| Run LocaleProxy before AppRouterMultisiteProxy in middleware | Change proxy order (locale must run first for i18n) |
| Call `setRequestLocale(\`${site}_${locale}\`)` in the page for next-intl | Omit setRequestLocale when adding new page branches |
| Use Server Components for async data fetching | Put async data fetching in client components when SSR is intended |
| Use `parseRewriteHeader(headers())` in not-found for site/locale | Hardcode site/locale in not-found or error pages |
| Use createXRouteHandler and `.sitecore/sites.json` for sitemap/robots | Hardcode site list or commit `.env` |
| Use Sitecore field components and validate fields | Expose API keys or editing secret in client code |
| Document required env vars in `.env.example` only | Commit `.env` or `.env.local` |
| Run `npm run build` after changes to verify the app builds | Add npm dependencies without explicit user approval |

---

## Guardrails for agentic AI

- **Preserve behavior:** Do not change the proxy order (LocaleProxy → AppRouterMultisiteProxy → …), the `[site]/[locale]/[[...path]]` route shape, or the way `setRequestLocale` and `i18n/request.ts` use `{site}_{locale}`. Preserve draftMode handling in layout and page.
- **Do not expand scope:** Limit edits to the app (app router, components, API routes, i18n, config). Do not modify SDK packages or monorepo tooling unless explicitly asked. Do not change CI, lockfiles, or root config.
- **Follow existing patterns:** When adding routes, layouts, or components, mirror the existing structure. Use the same Sitecore client, component maps, and env-based config. Do not introduce a different way to resolve site/locale or a second client without clear need.
- **Verify and stay safe:** After edits, the app should build with `npm run build`. Do not commit secrets or `.env`; only document variables in `.env.example`. Do not add npm dependencies without explicit approval. When in doubt, prefer the existing implementation and ask for clarification.
- **If the user asks for something that conflicts with these guardrails** (e.g. changing proxy order, committing `.env`, or skipping the component map), explain the constraint and suggest a safe alternative rather than complying.

---

## Example agent tasks

- **Add a new Sitecore component:** Create the component under `src/components/`, register it in `.sitecore/component-map.ts` and `.sitecore/component-map.client.ts` as appropriate (client components in the client map), and ensure it is rendered in the layout/placeholder as in existing components.
- **Add an API route:** Create the route under `src/app/api/` (e.g. `src/app/api/my-route/route.ts`), add a rewrite in `next.config.ts` if the route should be reached from a public URL, and ensure the proxy `matcher` in `proxy.ts` still excludes it (e.g. `api/` is already excluded).

---

## Boundaries

**Never edit:** `.next/`, `node_modules/`.

**Environment variables:** You may add new env vars when needed. Do it carefully: add the variable to `.env.example` (or `.env.remote.example` / `.env.container.example` in this template) with a placeholder or comment; never put real secrets in example files. If editing `.env.local` for local dev, add only the variable name and tell the user to set the value. **Never commit** `.env` or `.env.local` — they are gitignored.

**Edit with care:** `next.config.ts` (rewrites, next-intl plugin), `sitecore.config.ts` (env only), `proxy.ts` (matcher and proxy order), `src/i18n/routing.ts` and `request.ts`. When adding routes or rewrites, keep middleware `matcher` and rewrite rules consistent.

**Focus on:** `src/app/`, `src/components/`, `src/lib/`, `src/i18n/`, `Layout.tsx`, `Providers.tsx`, `sitecore.config.ts`, `next.config.ts`, `proxy.ts`, `.sitecore/component-map.ts`, `.sitecore/component-map.client.ts`.

---

## References

- **Skills.md** — Capability groupings for this app; [.agents/skills/](.agents/skills/) provides each capability as an Agent Skill (when-to-use, hard rules, stop conditions) for tools that support the [Agent Skills](https://agentskills.io) standard.
- **CLAUDE.md** — Full coding standards and Sitecore patterns for this template.
- **.cursor/rules/** — App Router and Sitecore rules.
- [Sitecore Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html) — Official docs.
- [Next.js App Router](https://nextjs.org/docs/app) — Routing, Server Components, data fetching.
- [next-intl](https://next-intl.dev/docs) — i18n routing and request config.

**For head applications / empty starters:** If you use this template for your head application (e.g. empty App Router starter), keep this AGENTS.md as that head application's guide. Do not replace it with the Content SDK monorepo root AGENTS.md — that file describes the SDK source tree, not the head application. Adjust only what is specific to your project (e.g. custom layout or workflow). See the Content SDK README "AI Development Support" section for more on which AGENTS.md to use.

---

**Remember:** When in doubt, follow existing patterns in this app and refer to `CLAUDE.md` and `.cursor/rules/` for Sitecore and code standards.
