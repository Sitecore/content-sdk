# Key concepts (Pages Router)

Optional, on-demand detail for this scaffolded head app. The compact guide is [AGENTS.md](../../AGENTS.md); open this file when you need middleware, client, catch-all, locale, and related concepts.

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
