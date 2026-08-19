---
'@sitecore-content-sdk/content': minor
'@sitecore-content-sdk/react': minor
---

Treat Layout Service `dataSourceResolveFailed` as an invalid datasource in `withDatasourceCheck()`

- `ComponentRendering` now includes optional `dataSourceResolveFailed`
- When `dataSourceResolveFailed` is `true`, `withDatasourceCheck()` uses the existing missing-datasource fallback
- When the property is omitted or `false`, existing behavior is unchanged
