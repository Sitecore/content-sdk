---
name: content-sdk-site-setup-and-env
description: Configures site and environment: sitecore.config.ts, environment variables, default site and language. Use when configuring the app or adding env vars. Document in .env.example only; never commit .env or .env.local.
---

# Config & env (App Router)

**Detail:** [AGENTS.md](../../../AGENTS.md) — Sitecore client and config; Boundaries.

## When

- `sitecore.config.ts`, API endpoints, default site/language, or new env vars.

## Rules

- `defineConfig` + `process.env` only for secrets and hosts; never hardcode production keys.
- Document every var in `.env.example` (or template `*.example`); never commit `.env` / `.env.local`.

## Stop

- Refuse to commit real secrets; flag if deployment/CI must change to accept new vars.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
