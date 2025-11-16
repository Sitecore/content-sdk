[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [route-handler](../README.md) / createEditingRenderRouteHandlers

# Function: createEditingRenderRouteHandlers()

> **createEditingRenderRouteHandlers**(`options`): `object`

Defined in: [nextjs/src/route-handler/editing-render-route-handler.ts:59](https://github.com/Sitecore/content-sdk/blob/3e0ae66bfd4d249466803a430fcb3f11a2a9a4a8/packages/nextjs/src/route-handler/editing-render-route-handler.ts#L59)

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
