---
'@sitecore-content-sdk/nextjs': patch
'create-content-sdk-app': patch
---

Fix cross-origin editing cookies and draft mode detection on Vercel. Editing cookies now include SameSite=None; Secure for cross-origin iframe compatibility, and page templates fall back to URL searchParams for editing detection when draftMode() returns false on serverless platforms.
