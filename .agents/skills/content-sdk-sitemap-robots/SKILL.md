---
name: content-sdk-sitemap-robots
description: Configures sitemap and robots.txt: route handlers, rewrites, and SEO. Use when configuring sitemap, robots.txt, or SEO behavior.
---

# Content SDK Sitemap and Robots

Sitemap and robots.txt are served via API route handlers and rewrites; use SDK middleware and sites from .sitecore/sites.json.

## When to Use

- User asks to add or change sitemap or robots.txt.
- Task involves SEO, sitemap.xml, or robots route.
- User mentions "sitemap," "robots," "SEO," or "rewrites."

## Hard Rules

- **App Router:** Use route handlers (e.g. src/app/api/sitemap/route.ts, src/app/api/robots/route.ts) with SDK middleware (e.g. SitemapMiddleware, RobotsMiddleware). Pass the Sitecore client and sites (from .sitecore/sites.json or config). Wire rewrites in next.config so /sitemap.xml and /robots.txt hit these routes.
- **Pages Router:** Use src/pages/api/sitemap.ts and src/pages/api/robots.ts with SitemapMiddleware(scClient, sites).getHandler() and RobotsMiddleware(scClient, sites).getHandler(). Configure next.config.js rewrites for /sitemap*.xml and /robots.txt to the API routes.
- Use the same SitecoreClient instance as the rest of the app; do not create a dedicated client for sitemap/robots.
- Sites list for sitemap typically comes from .sitecore/sites.json; avoid hardcoding site list.

## Stop Conditions

- Stop if the user wants to serve sitemap/robots from a different origin or with different auth; document and suggest proxy or edge config.
- Do not add new env vars for sitemap/robots without documenting them in .env.example.
- Do not change rewrite paths (e.g. /sitemap.xml) without updating docs and any references.

## References

- Template AGENTS.md for API routes and rewrites.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
