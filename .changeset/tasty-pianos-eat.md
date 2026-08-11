---
'@sitecore-content-sdk/nextjs': patch
---

[App router] Locale always attached on redirect when `isLanguagePreserved` is true, request URL does not have locale prefix and redirect does not change locale. Adds new behavior controlled by `appLocalePrefix` setting values passed into redirect proxy:
- `always`: prefix every locale, including the site default.
- `as-needed`: prefix only non-default locales; the site default stays bare. This holds even for `isLanguagePreserved` rules.
- `never`: never include locale prefix
- unset: behave as `as-needed`, EXCEPT that `isLanguagePreserved` from redirect map's checkbox would always ensure locale prefix, when set (Sitecore logic takes precedence).
  
