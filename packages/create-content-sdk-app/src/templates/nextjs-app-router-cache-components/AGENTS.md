# AGENTS.md — AI Guidance for Sitecore Content SDK Next.js (App Router + Cache Components) App

> **Context:** This file is the **compact** guide (commands, structure, best practices, guardrails, references). Deeper topics live under [.agents/docs/](.agents/docs/) — start with [README](.agents/docs/README.md) or open the layer you need. Use [Skills.md](Skills.md) to pick **one** [.agents/skills/](.agents/skills/) skill when needed; [CLAUDE.md](CLAUDE.md) explains layered reading. Cursor applies [.cursor/rules/](.cursor/rules/) by glob — you do not need every rule in chat context at once.

---

## Quick Commands

```bash
npm install
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

**Environment:** Copy `.env.example` to `.env.local` and set Sitecore API endpoint, key, default site, language, and `SITECORE_REVALIDATE_SECRET` (used by `POST /api/revalidate`). Never commit `.env` or `.env.local`.

---

## Application Structure (App Router + Cache Components)

```
src/
  app/                           # Next.js App Router
    layout.tsx                    # Root layout
    not-found.tsx                 # Root 404 (uses getSitecoreErrorPage with scConfig defaults)
    global-error.tsx              # Root 500 (uses client.getErrorPage; Client Component)
    [site]/                       # Site segment (multisite)
      layout.tsx                  # Site layout (Bootstrap, draftMode)
      [locale]/                   # Locale segment (i18n)
        [[...path]]/
          layout.tsx              # Segment layout: setCachedPageParams({ site, locale }) (SSG-safe)
          page.tsx                # Sitecore page (uses getSitecorePage)
          not-found.tsx           # Segment 404: getCachedPageParams() + getSitecoreErrorPage
    api/                          # Route handlers
      sitemap/route.ts, robots/route.ts
      editing/config/route.ts, editing/render/route.ts
      revalidate/route.ts         # POST /api/revalidate (OSR)
  components/                    # React components (Sitecore + app-specific)
  lib/
    sitecore-client.ts            # Single SitecoreClient instance
    cache/                        # Tag-aware data helpers (this template)
      get-sitecore-page.ts        # `use cache` + sc:route/sc:item tags
      get-sitecore-dictionary.ts  # `use cache` + sc:dict tag
      get-sitecore-error-page.ts  # `use cache` + tags for 404 / 500 content
  i18n/                          # next-intl
    routing.ts                    # locales, defaultLocale, localePrefix
    request.ts                    # getRequestConfig, getSitecoreDictionary per site
  Layout.tsx, Providers.tsx, Bootstrap.tsx, Scripts.tsx
