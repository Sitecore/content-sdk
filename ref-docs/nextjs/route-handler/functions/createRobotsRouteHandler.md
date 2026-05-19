[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [route-handler](../README.md) / createRobotsRouteHandler

# Function: createRobotsRouteHandler()

> **createRobotsRouteHandler**(`options`): `object`

Defined in: [nextjs/src/route-handler/robots-route-handler.ts:30](https://github.com/Sitecore/content-sdk/blob/2204da329c1296334b71f674795af93d93d50ee9/packages/nextjs/src/route-handler/robots-route-handler.ts#L30)

Creates a route handler to serve the robots.txt file.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `RouteHandlerOptions` | The options for the route handler. |

## Returns

`object`

The route handler object with GET method.

### GET

> **GET**: (`req`) => `Promise`\<`Response`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`Promise`\<`Response`\>
