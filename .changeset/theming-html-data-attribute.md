---
'@sitecore-content-sdk/content': minor
'@sitecore-content-sdk/nextjs': minor
'create-content-sdk-app': patch
---

[Theming] Scope site-level design-token theming to a `data-sc-theme` attribute on the `<html>` element instead of the `sc-ds-theme` class on `<body>`. Replaces `THEMING_BODY_CLASS_NAME` with `THEMING_HTML_ATTRIBUTE_NAME` and adds a `getThemingHtmlAttributes(mode)` helper; Next.js templates spread it onto `<html>`.
