---
'@sitecore-content-sdk/content': patch
---

Send the Sitecore Context ID for Forms in the `x-sitecore-contextid` header instead of the query string, and use the public/client context ID for stylesheet `<link>` URLs so the server context ID is not rendered in page markup.
