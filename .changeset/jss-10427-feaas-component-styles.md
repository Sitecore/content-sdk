---
'@sitecore-content-sdk/react': patch
---

Fix FEaaS component styles not applying when stylesheet preloads finish before React hydration. Allow FEaaS to load and apply library CSS while continuing to use server-provided templates and data. No head-app code changes are required.