---
'@sitecore-content-sdk/nextjs': patch
---

Stop the proxy chain once an upstream handler returns a redirect so custom plugins chained after RedirectsProxy cannot override Sitecore redirect responses. Short-circuit on 403, `res.redirected`, or 3xx status codes to support Next.js 16 redirect responses.
