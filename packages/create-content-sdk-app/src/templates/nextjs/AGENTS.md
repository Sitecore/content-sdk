# AGENTS.md — AI Guidance for Sitecore Content SDK Next.js (Pages Router) App

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

**Environment:** Copy `.env.example` to `.env.local` and set Sitecore API endpoint, key, default site, and language. Never commit `.env` or `.env.local`.

**Component map:** `.sitecore/component-map.ts` is auto-generated from `src/components/` during `npm run dev` (watch) and `npm run build`. No manual action needed unless the generator cannot handle a case.

**Atoms:** Catalog/registry in `src/atoms/index.tsx`; wired via `atomsConfig` on `SitecoreProvider` (not the component map). Run `npm run sitecore-tools:atoms:update` after intentional schema changes; `atoms:validate` runs on `dev`/`build`. Skills: `content-sdk-atoms-setup`, `content-sdk-atoms-create`, `content-sdk-atoms-maintain`.

---

## Application Structure (Pages Router)

```
src/
  pages/             # Next.js Pages Router
    [[...path]].tsx  # Catch-all Sitecore page (SSG or SSR)
    _app.tsx
    404.tsx, 500.tsx, _error.tsx
    api/             # API routes (sitemap, robots, editing, healthz)
  atoms/             # Atoms catalog + registry (defineAtomsCatalog / defineAtomsRegistry)
  components/        # React components (Sitecore + app-specific)
  lib/               # sitecore-client, component-props
  Layout.tsx, Providers.tsx, Bootstrap.tsx, Scripts.tsx
proxy.ts             # Edge middleware (preview, bot-tracking, multisite, redirects, personalize)
.sitecore/           # component-map.ts, import-map.ts, atoms.lock.json, sites.json, metadata.json
sitecore.config.ts   # Sitecore config (api, defaultSite, defaultLanguage, multisite, etc.)
next.config.js       # i18n (locales, defaultLocale), rewrites, images
```

---

## Best practices

- **Quick checks:** If path or locale is wrong, ensure you use `extractPath(context)` and `context.locale` (from getStaticProps/getServerSideProps); do not assume path or locale from elsewhere. Keep the proxy chain order (PreviewProxy → BotTrackingProxy → Multisite → Redirects → Personalize).
- **Security:** Use only environment variables in `sitecore.config.ts`; never hardcode API keys, editing secret, or host URLs. Do not expose secrets in client-side code or in logs. Validate and sanitize user input at boundaries.
- **Performance:** Keep middleware lightweight; use the proxy `skip` callback and `matcher` so middleware does not run on `/api`, `_next`, static files, or health checks. Use `revalidate` in getStaticProps for ISR where appropriate. Prefer server-side data fetching for Sitecore content.
- **Sitecore patterns:** Use SDK field components (`<Text>`, `<RichText>`, `<Image>`) and validate field existence before render. Regenerate `.sitecore/component-map.ts` with `npm run sitecore-tools:generate-map` or `npm run sitecore-tools:generate-map:watch`; edit the map manually only when the generator cannot handle the change. Keep the single Sitecore client instance in `lib/sitecore-client.ts` and pass it (or use it) in API routes and getStaticProps/getServerSideProps. Define atoms in `src/atoms/` via `defineAtomsCatalog` / `defineAtomsRegistry` and `atomsConfig` — do not register atoms in the component map.
- **Consistency:** Follow the existing patterns in `[[...path]].tsx`, `_app.tsx`, and API routes. When adding API routes, add the corresponding rewrite in `next.config.js` and keep the middleware matcher in sync.

---

## DO & DON'T (app-level)

| DO | DON'T |
|----|-------|
| Use `extractPath(context)` and `context.locale` for page data | Assume path or locale from elsewhere |
| Use `client.getPage`, `getDictionary`, `getComponentData` per existing patterns | Fetch in client components when SSR/SSG is intended |
| Keep `proxy.ts` / middleware matcher in sync with excluded paths | Add heavy logic to middleware without `skip` for `/api`, `_next`, etc. |
| Use `.sitecore/sites.json` for multisite list in API routes and middleware | Hardcode site list or commit `.env` |
| Follow existing SSG/SSR and preview patterns in `[[...path]].tsx` | Change getStaticPaths/getStaticProps contract without updating callers |
| Use Sitecore field components (`<Text>`, `<RichText>`, `<Image>`) and validate fields | Expose API keys or editing secret in client code |
| Document required env vars in `.env.example` only | Commit `.env` or `.env.local` |
| Run `npm run build` after changes to verify the app builds | Add npm dependencies without explicit user approval |
| Define atoms in `src/atoms/` and pass via `atomsConfig`; run `atoms:update` after schema changes | Register atoms in the component map or hand-edit `atoms.lock.json` hashes |

---

## Guardrails for agentic AI

- **Preserve behavior:** Do not change the contract of `getStaticPaths` / `getStaticProps` (or getServerSideProps), the proxy chain order (PreviewProxy → BotTrackingProxy → MultisiteProxy → …), or the shape of page props/layout without updating all consumers. Preserve SSG/SSR and preview behavior.
- **Do not expand scope:** Limit edits to the app (pages, components, API routes, config). Do not modify SDK packages or monorepo tooling unless explicitly asked. Do not change CI, lockfiles, or root config.
- **Follow existing patterns:** When adding pages, API routes, or components, mirror the existing structure and naming. Use the same Sitecore client, component map, and env-based config. Do not introduce new patterns (e.g. a second client or a different way to resolve site/locale) without clear need.
- **Verify and stay safe:** After edits, the app should build with `npm run build`. Do not commit secrets or `.env`; only document variables in `.env.example`. Do not add npm dependencies without explicit approval. When in doubt, prefer the existing implementation and ask for clarification.
- **If the user asks for something that conflicts with these guardrails** (e.g. changing proxy order, committing `.env`, or skipping the component map), explain the constraint and suggest a safe alternative rather than complying.

---

## References

- **Skills.md** — Capability index; [.agents/skills/](.agents/skills/) — load **one** skill per task ([Agent Skills](https://agentskills.io)).
- **CLAUDE.md** — How to layer AI context for this template.
- **.cursor/rules/** — Editor rules (applied by glob / always-apply).
- [Sitecore Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html) — Official docs.
- [Next.js Pages Router](https://nextjs.org/docs/pages) — Data fetching, API routes, i18n.

**For head applications / empty starters:** If you use this template for your head application (e.g. empty starter), keep this AGENTS.md as that head application's guide. Do not replace it with the Content SDK monorepo root AGENTS.md — that file describes the SDK source tree, not the head application. Adjust only what is specific to your project (e.g. custom layout or workflow). See the Content SDK README "AI Development Support" section for more on which AGENTS.md to use.

---

**Remember:** When in doubt, follow existing patterns in this app; open `.agents/docs/`, `.cursor/rules/`, or a single skill when you need extra constraints beyond this file.
