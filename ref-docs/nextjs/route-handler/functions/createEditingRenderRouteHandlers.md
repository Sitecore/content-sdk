[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [route-handler](../README.md) / createEditingRenderRouteHandlers

# Function: createEditingRenderRouteHandlers()

> **createEditingRenderRouteHandlers**(`options`): `object`

Defined in: [nextjs/src/route-handler/editing-render-route-handler.ts:70](https://github.com/Sitecore/content-sdk/blob/210f354a75bc745a00ce1e1fd340e7f684e24c81/packages/nextjs/src/route-handler/editing-render-route-handler.ts#L70)

Creates a route handler for the editing render API route (e.g. '/api/editing/render')

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `EditingHandlerOptions` | The options for the route handler. |

## Returns

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

### POST()

> **POST**: (`req`) => `Promise`\<`Response`\>

This POST handler serves as proxy for server action call when Design Library is rendering server component.
When Design Library needs to dynamically update or render a generated variant of server component a server action updateServerComponentAction is called from the client side.
The way server functions work is that the action call is made to the same URL with POST method, which in normal page render is handled internally by Next.js.
However, in editing mode we are in an api route handler scenario so we need to proxy the POST request to be able to process the server action correctly.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | The incoming request |

#### Returns

`Promise`\<`Response`\>
