---
'@sitecore-content-sdk/content': patch
'@sitecore-content-sdk/nextjs': patch
'@sitecore-content-sdk/react': patch
---

Fix build failure when `disableCodeGeneration: true` by writing empty import maps during codegen and defaulting `loadImportMap` to `noopLoadImportMap` when the prop is omitted.