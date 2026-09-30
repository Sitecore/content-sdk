---
name: content-sdk-loader-authoring
description: Writing loaders in src/content-sdk/loaders/ without Angular DI; LoaderContext helpers and the LOADERS registry.
---

# Loader authoring (Angular)

**Detail:** [AGENTS-loaders-and-di.md](../../docs/AGENTS-loaders-and-di.md)
**Read first:** `src/content-sdk/loaders/page.loader.ts`, `src/content-sdk/loaders/index.ts`

## When

- Adding, changing, or debugging a loader
- Any edit under `src/content-sdk/`
- A component needs Sitecore data it does not currently receive

## Rules

- Loaders live in `src/content-sdk/loaders/`, never in `src/app/`
- **No `inject()`, no constructor DI, no Angular services in a loader body** — loaders also run from plain Express middleware at `POST /_data`, where there is no injector
- Get config and client by static import: `scConfig` from `sitecore.config.ts`, `getClient()` from `../client/sitecore-client`
- Get request state from the `LoaderContext` argument: `getLanguage`, `getSiteName`, `getVariantId`, `getComponentVariantIds`, `getEditingPreviewData`, `splitLocaleFromPath`
- Register in the one `LOADERS` object; the key must match the `loaderResolver('<key>')` argument in `app.routes.ts`
- Return JSON-serializable data — results cross `TransferState`
- Signal not-found with `throw new NotFoundNavigationError()`

## Stop

- Stop if the task requires per-request Angular state that only DI can provide — surface the conflict instead of injecting into a loader
- Stop if asked to move loaders under `src/app/` or to maintain a second server-side loader set

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
