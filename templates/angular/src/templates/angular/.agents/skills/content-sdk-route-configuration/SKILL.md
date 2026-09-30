---
name: content-sdk-route-configuration
description: Angular catch-all behind scLocaleMatcher in app.routes.ts, kept in sync with app.routes.server.ts.
---

# Route configuration (Angular)

**Detail:** [AGENTS-angular-specifics.md#routing-and-data-fetching](../../docs/AGENTS-angular-specifics.md#routing-and-data-fetching)
**Read first:** `src/app/app.routes.ts`, `src/app/app.routes.server.ts`

## When

- Changing routes, resolvers, or error pages
- Wrong HTTP status returned for 404 / 500

## Rules

- Single Sitecore entry: `path: '**'` → `PageComponent`, inside the `scLocaleMatcher(scConfig.angular.locales)` block
- Attach data with `loaderResolver('<key>')`; the key must exist in `LOADERS`
- `404` / `500` exist unprefixed **and** `:locale/`-prefixed so `@angular/ssr` can match them
- Every change to `app.routes.ts` needs the matching `ServerRoute` update in `app.routes.server.ts` (render mode + `status`)
- Do not fetch Sitecore data in `app.ts`

## Stop

- Stop if adding a second catch-all for Sitecore content
- Stop if a route change cannot be mirrored in `app.routes.server.ts`

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