proxy.ts                         # Edge middleware (preview, bot-tracking, locale, multisite, redirects, personalize)
.sitecore/                       # component-map.ts, component-map.client.ts, import-map.*, sites.json, metadata.json
sitecore.config.ts               # Sitecore config (api, defaultSite, defaultLanguage, dictionary cache off)
next.config.ts                   # cacheComponents: true, next-intl plugin, rewrites, images
```

---

## Best practices

- **Quick checks:** If locale or dictionary is wrong, ensure `setRequestLocale(\`${site}_${locale}\`)` is called at the top of the page and `src/i18n/request.ts` parses `requestLocale` and calls `getSitecoreDictionary`. If a content change does not appear, verify the webhook posted to `POST /api/revalidate` with the right secret and check the tag families (`sc:route`, `sc:item`, `sc:dict`) returned by the cache helpers.
- **Security:** Use only environment variables in `sitecore.config.ts`; never hardcode API keys, editing secret, or `SITECORE_REVALIDATE_SECRET`. Do not expose secrets in client-side code or logs. Validate and sanitize user input at boundaries.
- **Performance:** Keep middleware lightweight; use the proxy `matcher` so it does not run on `/api/*`, `_next`, sitemap, robots, or static assets. Use Server Components for data fetching and the cache helpers under `'use cache'` so cached payloads carry the right tags. Use `generateStaticParams` and caching as in the existing page.
- **Sitecore patterns:** Use SDK field components (`<Text>`, `<RichText>`, `<Image>`) and validate field existence before render. Regenerate the component maps with `npm run sitecore-tools:generate-map` or `npm run sitecore-tools:generate-map:watch`; edit the maps manually only when the generator cannot handle the change. Use the cache helpers in `src/lib/cache/` for all non-preview Sitecore reads so tags stay consistent across the app.
- **Consistency:** Follow the existing patterns in `[site]/[locale]/[[...path]]/page.tsx`, `not-found.tsx`, `i18n/request.ts` (site_locale + `getSitecoreDictionary`), and API route handlers. When adding routes or rewrites, keep the middleware matcher and next-intl config in sync.

---

## DO & DON'T (app-level)

| DO | DON'T |
|----|-------|
| Use `params` as Promise and `await params` in pages and layouts | Use `params` synchronously (Next.js 15+) |
| Use the cache helpers in `src/lib/cache/` for non-preview reads | Call `client.getPage` / `client.getDictionary` directly in pages or i18n |
| Use `client.getPreview` / `client.getDesignLibraryData` for preview (uncached) | Wrap preview/draft data in `'use cache'` |
| Run PreviewProxy → BotTrackingProxy → LocaleProxy → … in middleware | Change proxy order (locale must run before multisite for App Router) |
| Call `setRequestLocale(\`${site}_${locale}\`)` in the page for next-intl | Omit setRequestLocale when adding new page branches |
| Document `SITECORE_REVALIDATE_SECRET` in `.env.*.example` only | Hardcode the revalidate secret or expose it client-side |
| Keep `sitecore.config.ts` dictionary cache disabled | Re-enable the SDK in-process dictionary cache (bypasses `revalidateTag`) |
| Use Server Components for async data fetching | Put async data fetching in client components when SSR is intended |
| Set site/locale via `setCachedPageParams` in segment layout **and** in the page before `notFound()`; read with `getCachedPageParams()` in segment `not-found.tsx` | Call `headers()` in not-found (opts out of SSG) or hardcode site/locale |
| Use `BUILD_VALIDATION_SITE` (`_DEFAULT_`) when `generateStaticPaths` is false (Cache Components); skip Edge for that site in page/metadata/not-found | `return []` from `generateStaticParams`, or use `sites[0]` / `'default'` as build fallback |
| Use createXRouteHandler and `.sitecore/sites.json` for sitemap/robots | Hardcode site list or commit `.env` |
| Use Sitecore field components and validate fields | Expose API keys or editing secret in client code |
| Document required env vars in `.env.example` only | Commit `.env` or `.env.local` |
| Run `npm run build` after changes to verify the app builds | Add npm dependencies without explicit user approval |

---

## Guardrails for agentic AI

- **Preserve behavior:** Do not change the proxy order (PreviewProxy → BotTrackingProxy → LocaleProxy → AppRouterMultisiteProxy → …), the `[site]/[locale]/[[...path]]` route shape, the `{site}_{locale}` next-intl convention, the cache-helper boundary (cache helpers wrap non-preview Sitecore reads; preview/editing use `client.*` directly), the `BUILD_VALIDATION_SITE` build-validation flow, or the `setCachedPageParams` → `getCachedPageParams` flow between the segment layout, page, and segment `not-found.tsx` (this is what keeps the 404 SSG-safe). Preserve `draftMode` handling in layout and page.
- **Do not expand scope:** Limit edits to the app (app router, components, API routes, cache helpers, i18n, config). Do not modify SDK packages or monorepo tooling unless explicitly asked. Do not change CI, lockfiles, or root config.
- **Follow existing patterns:** When adding routes, layouts, or components, mirror the existing structure. Use the same Sitecore client, cache helpers, component maps, and env-based config. Do not introduce a different way to resolve site/locale, a second client, or a parallel cache layer.
- **Verify and stay safe:** After edits, the app should build with `npm run build`. Do not commit secrets or `.env`; only document variables in `.env.example`. Do not add npm dependencies without explicit approval. When in doubt, prefer the existing implementation and ask for clarification.
- **If the user asks for something that conflicts with these guardrails** (e.g. changing proxy order, committing `.env`, re-enabling the SDK dictionary cache, or skipping the component map), explain the constraint and suggest a safe alternative rather than complying.

---

## References

- **Skills.md** — Capability index; [.agents/skills/](.agents/skills/) — load **one** skill per task ([Agent Skills](https://agentskills.io)).
- **CLAUDE.md** — How to layer AI context for this template.
- **.cursor/rules/** — Editor rules (applied by glob / always-apply).
- [Sitecore Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html) — Official docs.
- [Next.js App Router](https://nextjs.org/docs/app) — Routing, Server Components, data fetching.
- [Next.js Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) — `use cache`, `cacheTag`, `revalidateTag`.
- [next-intl](https://next-intl.dev/docs) — i18n routing and request config.

**For head applications / empty starters:** If you use this template for your head application (e.g. App Router + Cache Components starter), keep this AGENTS.md as that head application's guide. Do not replace it with the Content SDK monorepo root AGENTS.md — that file describes the SDK source tree, not the head application. Adjust only what is specific to your project (e.g. custom layout or workflow). See the Content SDK README "AI Development Support" section for more on which AGENTS.md to use.

---

**Remember:** When in doubt, follow existing patterns in this app; open `.agents/docs/`, `.cursor/rules/`, or a single skill when you need extra constraints beyond this file.
