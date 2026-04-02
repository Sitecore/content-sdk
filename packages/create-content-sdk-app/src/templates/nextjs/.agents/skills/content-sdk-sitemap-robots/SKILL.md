---
name: content-sdk-sitemap-robots
description: Sitemap and robots.txt for Pages Router: src/pages/api/sitemap.ts and src/pages/api/robots.ts with SitemapMiddleware(scClient, sites).getHandler() and RobotsMiddleware(scClient, sites).getHandler(). Rewrites in next.config.js. Use when configuring sitemap, robots.txt, or SEO.
---

# Sitemap & robots (Pages Router)

**Detail:** [AGENTS-router-specifics.md](../../docs/AGENTS-router-specifics.md#api-routes).

## When

- `sitemap.xml`, `robots.txt`, or SEO routing changes.

## Rules

- Use `SitemapMiddleware` / `RobotsMiddleware` handlers with the shared client and `sites` from `.sitecore/sites.json`.
- Keep `next.config.js` rewrites for `/sitemap*.xml` and `/robots.txt` in sync with API routes.

## Stop

- Do not hardcode site lists if `sites.json` is the source of truth.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
