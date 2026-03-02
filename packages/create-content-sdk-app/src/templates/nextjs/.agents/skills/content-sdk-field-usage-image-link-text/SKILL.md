---
name: content-sdk-field-usage-image-link-text
description: Renders Sitecore fields using SDK field components (Text, RichText, Image, Link) with proper validation and fallbacks. Use when rendering content fields or when the user mentions Text, RichText, Image, Link, or field components.
---

# Content SDK Field Usage (Pages Router)

Use SDK field components to render Sitecore fields with proper validation and fallbacks.

## When to Use

- User asks how to render a title, body, image, or link from Sitecore.
- Task involves displaying content fields, fixing empty/broken images or links, or using RichText/Text/Image/Link components.
- User mentions "field," "Image," "Link," "Text," "RichText," or "field value."

## How to perform

- Use SDK field components: `<Text field={fields?.title} />`, `<RichText field={fields?.content} />`, `<Image field={fields?.image} />`, `<Link field={fields?.link} />`. Guard with `fields?.` when optional; use tag prop on Text when needed. Do not hardcode media or link URLs from Sitecore.

## Hard Rules

- Prefer SDK field components over manual field value extraction: `<Text field={fields?.title} />`, `<RichText field={fields?.content} />`, `<Image field={fields?.image} />`, `<Link field={fields?.link} />`. Use tag prop for Text when needed (e.g. tag="h1").
- Validate or guard field existence before rendering when fields can be optional (e.g. `fields?.title`). Handle null/undefined and empty fields gracefully.
- Do not hardcode image or link URLs when the data comes from Sitecore; use the field components or helpers that resolve media/URLs.
- Follow the app's import pattern (e.g. from lib or components).

## Stop Conditions

- Stop if the field structure (name or type) is unknown; suggest checking the layout/data shape or asking the user.
- Do not assume field names (e.g. "title") without confirmation when the template might use different names.
- Do not commit or log raw field values that might contain PII or secrets.

## References

- [AGENTS.md](../../../AGENTS.md) for component and Sitecore patterns.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
