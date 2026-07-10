---
'@sitecore-content-sdk/analytics-core': patch
'@sitecore-content-sdk/core': patch
'@sitecore-content-sdk/events': patch
---

Fix Identity event `dob` validation to accept `YYYY-MM-DD` and normalize legacy `YYYY-MM-DDThh:mm` values before sending to the API.
