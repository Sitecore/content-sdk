---
'@sitecore-content-sdk/nextjs': patch
'create-content-sdk-app': patch
---

Add root-level `appLocalePrefix` config so App Router redirect locale handling works when LocaleProxy is removed (`x-sc-locale` is optional). It controls whether App Router redirect targets carry a locale path prefix (`/[locale]/...`) depending on the value:
- `always`: prefix every locale, including the site default.
- `as-needed`: prefix only non-default locales; the site default stays bare. This holds even for `isLanguagePreserved` rules.
- `never`: never include locale prefix
- unset: behave as `as-needed`, EXCEPT that `isLanguagePreserved` from redirect map's checkbox would always ensure locale prefix, when set (Sitecore logic takes precedence).