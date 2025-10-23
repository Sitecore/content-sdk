[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / detectRouterType

# Function: detectRouterType()

> **detectRouterType**(`projectRoot`): [`RouterType`](../type-aliases/RouterType.md)

Defined in: [packages/core/src/tools/templating/components.ts:135](https://github.com/Sitecore/content-sdk/blob/54e2d32b8cfa6a9aec978ed0874e1d70711b6607/packages/core/src/tools/templating/components.ts#L135)

Detects the Next.js router type (App Router or Pages Router) based on directory structure.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `projectRoot` | `string` | The project root directory. Defaults to current working directory. |

## Returns

[`RouterType`](../type-aliases/RouterType.md)

'app' if App Router is detected, 'pages' otherwise
