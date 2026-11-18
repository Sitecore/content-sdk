---
'@sitecore-content-sdk/react': patch
---

Remove `javascript:` URLs from `RichText` and from `Text` when `encode` is false. The surrounding HTML and text stay in place, and each blocked URL is logged once.
