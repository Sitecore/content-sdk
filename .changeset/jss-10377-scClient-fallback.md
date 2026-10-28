---
'@sitecore-content-sdk/content': minor
---

Avoid throwing errors in scClient calls when context ID in browser is missing.
 * Replaces the GraphQL client used by scClient with no-op fallback in browser context, when public content ID is missing, preventing `getPage()`, `getDictionary()` and other GraphQL-bound method from throwing.
 * Adds a guard into `getHeadLinks()` call to return empty results when client context ID is missing, instead of throwing an error.
 * Client Context ID becomes required for rendering head links.
