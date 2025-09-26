[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [route-handler](../README.md) / createEditingConfigRouteHandler

# Function: createEditingConfigRouteHandler()

> **createEditingConfigRouteHandler**(`options`): `object`

Defined in: [nextjs/src/route-handler/editing-config-route-handler.ts:31](https://github.com/Sitecore/content-sdk/blob/e8b106f23eb416c3200d4f8e6db200c4a3f9f594/packages/nextjs/src/route-handler/editing-config-route-handler.ts#L31)

Creates a route handler for the editing config API route (e.g. '/api/editing/config')
Provides configuration information to determine feature compatibility on Pages side.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `EditingConfigRouteHandlerOptions` | The options for the route handler. |

## Returns

`object`

The route handler with GET and OPTIONS methods.

### GET()

> **GET**: (`req`) => `Promise`\<`Response`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`Promise`\<`Response`\>

### OPTIONS()

> **OPTIONS**: (`req`) => `Promise`\<`Response`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`Promise`\<`Response`\>
