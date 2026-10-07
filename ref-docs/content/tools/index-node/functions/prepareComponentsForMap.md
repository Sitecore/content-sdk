[**@sitecore-content-sdk/content**](../../../README.md)

***

[@sitecore-content-sdk/content](../../../README.md) / [tools/index-node](../README.md) / prepareComponentsForMap

# Function: prepareComponentsForMap()

> **prepareComponentsForMap**(`components`, `opts`): [`ComponentMapEntry`](../../type-aliases/ComponentMapEntry.md)[]

Defined in: [content/src/tools/templating/utils.ts:42](https://github.com/Sitecore/content-sdk/blob/16c65a296cb6c3751cf2bd6cd678c6ae93f8c499/packages/content/src/tools/templating/utils.ts#L42)

**`Internal`**

Transform component description entries for the component map.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `components` | `ComponentSource`[] | The components to transform. |
| `opts` | \{ `includeVariants`: `boolean`; `shouldAnnotateClient?`: `boolean`; \} | The options for the transformation. |
| `opts.includeVariants` | `boolean` | Whether to include variants in the component map. |
| `opts.shouldAnnotateClient?` | `boolean` | Whether to annotate the client in the component map. Used in frameworks that make server/client distinction. |

## Returns

[`ComponentMapEntry`](../../type-aliases/ComponentMapEntry.md)[]

The transformed component description entries.
