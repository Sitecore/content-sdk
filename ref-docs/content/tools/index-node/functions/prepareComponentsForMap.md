[**@sitecore-content-sdk/content**](../../../README.md)

***

[@sitecore-content-sdk/content](../../../README.md) / [tools/index-node](../README.md) / prepareComponentsForMap

# Function: prepareComponentsForMap()

> **prepareComponentsForMap**(`components`, `opts`): [`ComponentMapEntry`](../../type-aliases/ComponentMapEntry.md)[]

Defined in: [content/src/tools/templating/utils.ts:42](https://github.com/Sitecore/content-sdk/blob/ee7d15fb7ff51ecf52f6c48a5dd927ab6855f385/packages/content/src/tools/templating/utils.ts#L42)

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
