---
name: content-sdk-field-usage-image-link-text
description: Renders Sitecore fields with the structural directives scText, scRichText, scImage, scLink, scRouterLink.
---

# Field usage (Text, Image, Link) (Angular)

**Detail:** [AGENTS-angular-specifics.md#field-directives](../../docs/AGENTS-angular-specifics.md#field-directives)

## When

- Rendering Sitecore fields in an Angular template
- User mentions Text, RichText, Image, or Link

## Rules

- Use the **structural directives** on a host element: `<h1 *scText="fields().Title"></h1>`, `*scRichText`, `*scImage` (on `<img>`), `*scLink` / `*scRouterLink` (on `<a>`)
- There are no `<sc-text>`-style element components — do not invent them
- Never interpolate `field.value` directly; the directives emit the editing metadata markers Pages needs
- Validate the field exists before rendering
- `scTextEncode="false"` and `*scRichText` assign `innerHTML` — use them only for CMS-authored content
- `*scLink` / `*scRouterLink` are locale-aware; do not prepend the locale manually

## Stop

- Stop if bypassing the SDK directives for user-controlled HTML without sanitization
- Stop if a change would remove editing metadata markers from an editable field

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
