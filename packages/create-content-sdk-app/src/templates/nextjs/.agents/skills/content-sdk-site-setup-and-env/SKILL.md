---
name: content-sdk-site-setup-and-env
description: sitecore.config.ts and env vars; document in .env.example only.
---

# Site setup and env (Pages Router)

**Detail:** [AGENTS-key-concepts.md#component-map-editing-env](../../docs/AGENTS-key-concepts.md#component-map-editing-env)

## When

- Configuring site, API, or env vars
- Adding new environment variable

## Rules

- All secrets via env vars in `sitecore.config.ts`
- Document in `.env.example` only; never commit `.env` / `.env.local`

## Stop

- Stop if asked to commit secrets or hardcode API keys

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
