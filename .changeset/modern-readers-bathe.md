---
'@sitecore-content-sdk/core': patch
---

Fix metadata package discovery for pnpm projects. When invoked by pnpm, read Sitecore package versions from `node_modules` instead of using `npm query`, which fails with `EBADDEVENGINES` when `devEngines.packageManager` is set to pnpm.
