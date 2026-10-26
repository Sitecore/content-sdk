---
'@sitecore-content-sdk/nextjs': patch
'@sitecore-content-sdk/react': patch
---

Merge the `style` passed to `Image` and `NextImage` over the default empty image placeholder's inline styles, so the 48px minimum size can be overridden. A passed `alt` is now forwarded to the placeholder too.
