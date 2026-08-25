---
'@sitecore-content-sdk/content': minor
'@sitecore-content-sdk/nextjs': minor
'@sitecore-content-sdk/angular': patch
'create-content-sdk-app': patch
---

[experimental] Add a global env switch for experimental features.

Experimental feature status now treats the app-level `CSDK_GLOBAL_EXPERIMENTAL_FEATURES_ENABLED` as a global enable switch. When the global switch is off, feature status falls back to individual feature env vars. The shared experimental helpers expose the global env var constant (`CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG`) and helper, and starter env examples document how to enable experimental features during development.
