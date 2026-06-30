---
'create-content-sdk-app': patch
'@sitecore-content-sdk/content': patch
---

Return empty app-router static params when `generateStaticPaths` is false (standard app-router template). Only prepend the configured default site to `sites.json` when `defaultSite` is explicitly set. Cache-components OSR template uses a build-validation site placeholder (`_DEFAULT_`) in `generateStaticParams` when path generation is off so `next build` succeeds without Edge or CMS content.
