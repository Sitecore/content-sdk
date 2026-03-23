---
name: content-sdk-route-configuration
description: Configures routing and layout for App Router. Single catch-all at src/app/[site]/[locale]/[[...path]]/page.tsx; call setRequestLocale at top of page. Use when changing routing, placeholders, or Layout.
---

# Routing (App Router)

**Detail:** [AGENTS.md](../../../AGENTS.md) — `[site]`/`[locale]`/`[[...path]]`, layouts, not-found.

## When

- Changing catch-all segment, layouts, placeholders, or route params handling.

## Rules

- **Only** `src/app/[site]/[locale]/[[...path]]/page.tsx` is the Sitecore content entry. `await params`; call `setRequestLocale` with `` `${site}_${locale}` `` at the top of the page.
- Layout chain: `app/layout.tsx` → `app/[site]/layout.tsx` → page; avoid root-layout Sitecore fetches.
- Proxy order stays: LocaleProxy → AppRouterMultisiteProxy → Redirects → Personalize.

## Stop

- If the user wants a second Sitecore entry route, explain the single-entry constraint.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
