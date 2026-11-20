---
'@sitecore-content-sdk/core': patch
'@sitecore-content-sdk/react': patch
'@sitecore-content-sdk/nextjs': patch
---

Omit `javascript:` hrefs from `Link`. The link text still renders, a blocked URL is logged when that link is shown, and Pages editing chromes stay in place. React 19 blocks these URLs, so the component no longer passes them through to the anchor.
