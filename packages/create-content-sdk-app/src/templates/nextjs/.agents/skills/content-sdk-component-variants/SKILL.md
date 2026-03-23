---
name: content-sdk-component-variants
description: Implements component variants: different renderings or data-driven variants of the same component type. Pages Router: register in .sitecore/component-map.ts; getComponentData resolves props. Use when one component has multiple presentations.
---

# Component variants (Pages Router)

**Detail:** [AGENTS.md](../../../AGENTS.md) — Component map; `getComponentData`.

## When

- Multiple presentations of one component type (variant field, style param, etc.).

## Rules

- Prefer one component + variant props from layout over many map entries unless the app already uses separate keys.
- Variants must still flow through `getComponentData` and valid map registrations.

## Stop

- If layout does not expose variant data, fix content model/layout before hacking URLs or globals.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
