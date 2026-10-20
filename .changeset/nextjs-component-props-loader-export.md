---
'@sitecore-content-sdk/nextjs': patch
---

Point the `./component-props-loader` export at the published root shim. The previous `dist` and `types` paths were never built, so webpack could not resolve the loader used to strip `getComponentServerProps` from client bundles.
