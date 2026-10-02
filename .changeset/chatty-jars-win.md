---
'@sitecore-content-sdk/angular': minor
'@sitecore-content-sdk/nextjs': minor
'@sitecore-content-sdk/cli': minor
---

Add `sitecore-tools project experimental list` to show the experimental features available in the current Content SDK app.
The command reads the app's framework package (`@sitecore-content-sdk/nextjs` or `@sitecore-content-sdk/angular`) and prints each feature with its enabled status. Framework packages now export `experimentalFeaturesCatalog` from their `/experimental` entry.
