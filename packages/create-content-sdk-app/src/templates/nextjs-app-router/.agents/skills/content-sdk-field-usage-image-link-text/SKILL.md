---
name: content-sdk-field-usage-image-link-text
description: Renders Sitecore fields using SDK field components (Text, RichText, Image, Link) with proper validation and fallbacks. Use when rendering content fields or when the user mentions Text, RichText, Image, Link, or field components.
---

# Field components (App Router)

**Detail:** [AGENTS-router-specifics.md](../../docs/AGENTS-router-specifics.md#server-vs-client-components).

## When

- Rendering titles, rich text, images, links from Sitecore fields.

## Rules

- Prefer `<Text>`, `<RichText>`, `<Image>`, `<Link>` with guarded `fields?.…`.
- Do not hardcode media URLs when Sitecore fields should drive resolution.

## Stop

- If field names/types are unknown, confirm against layout/data before guessing.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
