---
'@sitecore-content-sdk/angular': patch
'@sitecore-content-sdk/nextjs': patch
'create-content-sdk-app': patch
---

`sc:item` tags no longer carry a version segment (`sc:item:<id>:<locale>`), so cache writes and
webhook revalidation always agree.
Item cache tags could previously include a specific published version (`sc:item:<id>:<locale>:v<N>`)
when the layout response reported `itemVersion`, but webhook-driven revalidation always targets
`sc:item:<id>:<locale>:latest`. The mismatch meant those page cache entries were silently unreachable by `revalidateTag` and only went stale on cache TTL expiry.
