---
'@sitecore-content-sdk/nextjs': patch
'create-content-sdk-app': patch
---

Add `redirects.localeInPath` so App Router redirect locale handling works when LocaleProxy is removed (`x-sc-locale` is optional). `true`/`false` control path prefixes; default `null` keeps the `x-sc-locale` header fallback (non-breaking). App Router templates set `true`.