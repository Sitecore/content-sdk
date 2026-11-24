---
'@sitecore-content-sdk/content': patch
'@sitecore-content-sdk/core': patch
---

`LayoutService` now passes `site`, `routePath` and `language` to the layout query as GraphQL variables, so a route path from the request URL can no longer change the query. URLs with characters such as `"`, `\` or line breaks now resolve to a not-found page instead of an HTTP 500. A custom `layout.formatLayoutQuery` now gets its values escaped for use inside a double-quoted GraphQL string.
