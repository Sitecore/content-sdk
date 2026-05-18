---
'@sitecore-content-sdk/core': patch
'@sitecore-content-sdk/content': patch
---

[core][content] Replace `url-parse` with the WHATWG `URL` API in the GraphQL client and media URL helpers to avoid Node `DEP0169` / legacy URL parsing warnings.
