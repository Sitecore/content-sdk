---
'@sitecore-content-sdk/react': patch
---

Fix `RichText` recreating nested DOM on parent re-renders by memoizing `dangerouslySetInnerHTML`, preserving event listeners on unchanged HTML.
