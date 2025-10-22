[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / detectRouterType

# Function: detectRouterType()

> **detectRouterType**(`projectRoot`): [`RouterType`](../type-aliases/RouterType.md)

Defined in: [packages/core/src/tools/templating/components.ts:103](https://github.com/Sitecore/content-sdk/blob/6dc8e98dbbb7b7e5be9ff8107e95237d8311c7dc/packages/core/src/tools/templating/components.ts#L103)

Detects the Next.js router type (App Router or Pages Router) based on directory structure.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `projectRoot` | `string` | The project root directory. Defaults to current working directory. |

## Returns

[`RouterType`](../type-aliases/RouterType.md)

'app' if App Router is detected, 'pages' otherwise
