[**@sitecore-content-sdk/content**](../../../README.md)

***

[@sitecore-content-sdk/content](../../../README.md) / [tools/index-node](../README.md) / buildComponentMapContent

# Function: buildComponentMapContent()

> **buildComponentMapContent**(`entries`, `componentImports`, `options`): `string`

Defined in: [content/src/tools/templating/utils.ts:140](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/tools/templating/utils.ts#L140)

**`Internal`**

Cross framework function to build the component map content.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `entries` | [`ComponentMapEntry`](../../type-aliases/ComponentMapEntry.md)[] | The entries to build the component map content for. |
| `componentImports` | [`ComponentImport`](../../interfaces/ComponentImport.md)[] \| `undefined` | The component imports to build the component map content for. |
| `options` | `TemplateOptions` | The options for the buildComponentMapContent function. |

## Returns

`string`

The component map content.
