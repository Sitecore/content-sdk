---
'@sitecore-content-sdk/content': minor
'@sitecore-content-sdk/nextjs': minor
'create-content-sdk-app': patch
---

Add opt-in site-level design-token theming via `CSDK_FEATURE_THEMING` / `theming.mode`, injecting a stylesheet link through the existing head-links pipeline and applying `sc-ds-theme` on `<body>` when site theming is enabled.
