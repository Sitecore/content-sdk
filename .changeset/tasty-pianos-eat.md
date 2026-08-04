---
'@sitecore-content-sdk/nextjs': patch
---

[App router] Locale always attached on redirect when `isLanguagePreserved` is true, request URL does not have locale prefix and redirect does not change locale. Adds new behavior controlled by `appLocalePrefix` setting passed into redirect proxy:
- When `appLocalePrefix` is undefined, proxy will act based on the `isLanguagePreserved` setting from a Redirect Map - locale prefix will be added on redirect when setting is `true`
- When `appLocalePrefix` is explicitly set, [next-intl behavior](https://next-intl.dev/docs/routing/configuration#localeprefix) takes preference, regardless of the `isLanguagePreserved` setting.
