---
'@sitecore-content-sdk/nextjs': patch
---

Fix RedirectsProxy crash on App Router when LocaleProxy is disabled by skipping `NextURL.locale` unless Pages Router i18n is configured.
