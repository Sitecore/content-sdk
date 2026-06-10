---
'@sitecore-content-sdk/content': patch
---

Fix imageParams breaking preview context images. Preview authentication parameters (ttc, tt, hash) were being stripped when imageParams were applied, causing images to fail loading. These parameters are now preserved in the required params list.
