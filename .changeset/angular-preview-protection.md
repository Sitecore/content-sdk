---
'@sitecore-content-sdk/angular': minor
'@sitecore-content-sdk/content': patch
---

Add preview protection for Angular editing.
 - Enables preview navigation in Sitecore AI Pages editor
 - The editing render middleware issues the `sc_preview_token` cookie from the editor bearer
 - The new `resolvePreviewPage` util forwards that token as the `Authorization` header when fetching preview / Design Library layout in page loader
 - Promotes the shared `PREVIEW_TOKEN` cookie name into `@sitecore-content-sdk/content/editing`.
