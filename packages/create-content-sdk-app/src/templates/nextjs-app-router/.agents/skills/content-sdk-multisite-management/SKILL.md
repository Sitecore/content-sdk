---
name: content-sdk-multisite-management
description: Handles multisite: .sitecore/sites.json and proxy in src/proxy.ts. App Router proxy order is fixed: LocaleProxy → AppRouterMultisiteProxy → RedirectsProxy → PersonalizeProxy. Use when working with multiple sites or hostnames.
---

# Multisite / proxy (App Router)

**Detail:** [AGENTS.md](../../../AGENTS.md) — Middleware chain, `sites.json`.

## When

- Multiple sites, hostnames, `sites.json`, or `src/proxy.ts` / matcher.

## Rules

- Sites list: `.sitecore/sites.json` (usually generated); avoid manual edits unless you know the format.
- Ensure `middleware.ts` re-exports `proxy.ts` if that is how the template ships.
- **Order:** LocaleProxy → AppRouterMultisiteProxy → RedirectsProxy → PersonalizeProxy (do not reorder). Skip API, `_next`, sitemap/robots/static.

## Stop

- Do not add a parallel site-resolution mechanism.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
