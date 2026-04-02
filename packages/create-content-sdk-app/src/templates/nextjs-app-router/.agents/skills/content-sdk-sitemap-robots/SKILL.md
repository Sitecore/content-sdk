---
name: content-sdk-sitemap-robots
description: Sitemap and robots for App Router: src/app/api/sitemap/route.ts and src/app/api/robots/route.ts with createSitemapRouteHandler and createRobotsRouteHandler. Rewrites in next.config.ts. Use when configuring sitemap, robots.txt, or SEO.
---

# Sitemap & robots (App Router)

**Detail:** [AGENTS-router-specifics.md](../../docs/AGENTS-router-specifics.md#api-route-handlers).

## When

- `sitemap.xml`, `robots.txt`, or SEO routing changes.

## Rules

- Use `createSitemapRouteHandler` / `createRobotsRouteHandler` with shared client + `sites` from `.sitecore/sites.json`.
- Keep `next.config.ts` rewrites and `locale: false` rules aligned with public URLs; set `dynamic` appropriately.

## Stop

- Do not hardcode site lists if `sites.json` is the source of truth.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
