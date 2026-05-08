[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / generateMap

# Variable: generateMap

> `const` **generateMap**: `GenerateMapFunction`

Defined in: [nextjs/src/tools/generate-map.ts:337](https://github.com/Sitecore/content-sdk/blob/d9d50e1e9cf196032766ca4287d4c24576cabbd6/packages/nextjs/src/tools/generate-map.ts#L337)

Generate and write componentMap.ts files based on provided params.

Pages Router:
- component-map.ts          : Single component map with Pages Router wrappers

App Router (clientComponentMap=true):
- component-map.ts          : Full component map with all components (server, client, universal)
- component-map.client.ts   : Client-safe map with client + universal components

App Router (clientComponentMap=false or undefined):
- component-map.ts          : Full component map with all components (server, client, universal)
- component-map.client.ts   : Client-safe map with built-in components only (no user components)

When includeVariants is true:
- Includes component **variants** in the generated map(s) alongside base components
- Preserves the same client/server filtering rules (variants obey clientComponentMap filtering)
- Variant entries are emitted using the same naming/keys convention as their base components

Template Customization:
- mapTemplate: Custom template for main component map (works for both single and dual map modes)
- clientMapTemplate: Custom template for client component map (App Router only)

## Param

The parameters for the generateMap function.
