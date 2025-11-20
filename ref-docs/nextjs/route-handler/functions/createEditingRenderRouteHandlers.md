[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [route-handler](../README.md) / createEditingRenderRouteHandlers

# Function: createEditingRenderRouteHandlers()

> **createEditingRenderRouteHandlers**(`options`): `object`

Defined in: [nextjs/src/route-handler/editing-render-route-handler.ts:59](https://github.com/Sitecore/content-sdk/blob/66c36d02e82e2d6af837d7bc73eac8efc8179d04/packages/nextjs/src/route-handler/editing-render-route-handler.ts#L59)

Creates a route handler for the editing render API route (e.g. '/api/editing/render')

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `EditingHandlerOptions` | The options for the route handler. |

## Returns

`object`

The route handler object with GET and OPTIONS methods.

### GET()

> **GET**: (`req`) => `Promise`\<`Response`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`Promise`\<`Response`\>

### OPTIONS()

> **OPTIONS**: (`req`) => `Response`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`Response`
