---
'@sitecore-content-sdk/nextjs': patch
'create-content-sdk-app': patch
---

Add root-level `appLocalePrefix` config so App Router redirect locale handling works when LocaleProxy is removed (`x-sc-locale` is optional). Mirrors next-intl's `localePrefix` strategy: `always`/`never` control path prefixes explicitly; unset (default) behaves as `as-needed` and keeps the `x-sc-locale` header fallback (non-breaking). App Router templates set `as-needed` so the default locale stays bare on redirect targets (matching their `routing.ts`), while non-default locales are still prefixed.