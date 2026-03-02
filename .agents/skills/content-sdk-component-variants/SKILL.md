---
name: content-sdk-component-variants
description: Implements component variants: different renderings or data-driven variants of the same component type. Use when a single component has multiple presentations or variants.
---

# Content SDK Component Variants

One component definition can have multiple presentations or data-driven variants; keep registration and layout aligned.

## When to Use

- User asks for different "variants," "versions," or "presentations" of a component.
- Task involves rendering the same component type with different layouts or props based on data (e.g. variant field or style).
- User mentions "component variants," "variations," or "multiple renderings."

## Hard Rules

- Prefer a single component registration that accepts variant/style data (e.g. params or fields) and branches internally, over multiple component-map entries for the same logical component unless the app pattern uses separate registrations per variant.
- Use props (fields, params) from layout to decide variant; do not rely on global state or URL for variant selection when data comes from Sitecore.
- Keep component map in sync: if the app uses one key per variant, register each; if one key with variant param, single registration. Follow existing app convention.
- In monorepo: variants in templates or packages must still build and work with getComponentData/getPreview; in head apps, follow the app's variant pattern.

## Stop Conditions

- Stop if the variant model (one registration vs many) is unclear; ask or follow the app's existing pattern.
- Do not add new component map entries without ensuring layout and editing can provide the corresponding data.
- Do not assume variant field names (e.g. "variant," "style") without checking the layout definition.

## References

- [AGENTS.md](../../../AGENTS.md) and content-sdk-component-registration for map and registration.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
