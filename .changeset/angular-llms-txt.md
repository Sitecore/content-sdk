---
'@sitecore-content-sdk/angular': minor
'create-content-sdk-app': patch
---

[angular] llms.txt Support

Added `createLlmsTxtMiddleware({ client, sites })`, an Express handler serving the llms.txt content managed via SitecoreAI for the site resolved by host name. The Angular template mounts it at `/llms.txt`.
