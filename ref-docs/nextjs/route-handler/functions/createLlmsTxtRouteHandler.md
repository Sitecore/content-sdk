[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [route-handler](../README.md) / createLlmsTxtRouteHandler

# Function: createLlmsTxtRouteHandler()

> **createLlmsTxtRouteHandler**(`options`): `object`

Defined in: [nextjs/src/route-handler/llms-txt-route-handler.ts:35](https://github.com/Sitecore/content-sdk/blob/fbd07f45d77bcc00772e33d09bde850e688b09b2/packages/nextjs/src/route-handler/llms-txt-route-handler.ts#L35)

Creates a route handler to serve the llms.txt file.

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
