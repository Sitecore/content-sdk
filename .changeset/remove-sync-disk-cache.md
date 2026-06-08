---
'@sitecore-content-sdk/nextjs': patch
---

Remove unused sync-disk-cache dependency which was unmaintained and had security warnings. The package was declared but never actually imported or used in the codebase.
