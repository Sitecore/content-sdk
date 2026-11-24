---
'@sitecore-content-sdk/core': patch
'@sitecore-content-sdk/nextjs': patch
'@sitecore-content-sdk/angular': patch
---

Harden editing secret handling. An invalid editing secret no longer writes the sent or expected secret to debug logs. The message now points to the `SITECORE_EDITING_SECRET` environment variable on the editing host. Editing and revalidate secrets are now compared in constant time (`crypto.timingSafeEqual`) to prevent timing attacks.
