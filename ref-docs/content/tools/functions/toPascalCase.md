[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / toPascalCase

# Function: toPascalCase()

> **toPascalCase**(`name`): `string`

Defined in: [content/src/tools/templating/component-builder.ts:96](https://github.com/Sitecore/content-sdk/blob/08d0014b541d19ec57e8f671e786634f43eef2e8/packages/content/src/tools/templating/component-builder.ts#L96)

**`Internal`**

Converts string to PascalCase.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | kebab-case, dot.notation, camelCase, or PascalCase string (e.g. `my-component`, `my_component`, `my.component`, `myComponent`) |

## Returns

`string`

PascalCase string (e.g. `MyComponent`)
