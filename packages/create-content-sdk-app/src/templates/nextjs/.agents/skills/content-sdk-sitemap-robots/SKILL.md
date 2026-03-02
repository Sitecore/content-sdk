---
name: content-sdk-sitemap-robots
description: Sitemap and robots.txt for Pages Router: src/pages/api/sitemap.ts and src/pages/api/robots.ts with SitemapMiddleware(scClient, sites).getHandler() and RobotsMiddleware(scClient, sites).getHandler(). Rewrites in next.config.js. Use when configuring sitemap, robots.txt, or SEO.
---

# Content SDK Sitemap and Robots (Pages Router)

Sitemap and robots.txt are served via **API routes** and rewrites. Use the SDK middleware getHandler pattern and sites from .sitecore/sites.json.

## When to Use

- User asks to add or change sitemap or robots.txt.
- Task involves SEO, sitemap.xml, or robots route.
- User mentions "sitemap," "robots," "SEO," or "rewrites."

## How to perform

- Sitemap: `src/pages/api/sitemap.ts` with `SitemapMiddleware(scClient, sites).getHandler()`; robots: `src/pages/api/robots.ts` with `RobotsMiddleware(scClient, sites).getHandler()`. Use sites from `.sitecore/sites.json`. Add rewrites in next.config.js for /sitemap*.xml and /robots.txt to these API routes.

## Hard Rules

- **Sitemap:** `src/pages/api/sitemap.ts` — use `new SitemapMiddleware(scClient, sites).getHandler()`. Export the handler. Use `sites` from `.sitecore/sites.json`.
- **Robots:** `src/pages/api/robots.ts` — use `new RobotsMiddleware(scClient, sites).getHandler()`. Same pattern.
- **Rewrites:** In `next.config.js`, add rewrites for `/robots.txt` and `/sitemap*.xml` to the corresponding API routes (e.g. `/sitemap.xml` → `/api/sitemap`).
- Use the same SitecoreClient instance (e.g. from `src/lib/sitecore-client.ts`) as the rest of the app; do not create a dedicated client for sitemap/robots.
- Avoid hardcoding the site list; use .sitecore/sites.json.

## Stop Conditions

- Stop if the user wants to serve sitemap/robots from a different origin or with different auth; document and suggest proxy or edge config.
- Do not add new env vars for sitemap/robots without documenting them in .env.example.
- Do not change rewrite paths without updating docs and any references.

## References

- [AGENTS.md](../../../AGENTS.md) for API routes and rewrites.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
