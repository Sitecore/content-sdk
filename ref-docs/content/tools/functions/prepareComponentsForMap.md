[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / prepareComponentsForMap

# Function: prepareComponentsForMap()

> **prepareComponentsForMap**(`components`, `opts`): [`ComponentMapEntry`](../type-aliases/ComponentMapEntry.md)[]

Defined in: [content/src/tools/templating/utils.ts:42](https://github.com/Sitecore/content-sdk/blob/3b9edfe853f8f321e9bd2dff8cfbdda2c3d66627/packages/content/src/tools/templating/utils.ts#L42)

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

[`ComponentMapEntry`](../type-aliases/ComponentMapEntry.md)[]

The transformed component description entries.
