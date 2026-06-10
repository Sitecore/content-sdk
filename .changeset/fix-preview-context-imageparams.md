---
'@sitecore-content-sdk/content': patch
---

Fix imageParams breaking preview context image URLs. When using imageParams (e.g., mw, mh) with NextImage component, images in preview context would fail to load because authentication parameters (ttc, tt, hash) were being stripped from the URL. These parameters are required for Sitecore's preview endpoint to validate requests. The fix adds ttc, tt, and hash to the required params list in getRequiredParams(), ensuring they are preserved alongside imageParams.
