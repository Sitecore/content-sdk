---
'@sitecore-content-sdk/angular': minor
---

Add loader prefetch for `scRouterLink`/`scRichText` links, so route data is already loaded by the time a user navigates.

Controlled per-link via each directive's `prefetch` input, or globally via `sitecore.config`'s `angular.linkPrefetch`:
- `'eager'` (default) — prefetch as soon as the link renders.
- `'hover'` — defer prefetching until the pointer dwells on the link for `angular.linkPrefetch.delayMs` (default 100ms).
- `'off'` — never prefetch.
