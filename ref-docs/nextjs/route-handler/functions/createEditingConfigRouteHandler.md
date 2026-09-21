[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [route-handler](../README.md) / createEditingConfigRouteHandler

# Function: createEditingConfigRouteHandler()

> **createEditingConfigRouteHandler**(`options`): `object`

Defined in: [nextjs/src/route-handler/editing-config-route-handler.ts:36](https://github.com/Sitecore/content-sdk/blob/eb4a5a9ee099182eed23366c9fea12d5faf5c541/packages/nextjs/src/route-handler/editing-config-route-handler.ts#L36)

Creates a route handler for the editing config API route (e.g. '/api/editing/config')
Provides configuration information to determine feature compatibility on Pages side.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `EditingConfigRouteHandlerOptions` | The options for the route handler. |

## Returns

`object`

The route handler with GET and OPTIONS methods.

### GET

> **GET**: (`req`) => `Promise`\<`Response`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`Promise`\<`Response`\>

### OPTIONS

> **OPTIONS**: (`req`) => `Promise`\<`Response`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`Promise`\<`Response`\>
