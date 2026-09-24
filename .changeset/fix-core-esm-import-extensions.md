---
'@sitecore-content-sdk/core': patch
---

Fix `ERR_MODULE_NOT_FOUND` when `@sitecore-content-sdk/core` is loaded by Node's native ESM resolver. The ESM build now emits relative imports with explicit `.js` extensions and marks `dist/esm` as `"type": "module"`, so apps that list the package in `serverExternalPackages` can run `next build` without falling back to `--webpack`.
