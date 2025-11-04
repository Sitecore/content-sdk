[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / generateMap

# Variable: generateMap

> `const` **generateMap**: `GenerateMapFunction`

Defined in: [nextjs/src/tools/generate-map.ts:291](https://github.com/Sitecore/content-sdk/blob/3b1b6ea0a30c0e87321117e7d5fb40b7ab02cba7/packages/nextjs/src/tools/generate-map.ts#L291)

Generate and write componentMap.ts files based on provided params.

When clientComponentMap is true, generates:
- component-map.ts          : Full component map with all components (server, client, universal)
- component-map.client.ts   : Client-safe map with only client + universal components

When clientComponentMap is false, generates:
- component-map.ts          : Single component map (traditional behavior)

When includeVariants is true (in either mode):
- Includes component **variants** in the generated map(s) alongside base components
- Preserves the same client/server filtering rules (variants obey clientComponentMap filtering)
- Variant entries are emitted using the same naming/keys convention as their base components

Template Customization:
- mapTemplate: Custom template for main component map (works for both single and dual map modes)
- clientMapTemplate: Custom template for client component map (only used when clientComponentMap is true)

## Param

params for generateMap
