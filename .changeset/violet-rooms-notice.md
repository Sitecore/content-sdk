---
'@sitecore-content-sdk/angular': patch
'@sitecore-content-sdk/nextjs': patch
---

`sc:item` tags now always use hyphenated lowercase GUIDs (`sc:item:<hyphenated-id>:<locale>:latest`), so cache writes and webhook revalidation always agree.

Experience Edge publish payloads send unhyphenated item IDs (`6CA225DB4DE84048BCC161B13027B63A`). Cached pages already tag content with hyphenated lowercase GUIDs (`sc:item:6ca225db-4de8-4048-bcc1-61b13027b63a:...`). Because Next.js / loader cache tags are compared as exact strings, those invalidation tags missed and published updates could stay stale.
