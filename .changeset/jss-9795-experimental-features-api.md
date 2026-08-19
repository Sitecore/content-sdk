---
'@sitecore-content-sdk/content': minor
'@sitecore-content-sdk/nextjs': minor
'@sitecore-content-sdk/angular': minor
'create-content-sdk-app': patch
---

[experimental] Add experimental features visibility API shared across frameworks. Types/utils live in `@sitecore-content-sdk/content`; each framework package owns its `experimental.json` catalog. Next.js and Angular expose editing-secret protected endpoints, wired in all Next.js templates and the Angular server.
