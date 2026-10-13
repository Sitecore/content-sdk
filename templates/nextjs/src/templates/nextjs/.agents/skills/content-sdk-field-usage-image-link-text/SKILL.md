---
name: content-sdk-field-usage-image-link-text
description: Renders Sitecore fields with SDK components Text, RichText, Image, Link.
---

# Field usage (Text, Image, Link) (Pages Router)

**Detail:** [AGENTS-router-specifics.md#component-map-and-layout](../../docs/AGENTS-router-specifics.md#component-map-and-layout)

## When

- Rendering Sitecore fields
- User mentions Text, RichText, Image, or Link

## Rules

- Use `<Text>`, `<RichText>`, `<Image>`, `<Link>` from the SDK
- Validate field existence before render

## Stop

- Stop if bypassing SDK field components for user-controlled HTML without sanitization

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
