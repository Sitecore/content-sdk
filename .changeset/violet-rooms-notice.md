---
'@sitecore-content-sdk/angular': patch
'@sitecore-content-sdk/nextjs': patch
---

`sc:item` tags now always use hyphenated lowercase GUIDs (`sc:item:<hyphenated-id>:<locale>:latest`), so cache writes and webhook revalidation always agree.

Experience Edge publish payloads send unhyphenated item IDs (`xxxxxxxxx`). Cached pages already tag content with hyphenated lowercase GUIDs (`sc:item:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:...`). Because Next.js / loader cache tags are compared as exact strings, those invalidation tags missed and published updates could stay stale.
