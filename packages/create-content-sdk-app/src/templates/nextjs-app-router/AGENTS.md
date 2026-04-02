# AGENTS.md — AI Guidance for Sitecore Content SDK Next.js (App Router) App

> **Context:** This file is the **compact** guide (commands, repo layout, best practices, guardrails, references). Deeper topics live under [.agents/docs/](.agents/docs/) — start with [README](.agents/docs/README.md) or open the layer you need: [AGENTS-overview.md](.agents/docs/AGENTS-overview.md), [AGENTS-key-concepts.md](.agents/docs/AGENTS-key-concepts.md), [AGENTS-router-specifics.md](.agents/docs/AGENTS-router-specifics.md), [AGENTS-workflows-and-boundaries.md](.agents/docs/AGENTS-workflows-and-boundaries.md). Use [Skills.md](Skills.md) to pick **one** [.agents/skills/](.agents/skills/) skill when needed; [CLAUDE.md](CLAUDE.md) explains layered reading. Cursor applies [.cursor/rules/](.cursor/rules/) by glob — you do not need every rule in chat context at once.

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

**Environment:** Copy `.env.example` to `.env.local` and set Sitecore API endpoint, key, default site, and language. Never commit `.env` or `.env.local`.

---

## Application Structure (App Router)

```
src/
  app/                           # Next.js App Router
    layout.tsx                    # Root layout
    [site]/                       # Site segment (multisite)
      layout.tsx                  # Site layout (Bootstrap, draftMode)
      [locale]/                   # Locale segment (i18n)
        [[...path]]/
          page.tsx                # Sitecore page
          not-found.tsx           # 404 with Sitecore error page
    not-found.tsx                 # Root not-found
    api/                          # Route handlers
      sitemap/route.ts, robots/route.ts, editing/config/route.ts, editing/render/route.ts
  components/                    # React components (Sitecore + app-specific)
  lib/                           # sitecore-client, component-props
  i18n/                          # next-intl
    routing.ts                    # locales, defaultLocale, localePrefix
    request.ts                    # getRequestConfig, getDictionary per site
  Layout.tsx, Providers.tsx, Bootstrap.tsx, Scripts.tsx
proxy.ts                         # Edge middleware (locale, multisite, redirects, personalize)
.sitecore/                       # component-map.ts, component-map.client.ts, import-map.*, sites.json, metadata.json
sitecore.config.ts               # Sitecore config (api, defaultSite, defaultLanguage, multisite, etc.)
next.config.ts                   # next-intl plugin, rewrites, images
```

---

## Best practices

- **Quick checks:** If locale or dictionary is wrong, ensure `setRequestLocale(\`${site}_${locale}\`)` is called at the top of the page and `src/i18n/request.ts` parses `requestLocale` and calls `client.getDictionary`. If not-found doesn't show Sitecore content, use `parseRewriteHeader(headers())` for site/locale. Always `await params` (Next.js 15+).
- **Security:** Use only environment variables in `sitecore.config.ts`; never hardcode API keys, editing secret, or host URLs. Do not expose secrets in client-side code or in logs. Validate and sanitize user input at boundaries.
- **Performance:** Keep middleware lightweight; use the proxy `matcher` so it does not run on API routes, `_next`, sitemap, robots, or static assets. Use Server Components for data fetching; add `'use client'` only where interactivity is needed. Use `generateStaticParams` and caching as in the existing page.
- **Sitecore patterns:** Use SDK field components (`<Text>`, `<RichText>`, `<Image>`) and validate field existence before render. Register new components in `.sitecore/component-map.ts` and `.sitecore/component-map.client.ts` as appropriate. Use the single Sitecore client in `lib/sitecore-client.ts` for all data fetching.
- **Consistency:** Follow the existing patterns in `[site]/[locale]/[[...path]]/page.tsx`, layout hierarchy, `i18n/request.ts` (site_locale), and API route handlers. When adding routes or rewrites, keep the middleware matcher and next-intl config in sync.

---

## DO & DON'T (app-level)

| DO | DON'T |
|----|-------|
| Use `params` as Promise and `await params` in pages and layouts | Use `params` synchronously (Next.js 15+) |
| Pass `{ site, locale }` to `client.getPage` and `getDictionary` | Assume site/locale from headers inside page without using params |
| Run LocaleProxy before AppRouterMultisiteProxy in middleware | Change proxy order (locale must run first for i18n) |
| Call `setRequestLocale(\`${site}_${locale}\`)` in the page for next-intl | Omit setRequestLocale when adding new page branches |
| Use Server Components for async data fetching | Put async data fetching in client components when SSR is intended |
| Use `parseRewriteHeader(headers())` in not-found for site/locale | Hardcode site/locale in not-found or error pages |
| Use createXRouteHandler and `.sitecore/sites.json` for sitemap/robots | Hardcode site list or commit `.env` |
| Use Sitecore field components and validate fields | Expose API keys or editing secret in client code |
| Document required env vars in `.env.example` only | Commit `.env` or `.env.local` |
| Run `npm run build` after changes to verify the app builds | Add npm dependencies without explicit user approval |

---

## Guardrails for agentic AI

- **Preserve behavior:** Do not change the proxy order (LocaleProxy → AppRouterMultisiteProxy → …), the `[site]/[locale]/[[...path]]` route shape, or the way `setRequestLocale` and `i18n/request.ts` use `{site}_{locale}`. Preserve draftMode handling in layout and page.
- **Do not expand scope:** Limit edits to the app (app router, components, API routes, i18n, config). Do not modify SDK packages or monorepo tooling unless explicitly asked. Do not change CI, lockfiles, or root config.
- **Follow existing patterns:** When adding routes, layouts, or components, mirror the existing structure. Use the same Sitecore client, component maps, and env-based config. Do not introduce a different way to resolve site/locale or a second client without clear need.
- **Verify and stay safe:** After edits, the app should build with `npm run build`. Do not commit secrets or `.env`; only document variables in `.env.example`. Do not add npm dependencies without explicit approval. When in doubt, prefer the existing implementation and ask for clarification.
- **If the user asks for something that conflicts with these guardrails** (e.g. changing proxy order, committing `.env`, or skipping the component map), explain the constraint and suggest a safe alternative rather than complying.

---

## References

- **Skills.md** — Capability index; [.agents/skills/](.agents/skills/) — load **one** skill per task ([Agent Skills](https://agentskills.io)).
- **CLAUDE.md** — How to layer AI context for this template.
- **.cursor/rules/** — Editor rules (applied by glob / always-apply).
- [Sitecore Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html) — Official docs.
- [Next.js App Router](https://nextjs.org/docs/app) — Routing, Server Components, data fetching.
- [next-intl](https://next-intl.dev/docs) — i18n routing and request config.

**For head applications / empty starters:** If you use this template for your head application (e.g. empty App Router starter), keep this AGENTS.md as that head application's guide. Do not replace it with the Content SDK monorepo root AGENTS.md — that file describes the SDK source tree, not the head application. Adjust only what is specific to your project (e.g. custom layout or workflow). See the Content SDK README "AI Development Support" section for more on which AGENTS.md to use.

---

**Remember:** When in doubt, follow existing patterns in this app; open `.cursor/rules/` or a single skill when you need extra constraints beyond this file.
