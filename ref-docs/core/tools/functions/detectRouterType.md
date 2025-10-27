[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / detectRouterType

# Function: detectRouterType()

> **detectRouterType**(`projectRoot`): [`RouterType`](../type-aliases/RouterType.md)

Defined in: [packages/core/src/tools/templating/components.ts:140](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/core/src/tools/templating/components.ts#L140)

Detects the Next.js router type (App Router or Pages Router) based on directory structure.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `projectRoot` | `string` | The project root directory. Defaults to current working directory. |

## Returns

[`RouterType`](../type-aliases/RouterType.md)

'app' if App Router is detected, 'pages' otherwise
