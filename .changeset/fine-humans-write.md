---
'create-content-sdk-app': patch
'@sitecore-content-sdk/content': patch
'@sitecore-content-sdk/core': patch
---

Resolve FEaaS/BYOC stylesheet links against the configured Edge URL (framework-wide). App Router only: drop `precedence="high"` so styles apply instead of preload.
