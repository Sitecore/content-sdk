[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / detectRouterType

# Function: detectRouterType()

> **detectRouterType**(`projectRoot`): [`RouterType`](../type-aliases/RouterType.md)

Defined in: [packages/core/src/tools/templating/components.ts:91](https://github.com/Sitecore/content-sdk/blob/fe2f13c51c10d34e04dfeff337807ad53b762ca9/packages/core/src/tools/templating/components.ts#L91)

Detects the Next.js router type (App Router or Pages Router) based on directory structure.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `projectRoot` | `string` | The project root directory. Defaults to current working directory. |

## Returns

[`RouterType`](../type-aliases/RouterType.md)

'app' if App Router is detected, 'pages' otherwise
