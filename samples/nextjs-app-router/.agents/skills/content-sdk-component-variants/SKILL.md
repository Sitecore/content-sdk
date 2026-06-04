---
name: content-sdk-component-variants
description: Implements component variants: different renderings or data-driven variants of the same component type. App Router: register in component-map.ts or component-map.client.ts as appropriate. Use when one component has multiple presentations.
---

# Content SDK Component Variants (App Router)

One component definition can have multiple presentations or data-driven variants. Keep registration and layout aligned. This app does not use getComponentData; layout/placeholder data comes from getPage.

## When to Use

- User asks for different "variants," "versions," or "presentations" of a component.
- Task involves rendering the same component type with different layouts or props based on data (e.g. variant field or style).
- User mentions "component variants," "variations," or "multiple renderings."

## How to perform

- Prefer one component that accepts variant/style via props and branches internally; or multiple map entries if the app pattern uses one key per variant. Use layout/fields/params for variant; register in the correct component map (Server or Client). Align with existing app convention.

## Hard Rules

- Prefer a single component registration that accepts variant/style data (e.g. params or fields) and branches internally, over multiple map entries for the same logical component unless the app pattern uses separate registrations per variant.
- Use props (fields, params) from layout to decide variant; do not rely on global state or URL for variant selection when data comes from Sitecore.
- Register in `.sitecore/component-map.ts` (Server) or `.sitecore/component-map.client.ts` (Client) as appropriate. If the app uses one key per variant, register each; if one key with variant param, single registration. Follow existing app convention.
- Keep component maps in sync with src/components/.

## Stop Conditions

- Stop if the variant model (one registration vs many) is unclear; ask or follow the app's existing pattern.
- Do not add new component map entries without ensuring layout and editing can provide the corresponding data.
- Do not assume variant field names (e.g. "variant," "style") without checking the layout definition.

## References

- [AGENTS.md](../../../AGENTS.md) and content-sdk-component-registration for maps.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
