[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / toPascalCase

# Function: toPascalCase()

> **toPascalCase**(`name`): `string`

Defined in: [content/src/tools/templating/components.ts:116](https://github.com/Sitecore/content-sdk/blob/a8a17de670f6378fa21e08a9c76841c041afb7fd/packages/content/src/tools/templating/components.ts#L116)

**`Internal`**

Converts string to PascalCase.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | kebab-case, dot.notation, camelCase, or PascalCase string (e.g. `my-component`, `my_component`, `my.component`, `myComponent`) |

## Returns

`string`

PascalCase string (e.g. `MyComponent`)
