---
'@sitecore-content-sdk/content': patch
'@sitecore-content-sdk/nextjs': patch
'create-content-sdk-app': patch
---

RedirectsProxy no longer depends on LocaleProxy's `x-sc-locale` header for App Router locale shaping. Add `redirects.localeInPath` (`true` | `false` | `null`) and set `localeInPath: true` in App Router templates.