---
'@sitecore-content-sdk/react': patch
---

Normalize `FieldNames` rendering params with `getRenderingParamString` before resolving headless/SXA variants, fixing "component not found" errors when Edge returns `DetailedRenderingParams` objects instead of plain strings.
