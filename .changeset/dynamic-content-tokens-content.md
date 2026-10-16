---
'@sitecore-content-sdk/content': minor
---

Add Dynamic Content Tokens: authors can place `{{key}}` / `{{key|fallback}}` tokens in layout string fields. After personalization, `SitecoreClient.finalizePersonalizedPage` substitutes a flat token map (or `{}` fallbacks) with baseline HTML-context and URL safety, then applies content/media rewrite. `PageOptions.tokens` activates processing; `deferFinalization` returns the raw post-personalization page for shared caches. Token-enabled Personalize flow output is documented as `{ variantId?, tokens? }`; `personalize()` remains `unknown`.

**Existing heads:** omitting `tokens` preserves authored `{{mustache}}`. After upgrade, every published `getPage` / `getErrorPage` call must pass `tokens: readPersonalizeTokens(...) ?? {}` or `tokens: {}`. Preview and Design Library omit `tokens`. Shared caches must store only `deferFinalization: true` raw pages and finalize request-locally. Keep PersonalizeProxy / personalize middleware in the chain so inbound token headers cannot be spoofed.
