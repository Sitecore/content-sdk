---
'@sitecore-content-sdk/angular': minor
---

Add Dynamic Content Tokens host support. Personalize middleware strips untrusted inbound `scParams.tokens`, writes a trusted map, and applies both the common 7000-byte token budget and the SC_PARAMS envelope budget. `getPersonalizeTokens(context)` reads the middleware-written map.

**Breaking type change:** published `@public` `LoaderRegistry` is now `Record<string, LoaderDefinition>` instead of `Record<string, LoaderFn>`. Constructing a registry remains source-compatible (function entries still work). Callers that invoked `registry[id](ctx)` directly must use `resolveLoaderDefinition(registry[id])` and call `.load(ctx)`. The runner finalizes hit/stale/miss/disabled foreground values request-locally and never caches visitor-finalized pages.

Responses with usable visitor token values set `Cache-Control: private, no-store`.

**Existing Angular heads:** function-only `page` / `404` / `500` loaders never finalize. Switch those entries to `{ load, finalize }` (see the starter `finalize-page.loader.ts`) and use `getPersonalizeTokens(context) ?? {}` on published pages. Preview / Design Library skip finalization. Call `resolveLoaderDefinition(registry[id])` instead of `registry[id](ctx)`. Keep personalize middleware in the Express chain and redact `x-sitecore-params` in CDN and request logs.

Editing and preview renders are no longer written to or read from the shared loader cache. `ServerLoaderRunner.resolve` now enforces this for every entry point, including the public `/_data` endpoint, which previously had no such guard. Preview values are keyed like published ones and skip finalization, so a cached preview render could otherwise be served to ordinary visitors with authored token literals left unresolved.
