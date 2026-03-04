---
name: content-sdk-sitemap-robots
description: Sitemap and robots.txt for App Router: src/app/api/sitemap/route.ts and src/app/api/robots/route.ts with createSitemapRouteHandler and createRobotsRouteHandler. Rewrites in next.config.ts. Use when configuring sitemap, robots.txt, or SEO.
---

# Content SDK Sitemap and Robots (App Router)

Sitemap and robots.txt are served via **route handlers** and rewrites. Use the SDK route handler helpers and sites from .sitecore/sites.json.

## When to Use

- User asks to add or change sitemap or robots.txt.
- Task involves SEO, sitemap.xml, or robots route.
- User mentions "sitemap," "robots," "SEO," or "rewrites."

## How to perform

- Sitemap: `src/app/api/sitemap/route.ts` with `createSitemapRouteHandler({ client, sites })`; robots: `src/app/api/robots/route.ts` with `createRobotsRouteHandler({ client, sites })`. Use sites from `.sitecore/sites.json`. Add rewrites in `next.config.ts` for `/sitemap*.xml` and `/robots.txt` with `locale: false`. Set `dynamic = 'force-dynamic'` if needed.

## Hard Rules

- **Sitemap:** `src/app/api/sitemap/route.ts` — use `createSitemapRouteHandler({ client, sites })`. Export `{ GET }`. Use `sites` from `.sitecore/sites.json`. Set `export const dynamic = 'force-dynamic'` if the handler relies on request.
- **Robots:** `src/app/api/robots/route.ts` — use `createRobotsRouteHandler({ client, sites })`. Same pattern.
- **Rewrites:** In `next.config.ts`, add rewrites for `/sitemap*.xml` and `/robots.txt` to these route handlers. Use `locale: false` so they are not localized.
- Use the same SitecoreClient instance as the rest of the app; do not create a dedicated client for sitemap/robots.
- Avoid hardcoding the site list; use .sitecore/sites.json.

## Stop Conditions

- Stop if the user wants to serve sitemap/robots from a different origin or with different auth; document and suggest proxy or edge config.
- Do not add new env vars for sitemap/robots without documenting them in .env.example.
- Do not change rewrite paths without updating docs and any references.

## References

- [AGENTS.md](../../../AGENTS.md) for API routes and rewrites.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
