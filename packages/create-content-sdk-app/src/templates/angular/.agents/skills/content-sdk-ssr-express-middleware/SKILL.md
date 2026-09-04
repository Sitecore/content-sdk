---
name: content-sdk-ssr-express-middleware
description: Express middleware chain in src/server.ts; fixed order and the server-only bundle boundary.
---

# SSR and Express middleware (Angular)

**Detail:** [AGENTS-angular-specifics.md#express-server-and-middleware-order](../../docs/AGENTS-angular-specifics.md#express-server-and-middleware-order)
**Read first:** `src/server.ts`, `src/app/app.config.server.ts`

## When

- Adding or reordering Express middleware
- Adding a server endpoint
- SSR renders differently from client-side navigation

## Rules

- Order is fixed: `express.json()` → revalidate → sitemap → robots → editing (config, experimental, render) → multisite → bot tracking → redirects → personalize → `/_data` loader middleware → static → `angularApp.handle`
- Multisite before personalize; bot tracking before personalize; redirects before personalize; editing before static and SSR; `/_data` before the SSR handler
- New endpoints register before `express.static`; add app-specific exemptions to `middlewareMatcher.excludePaths`
- Pass the **same** `loaderCache` instance to the revalidate middleware, the `/_data` middleware, and `angularApp.handle(req, { cache, req, res })`
- `express`, `unstorage`, `node:*` and every `create*Middleware` are server-only — never import them from `src/app/**`
- SSR needs `provideServerLoaderRunner()` in `app.config.server.ts`

## Stop

- Stop if a change would move personalize before multisite or `/_data` after the SSR handler
- Stop if a server-only import would become reachable from `src/main.ts`

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
