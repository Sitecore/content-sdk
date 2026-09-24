# Sitecore Content SDK Angular Sample Application

[SitecoreAI Content SDK Documentation](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/sitecore-content-sdk-for-angular.html)

## Dynamic Content Tokens

Authors can place `{{key}}` or `{{key|fallback}}` in Sitecore layout string fields. On normal (non-preview) renders this starter always activates token processing with a map or `{}`. Balanced `{{...}}` sequences are reserved; encode or split a brace if you need a literal.

Token collection runs only through existing page or component Personalize executions (`variantIds` must be non-empty). A result without a valid selected `variantId` does not contribute tokens. Standalone token-only flows are out of scope.

- An unclosed `{{` is left as authored text.
- In HTML text, Personalize values are escaped. Inside tags, attributes, script, or style they are treated as missing (fallback or removal).
- Markup-free fields reject Personalize values that contain `<`.
- Changed `href` / `src` / `url` / `srcSet` / `srcset` fields are URL-validated; unsafe values become empty.

Page, 404, and 500 loaders cache raw `deferFinalization: true` results. `finalizePageLoader` runs request-locally and bypasses Preview / Design Library so authored placeholders stay intact. Visitor-facing error pages finalize with `{}` because error layouts are published items, not preview content.

**Security:** `x-sitecore-params` is a **request** header that may contain visitor PII in `tokens`. Do not log it. Personalize middleware strips inbound client `tokens` and writes only a trusted map. A custom host that skips that middleware must strip `tokens` from `scParams` / `x-sitecore-params` before `getPersonalizeTokens`.

Redact `x-sc-personalize-tokens` and `x-sitecore-params` in CDN and platform request logs. Those headers can contain visitor PII.
