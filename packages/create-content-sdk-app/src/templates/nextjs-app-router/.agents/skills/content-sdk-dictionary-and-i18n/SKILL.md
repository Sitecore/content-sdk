---
name: content-sdk-dictionary-and-i18n
description: Dictionary and i18n: next-intl with src/i18n/routing.ts and src/i18n/request.ts. Request locale is ${site}_${locale}; call setRequestLocale in the page; in request.ts parse and load dictionary with client.getDictionary({ locale, site }). Use when changing translations or locale behavior.
---

# Dictionary & i18n (App Router)

**Detail:** [AGENTS-router-specifics.md](../../docs/AGENTS-router-specifics.md#i18n-next-intl), [AGENTS-key-concepts.md](../../docs/AGENTS-key-concepts.md#how-locale-works).

## When

- Dictionary messages, locales, or `src/i18n/request.ts` / `routing.ts`.

## Rules

- Keep `${site}_${locale}` consistent: set in page via `setRequestLocale`; parse in `request.ts` and load `getDictionary({ site, locale })`.
- Align `routing.ts` locales with Sitecore languages / `sitecore.config.ts`.

## Stop

- Do not change the `${site}_${locale}` convention without updating `request.ts` and all callers.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
