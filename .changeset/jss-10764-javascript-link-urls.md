---
'@sitecore-content-sdk/react': patch
'@sitecore-content-sdk/nextjs': patch
---

Omit `javascript:` hrefs from `Link`. The link text still renders, each blocked URL is logged once, and Pages editing chromes stay in place. React 19 blocks these URLs, so the component no longer passes them through to the anchor.
