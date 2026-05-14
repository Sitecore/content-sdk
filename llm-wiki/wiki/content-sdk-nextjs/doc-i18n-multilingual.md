# Multilingual / i18n (Next.js)

Official references:

- [Supporting multilingual applications in Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/20/supporting-multilingual-applications-in-content-sdk.html) — `llm-wiki/raw/2026-05-14-supporting-multilingual-applications.md`
- [Internationalization using next-intl](https://doc.sitecore.com/sai/en/developers/content-sdk/20/internationalization-using-next-intl.html) — **`App Router` + `next-intl`** — `llm-wiki/raw/2026-05-14-internationalization-using-next-intl.md`

This wiki page contrasts **App Router (doc)** with **Pages Router (template code)** in this repo.

---

## App Router template (official — `next-intl`)

The SAI doc describes the **Next.js App Router** starter:

- **`src/i18n/routing.ts`** — `defineRouting({ locales, defaultLocale, localePrefix })`; **`defaultLocale`** typically tied to **`sitecore.config`** `defaultLanguage`.
- **`src/i18n/request.ts`** — per-request locale + **Sitecore dictionary** for server components.
- Route shape **`[site]/[locale]/[[...path]]`**, **`localeMiddleware`** first in **`middleware.ts`**, **`generateStaticParams`** for SSG site×locale.
- Components: **`getTranslations` / `getLocale`** (async server), **`useTranslations` / `useLocale`** (server/client), **`NextIntlClientProvider`** for client subtree.

Details and examples: see the **raw snapshot** above; product examples may contain typos (“Dafault”) — treat code in **`packages/create-content-sdk-app/src/templates/nextjs-app-router/`** as source of truth for App Router.

---

## Pages Router template — code path (no `next-intl`)

**Template:** `packages/create-content-sdk-app/src/templates/nextjs/`.

### 1. Next.js `i18n` config (`next.config.js`)

Next’s **built-in i18n routing** (not `next-intl`):

```16:23:packages/create-content-sdk-app/src/templates/nextjs/next.config.js
  i18n: {
    // These are all the locales you want to support in your application.
    // These should generally match (or at least be a subset of) those in Sitecore.
    locales: ['en'],
    // This is the locale that will be used when visiting a non-locale
    // prefixed path e.g. `/about`.
    defaultLocale: process.env.DEFAULT_LANGUAGE || process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  },
```

- Extend **`locales`** to match Sitecore languages you publish.
- **`defaultLocale`** reads **`DEFAULT_LANGUAGE`** or **`NEXT_PUBLIC_DEFAULT_LANGUAGE`**, else **`en`** — keep aligned with **`sitecore.config.ts`** **`defaultLanguage`** / **`defineConfig`**.

### 2. Data fetching: locale on `SitecoreClient` (`[[...path]].tsx`)

Catch-all **`getStaticProps` / `getServerSideProps`**:

- **`extractPath(context)`** (`@sitecore-content-sdk/nextjs/utils`) returns the **Sitecore item path** from **`context.params.path`** only — it does **not** parse locale out of the path; locale comes from **`context.locale`** provided by Next when i18n is enabled.

```57:63:packages/nextjs/src/utils/utils.ts
export const extractPath = (context: GetStaticPropsContext | GetServerSidePropsContext) => {
  return context.params === undefined
    ? '/'
    : Array.isArray(context.params.path)
    ? context.params.path.join('/')
    : context.params.path ?? '/';
};
```

- **`getPage(path, { locale: context.locale })`** — layout GraphQL uses the active locale.
- **`getDictionary({ site: page.siteName, locale: page.locale })`** — dictionary phrases for that site/language pair after the page resolves.

```86:104:packages/create-content-sdk-app/src/templates/nextjs/src/pages/[[...path]].tsx
  const path = extractPath(context);
  let page;
  // ...
      : await client.getPage(path, { locale: context.locale });
  // ...
      dictionary: await client.getDictionary({
        site: page.siteName,
        locale: page.locale,
      }),
```

- **SSG `getStaticPaths`**: passes **`context?.locales || []`** into **`client.getPagePaths`** so static paths can be generated per Next locale when configured.

### 3. Client dictionary provider (`_app.tsx`)

**`next-localization`** wraps the tree with **`I18nProvider`** (rosetta-backed), not `next-intl`:

```13:24:packages/create-content-sdk-app/src/templates/nextjs/src/pages/_app.tsx
      <I18nProvider
        lngDict={dictionary}
        locale={pageProps.page?.locale || scConfig.defaultLanguage}
      >
        <Component {...rest} />
      </I18nProvider>
```

- **`dictionary`** comes from **`getStaticProps` / `getServerSideProps`** props (Sitecore dictionary service).
- **`locale`** falls back to **`scConfig.defaultLanguage`** if the page object has no locale.

### 4. Error pages

**`404.tsx` / `500.tsx`** use **`context.locale`**, **`context.defaultLocale`**, then **`scConfig.defaultLanguage`** for `getPage` / dictionary — same alignment pattern as the catch-all.

### 5. Sitecore config / redirects

- **`defaultLanguage`** / **`defaultSite`** in **`sitecore.config.ts`** should match how Next resolves locale and how **`getDictionary`** is called.
- **`redirects.locales`** in Sitecore config should stay consistent with **`next.config.js`** **`locales`** for redirect middleware (see [doc-sitecore-config.md](doc-sitecore-config.md)).

---

## Sitecore side (both templates)

- Layout GraphQL respects **language**.
- Dictionary is fetched via **`SitecoreClient.getDictionary`** (GraphQL-backed in **`@sitecore-content-sdk/content`**).

---

## Env files

See [doc-example-environment-variable-files.md](doc-example-environment-variable-files.md) — **`NEXT_PUBLIC_DEFAULT_LANGUAGE`** is documented in **`.env.*.example`**.

---

## Related

- [doc-route-handling-data-fetching.md](doc-route-handling-data-fetching.md)
- [doc-sitecore-config.md](doc-sitecore-config.md)
- Skill (template): `packages/create-content-sdk-app/src/templates/nextjs/.agents/skills/content-sdk-dictionary-and-i18n/SKILL.md`
