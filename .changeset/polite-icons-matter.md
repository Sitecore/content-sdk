---
'@sitecore-content-sdk/nextjs': patch
---

Fix NextImage SSR failures by cloning frozen image configuration arrays and falling back to a native <img> when Next.js cannot safely resolve image props.
