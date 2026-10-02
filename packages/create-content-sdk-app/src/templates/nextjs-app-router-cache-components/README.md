# Sitecore Content SDK — Next.js App Router + Cache Components

This starter matches the default **nextjs-app-router** template, with **Next.js Cache Components** (`cacheComponents`), **`getSitecorePage`**, **`getSitecoreDictionary`**, and **`getSitecoreErrorPage`** (Not found / Server Error) helpers that apply Sitecore cache tags for tag-based on-demand revalidation, plus a single **`POST /api/revalidate`** route that accepts explicit cache tags or Sitecore webhook-style payloads.

Use the **`nextjs-app-router`** template if you do not need Cache Components or tag revalidation wiring.

[SitecoreAI Content SDK Documentation](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html)

## Dynamic Content Tokens

Authors can place `{{key}}` or `{{key|fallback}}` in Sitecore layout string fields. On normal (non-preview) renders this starter always activates token processing with a map or `{}`. Balanced `{{...}}` sequences are reserved; encode or split a brace if you need a literal.

Token collection runs only through existing page or component Personalize executions (`variantIds` must be non-empty). A result without a valid selected `variantId` does not contribute tokens. Standalone token-only flows are out of scope.

- An unclosed `{{` is left as authored text.
- In HTML text, Personalize values are escaped. Inside tags, attributes, script, or style they are treated as missing (fallback or removal).
- Markup-free fields reject Personalize values that contain `<`.
- Changed `href` / `src` / `url` / `srcSet` / `srcset` fields are URL-validated; unsafe values become empty.

`'use cache'` stores only `deferFinalization: true` pages. `loadSitecoreRoutePage` finalizes request-locally via React `cache()` so visitor tokens never key the persistent cache. Preview / Design Library omit tokens.

Visitor-facing error pages always pass `tokens: {}`. Error layouts are published items, not preview content.

**Security:** `x-sc-personalize-tokens` is a **request** header that may contain visitor PII. Do not log it. `PersonalizeProxy` strips inbound client values and writes only a trusted map. A custom host that omits `PersonalizeProxy` must delete that header before `readPersonalizeTokens`, or clients can spoof visitor values.

Redact `x-sc-personalize-tokens` and `x-sitecore-params` in CDN and platform request logs. Those headers can contain visitor PII.
