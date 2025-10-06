[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / generateMap

# Variable: generateMap

> `const` **generateMap**: `GenerateMapFunction`

Defined in: [nextjs/src/tools/generate-map.ts:31](https://github.com/Sitecore/content-sdk/blob/5a81f0e52c97aaf1b5f508144fd8acaadf432054/packages/nextjs/src/tools/generate-map.ts#L31)

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
