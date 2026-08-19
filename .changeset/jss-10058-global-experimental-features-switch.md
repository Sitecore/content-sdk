---
'@sitecore-content-sdk/content': minor
'@sitecore-content-sdk/nextjs': minor
'@sitecore-content-sdk/angular': patch
'create-content-sdk-app': patch
---

[experimental] Add a global env switch for experimental features.

Experimental feature status now requires the app-level `CSDK_EXPERIMENTAL_FEATURES_ENABLED` flag in addition to any feature-specific env vars. The shared experimental helpers expose the global env var constant and helper, and starter env examples document how to enable experimental features during development.
