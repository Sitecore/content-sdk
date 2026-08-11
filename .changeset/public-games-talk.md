---
'@sitecore-content-sdk/content': patch
---

sitecore-tools:build sites generation fails with an exception when the last command utilizes fetch (Windows only). This happens because there are some hanging connections in keep-alive pool that undici leaves, that don't close before sitecore-tools:build calls process.exit()
