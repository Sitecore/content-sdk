---
'@sitecore-content-sdk/nextjs': patch
---

`MultisiteProxy` now resolves the site from the unprefixed `site` query string parameter only for draft mode App Router requests, so third-party requests containing `?site=...` no longer override the resolved site or overwrite the `sc_site` cookie.

If you need to force the site via query string, use the `sc_site` parameter (the supported one) instead of `site`. Site resolution in editing is unaffected.
