---
'@sitecore-content-sdk/nextjs': minor
---

Add Dynamic Content Tokens host support. `SitecoreNextjsClient.getPage` now accepts optional `pageOptions` and forwards the full `PageOptions` object (`tokens`, `deferFinalization`, and future fields). `personalize` remains all-or-nothing: a caller-supplied object is used as-is; path-derived values are applied only when `personalize` is omitted.

PersonalizeProxy strips inbound `x-sc-personalize-tokens`, writes only a trusted encoded map, and forwards sanitized request headers via `ProxyBase.forward` (keyed off `x-middleware-rewrite`, including external RedirectsProxy server transfers). Responses with usable visitor token values set `Cache-Control: private, no-store`. Use `readPersonalizeTokens(headers) ?? {}` on stock runtime renders.

**Existing Next.js heads:** a package bump alone does not activate tokens. Pass `tokens` on every published page and error-page fetch; omit them only in Preview / Design Library. Keep `PersonalizeProxy` in the proxy chain so `x-sc-personalize-tokens` is stripped and rewritten. Do not key `'use cache'` or other shared caches on visitor token maps. Redact `x-sc-personalize-tokens` in CDN and request logs.
