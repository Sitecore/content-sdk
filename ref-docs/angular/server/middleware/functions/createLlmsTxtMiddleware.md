[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createLlmsTxtMiddleware

# Function: createLlmsTxtMiddleware()

> **createLlmsTxtMiddleware**(`options`): [`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/llms-txt-middleware.ts:26](https://github.com/Sitecore/content-sdk/blob/ee7d15fb7ff51ecf52f6c48a5dd927ab6855f385/packages/angular/src/server/middleware/llms-txt-middleware.ts#L26)

llms.txt handler for Express. Mount at `/llms.txt`.
Serves the llms.txt content managed via SitecoreAI for the site resolved by host name.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`CreateLlmsTxtMiddlewareOptions`](../interfaces/CreateLlmsTxtMiddlewareOptions.md) | Middleware options. |

## Returns

[`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)
