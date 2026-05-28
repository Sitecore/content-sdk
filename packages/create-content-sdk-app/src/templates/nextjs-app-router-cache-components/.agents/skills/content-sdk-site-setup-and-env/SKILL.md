---
name: content-sdk-site-setup-and-env
description: Configures site and environment: sitecore.config.ts, environment variables, default site/language, SITECORE_REVALIDATE_SECRET. Use when configuring the app or adding env vars. Document in .env.example only; never commit .env or .env.local.
---

# Content SDK Site Setup and Environment (App Router + Cache Components)

Central config in sitecore.config.ts; all secrets and environment-specific values via env vars. `SITECORE_REVALIDATE_SECRET` is optional for `POST /api/revalidate` (see `.env.*.example`). Keep the SDK in-process dictionary cache disabled so `revalidateTag` works for dictionary updates.

## When to Use

- User asks to configure site, default language, API host, or environment.
- Task involves sitecore.config.ts, .env, or defaultSite/defaultLanguage.
- User mentions "config," "environment variables," "API key," "default site," or "revalidate secret."

## How to perform

- Edit `sitecore.config.ts` with `defineConfig`; read all secrets and env-specific values from `process.env.*`. Add or change vars in `.env.example` (or `.env.remote.example` / `.env.container.example`) with placeholders; never commit `.env` or `.env.local`. Keep `dictionary: { caching: { enabled: false } }` so dictionary updates flow through Cache Components only.

## Hard Rules

- Use `sitecore.config.ts` with `defineConfig` from the SDK. Expose api (edge, local), defaultSite, defaultLanguage, editingSecret, multisite, redirects, personalize as needed.
- All sensitive or environment-specific values must come from environment variables (e.g. `process.env.SITECORE_API_KEY`, `process.env.SITECORE_REVALIDATE_SECRET`). Never hardcode API keys, secrets, or production URLs in source.
- **Document in `.env.*.example`:** `SITECORE_EDGE_CONTEXT_ID`, `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID`, `SITECORE_API_KEY` / `SITECORE_API_HOST` (local), `NEXT_PUBLIC_DEFAULT_SITE_NAME`, `NEXT_PUBLIC_DEFAULT_LANGUAGE`, `SITECORE_EDITING_SECRET`, `SITECORE_REVALIDATE_SECRET` (optional; empty = no `x-revalidate-secret` header).
- **Dictionary cache must stay disabled** in `sitecore.config.ts`: `dictionary: { caching: { enabled: false } }`. The cache helper in `src/lib/cache/get-sitecore-dictionary.ts` is the only dictionary cache layer; if you re-enable the SDK cache, `revalidateTag` will not invalidate dictionary data.
- Document every new or changed env var in `.env.example` (or `.env.remote.example` / `.env.container.example`). Use placeholder or empty value and a short comment; never put real secrets in example files.
- Never commit `.env` or `.env.local`; they are gitignored. Example files are the source of truth for which vars exist.

## Stop Conditions

- Stop if the user wants to commit real secrets or production values; insist on env vars and .env.example only.
- Stop if adding a new env var would require CI or deployment changes without explicit instruction; document the var and note that deployment must set it.
- Stop if the user wants to re-enable the SDK in-process dictionary cache; explain that it breaks tag-based dictionary invalidation.
- Do not edit .next/, node_modules/, or lockfiles unless the task explicitly requires it.

## References

- [AGENTS.md](../../../AGENTS.md) for boundaries and env rules.
- [Official Content SDK docs](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
