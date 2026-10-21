---
'@sitecore-content-sdk/nextjs': patch
'create-content-sdk-app': patch
---

Fix `403 Forbidden` for `public` folder static files (e.g. `.svg`, `.woff2`) in Pages Builder editing mode. `PreviewProxy` now skips known static asset extensions, and the template `proxy.ts` matcher excludes them.