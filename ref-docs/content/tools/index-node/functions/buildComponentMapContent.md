[**@sitecore-content-sdk/content**](../../../README.md)

***

[@sitecore-content-sdk/content](../../../README.md) / [tools/index-node](../README.md) / buildComponentMapContent

# Function: buildComponentMapContent()

> **buildComponentMapContent**(`entries`, `componentImports`, `options`): `string`

Defined in: [content/src/tools/templating/utils.ts:140](https://github.com/Sitecore/content-sdk/blob/a61659d31d52d41a1b13c8b63d46053c1b52cda1/packages/content/src/tools/templating/utils.ts#L140)

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
