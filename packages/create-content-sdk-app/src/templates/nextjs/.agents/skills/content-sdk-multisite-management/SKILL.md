---
name: content-sdk-multisite-management
description: Handles multisite: site resolution, .sitecore/sites.json, and proxy in src/proxy.ts. Pages Router proxy order is fixed: MultisiteProxy → RedirectsProxy → PersonalizeProxy. Use when working with multiple sites or hostnames.
---

# Multisite / proxy (Pages Router)

**Detail:** [AGENTS.md](../../../AGENTS.md) — Middleware, MultisiteProxy chain, `sites.json`.

## When

- Multiple sites, hostnames, `sites.json`, or `src/proxy.ts` / matcher.

## Rules

- Sites list: `.sitecore/sites.json` (usually generated); avoid manual edits unless you know the format.
- Middleware must live in `middleware.ts` re-exporting `proxy.ts` if that is how the template ships.
- **Order:** MultisiteProxy → RedirectsProxy → PersonalizeProxy (do not reorder). Skip `/api`, `/_next`, static assets.

## Stop

- Do not add a parallel site-resolution mechanism.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
