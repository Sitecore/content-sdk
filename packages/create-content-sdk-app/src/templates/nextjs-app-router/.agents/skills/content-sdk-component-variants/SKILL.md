---
name: content-sdk-component-variants
description: Component variants: different renderings or data-driven variants. App Router: register in the correct server/client component map. Use when one component has multiple presentations.
---

# Component variants (App Router)

**Detail:** [AGENTS.md](../../../AGENTS.md) — Component maps; layout-driven props.

## When

- Multiple presentations of one component type (variant field, style param, etc.).

## Rules

- Prefer one component + variant props from layout over many map entries unless the app already uses separate keys.
- Register variants in server map, client map, or both per component type and editing needs.

## Stop

- If layout does not expose variant data, fix content model/layout before hacking URLs or globals.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
