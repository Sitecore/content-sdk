---
'@sitecore-content-sdk/content': minor
'@sitecore-content-sdk/nextjs': minor
'create-content-sdk-app': patch
---

Add opt-in site-level design-token theming via `sitecore.config` `theming.mode`, injecting a stylesheet link through the existing head-links pipeline, applying the `data-sc-theme` attribute on `<html>` (value is the theming mode, e.g. `data-sc-theme="site"`) when site theming is enabled, and exposing the same setting from the editing config endpoint.
