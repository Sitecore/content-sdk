[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [route-handler](../README.md) / createEditingConfigRouteHandler

# Function: createEditingConfigRouteHandler()

> **createEditingConfigRouteHandler**(`options`): `object`

Defined in: [nextjs/src/route-handler/editing-config-route-handler.ts:36](https://github.com/Sitecore/content-sdk/blob/2802b7af64926841fba2ca3c30b0e425c6eab6ff/packages/nextjs/src/route-handler/editing-config-route-handler.ts#L36)

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
