---
'@sitecore-content-sdk/content': patch
'create-content-sdk-app': patch
---

Stop synthesizing a default site in `generateSites` and return empty app-router static params when `generateStaticPaths` is false (editing hosts).
