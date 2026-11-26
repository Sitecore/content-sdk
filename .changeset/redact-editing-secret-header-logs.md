---
'@sitecore-content-sdk/core': patch
'@sitecore-content-sdk/nextjs': patch
---

Stop writing the editing secret to debug logs through request headers. The value of that header is now replaced with `[redacted]` in debug output only, the header is still sent with the request. `NativeDataFetcher` also no longer logs the raw `Headers` object for the request in place of the redacted copy.
