[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / toPascalCase

# Function: toPascalCase()

> **toPascalCase**(`name`): `string`

Defined in: [content/src/tools/templating/component-builder.ts:96](https://github.com/Sitecore/content-sdk/blob/a61659d31d52d41a1b13c8b63d46053c1b52cda1/packages/content/src/tools/templating/component-builder.ts#L96)

**`Internal`**

Converts string to PascalCase.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | kebab-case, dot.notation, camelCase, or PascalCase string (e.g. `my-component`, `my_component`, `my.component`, `myComponent`) |

## Returns

`string`

PascalCase string (e.g. `MyComponent`)
