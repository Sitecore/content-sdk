---
name: content-sdk-field-usage-image-link-text
description: Renders Sitecore fields using SDK field components (Text, RichText, Image, Link) with proper validation and fallbacks. Use when rendering content fields or when the user mentions Text, RichText, Image, Link, or field components.
---

# Field components (Pages Router)

**Detail:** [AGENTS-router-specifics.md](../../docs/AGENTS-router-specifics.md#component-map-and-layout).

**Read code first:** an existing field-driven component under `src/components/`.

## When

- Rendering titles, rich text, images, links from Sitecore fields.

## Rules

- Prefer `<Text>`, `<RichText>`, `<Image>`, `<Link>` with `field={fields?.…}`; optional chaining for optional fields.
- Do not hardcode media URLs when data comes from Sitecore field types that the SDK resolves.

## Stop

- If field names/types are unknown, confirm against layout/data before guessing.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
