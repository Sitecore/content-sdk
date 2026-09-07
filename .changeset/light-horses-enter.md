---
'@sitecore-content-sdk/content': minor
'@sitecore-content-sdk/react': minor
---

Treat Layout Service `isContentResolved` as datasource validity in `withDatasourceCheck()`

- `ComponentRendering` now includes optional `isContentResolved` from the layout `rendered` JSON
- When `isContentResolved` is `false`, `withDatasourceCheck()` uses the existing missing-datasource fallback
- When the property is omitted or `true`, existing behavior is unchanged
