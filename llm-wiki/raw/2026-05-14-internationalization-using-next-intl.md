---
title: Internationalization using next-intl
source_url: https://doc.sitecore.com/sai/en/developers/content-sdk/20/internationalization-using-next-intl.html
doc_version: "2.x"
ingested: "2026-05-14"
fetch_status: ok
---

# Internationalization using next-intl (snapshot)

**Scope (official):** Next.js **App Router** template — **`next-intl`** for locale routing, server/client translation patterns, and **dictionary phrases from Sitecore** namespaced by **`siteName`**.

## Prerequisites

Configure **languages in SitecoreAI** before app-level i18n ([working with languages](https://doc.sitecore.com/xmc/en/developers/xm-cloud/working-with-languages.html) — XMC path; same platform family as SAI).

## Configuration files (App Router)

| File | Role |
|------|------|
| **`src/i18n/routing.ts`** | `defineRouting`: supported **locales**, **defaultLocale** (often `sitecoreConfig.defaultLanguage`), **localePrefix** (e.g. `"as-needed"`). |
| **`src/i18n/request.ts`** | `defineRequestConfig`: per-request **locale** + **dictionary** from Sitecore for server components. |

## Routing (App Router + multisite + SSG)

- Catch-all: **`[site]/[locale]/[[...path]]`**.
- **`localeMiddleware`** first in **`src/middleware.ts`**, then other middlewares.
- **`generateStaticParams`** enumerates **site × locale** for SSG.

## Components (official)

- **Async server:** `getTranslations` / `getLocale` from **`next-intl/server`**; namespace `page.siteName`.
- **Sync server:** `useTranslations(page.siteName)`.
- **Client:** `NextIntlClientProvider` on catch-all page; `useTranslations()` / `useLocale()`.

See **next-intl** docs for server vs client environments.

## Pages Router (this repo)

The **Pages Router** template does **not** use **`next-intl`**. It uses **Next.js built-in `i18n`**, **`next-localization`** (`I18nProvider` + rosetta), and **`context.locale`** in data fetching — see wiki **`doc-i18n-multilingual.md`** (code-first section).

Full page: `source_url`.
