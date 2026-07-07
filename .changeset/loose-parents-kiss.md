---
'@sitecore-content-sdk/content': patch
'@sitecore-content-sdk/nextjs': patch
'@sitecore-content-sdk/react': patch
---

Fix build failure when `disableCodeGeneration: true` by writing empty import map stubs during codegen and using a no-op `loadImportMap` fallback when the prop is omitted.
