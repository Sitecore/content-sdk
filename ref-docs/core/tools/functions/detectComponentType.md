[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / detectComponentType

# Function: detectComponentType()

> **detectComponentType**(`filePath`, `routerType?`): [`ComponentType`](../type-aliases/ComponentType.md)

Defined in: [packages/core/src/tools/templating/components.ts:189](https://github.com/Sitecore/content-sdk/blob/d2abf18666fba089b9dcf62cea47b87eef22e96d/packages/core/src/tools/templating/components.ts#L189)

**`Internal`**

Detects the component type based on directives, imports, and router context.
- Checks for 'use client' directive
- Checks for explicit componentType export
- Checks for server-only imports (next/headers, etc.)
- Defaults to 'server' for App Router, 'universal' for Pages Router

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `filePath` | `string` | Path to the component file |
| `routerType?` | [`RouterType`](../type-aliases/RouterType.md) | Optional router type override. Auto-detected if not provided. |

## Returns

[`ComponentType`](../type-aliases/ComponentType.md)

'server', 'client', or 'universal'
