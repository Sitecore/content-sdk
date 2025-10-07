[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / generateMap

# Variable: generateMap

> `const` **generateMap**: `GenerateMapFunction`

Defined in: [nextjs/src/tools/generate-map.ts:30](https://github.com/Sitecore/content-sdk/blob/093286832218b748faec930972f4c68c302518b2/packages/nextjs/src/tools/generate-map.ts#L30)

Generate and write componentMap.ts file based on provided params.

When clientComponentMap is true, generates:
- component-map.ts: Full component map with all components (server, client, universal)
- component-map.client.ts: Client-safe map with only client + universal components

When clientComponentMap is false, generates:
- component-map.ts: Single component map (traditional behavior)

Template Customization:
- mapTemplate: Custom template for main component map (works for both single and dual map modes)
- clientMapTemplate: Custom template for client component map (only used when clientComponentMap is true)

## Param

params for generateMap
