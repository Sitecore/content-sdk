---
'@sitecore-content-sdk/nextjs': patch
---

[nextjs] Short-circuit the proxy chain when a handler returns 403 or a redirect (`redirected` or HTTP 3xx), so upstream redirects (e.g. next-intl locale negotiation) are preserved when composed with `defineProxy`
