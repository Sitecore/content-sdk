---
name: content-sdk-personalization-and-analytics
description: Personalize middleware variants in loaders; SITECORE_ANALYTICS events; bot tracking.
---

# Personalization and analytics (Angular)

**Detail:** [AGENTS-angular-specifics.md#personalization-and-analytics](../../docs/AGENTS-angular-specifics.md#personalization-and-analytics)
**Read first:** `src/server.ts`, `src/app/components/content-sdk/cdp-page-view.component.ts`

## When

- Personalized variants not applied, or applied to the wrong request
- Adding analytics events

## Rules

- `createPersonalizeMiddleware` writes variants to `req.scParams`; the loader forwards them with `getVariantId(context)` / `getComponentVariantIds(context)` into `getPage(..., { personalize })`
- Personalize runs after multisite, bot tracking and redirects — do not move it
- Prefetch requests (`x-sc-purpose: prefetch`), bots, editing/preview and `/api/*` are skipped; a prefetch must never fire a CDP exposure event
- A CDP timeout falls back to the default variant — never block the render on CDP
- Personalized responses carry `Cache-Control: private, no-store`; do not cache them at a CDN
- Variant ids are part of the loader cache key
- Dynamic content tokens (`personalize.dynamicContent`): the middleware forwards Personalize tokens in the `x-sc-personalize-tokens` request header; the page loader passes `tokens: getPersonalizeTokens(context)` to `getPage`. Requests with tokens skip the loader cache and respond with `Cache-Control: private, no-store`. Never put tokens in `scParams` or a cache key
- Tokens are authored as `{{key}}` / `{{key|fallback}}`; unmatched tokens render the fallback or are removed. Preview, Design Library and error pages are never processed
- Analytics: inject the `SITECORE_ANALYTICS` token; fire events only when `page.mode.isNormal`. The browser implementation is off in dev mode and without `api.edge.clientContextId`
- Personalize requires Edge configuration and does not work against local containers

## Stop

- Stop if a change would send CDP events during prefetch, editing, or preview
- Stop if browser-side CDP event tracking is requested — it is not implemented in this SDK version

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
