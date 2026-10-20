---
'@sitecore-content-sdk/content': patch
---

Avoid throwing errors in scClient calls when context ID in browser is missing.
 * Replaces the GraphQL client used by scClient with no-op fallback in browser context, when public content ID is missing, preventing `getPage()`, `getDictionary()` and other GraphQL-bound method from throwing.
 * Adds `edgeInitialized` to scClient to indicate the status of Sitecore Edge connectivity. `false` in browser when public Edge context ID is missing.
 * Adds a guard into `getHeadLinks()` call to return empty results when both server and client context IDs are missing, instead of throwing an error.
