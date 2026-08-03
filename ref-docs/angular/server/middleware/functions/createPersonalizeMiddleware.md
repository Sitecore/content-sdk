[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createPersonalizeMiddleware

# Function: createPersonalizeMiddleware()

> **createPersonalizeMiddleware**(`options`): [`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/personalize-middleware.ts:156](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/angular/src/server/middleware/personalize-middleware.ts#L156)

Middleware to support Sitecore Personalize.
Identifies page/component variants for the request via Sitecore CDP and populates
`req.scParams.variantId` and `req.scParams.componentVariantIds` for downstream layout personalization.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`PersonalizeMiddlewareOptions`](../type-aliases/PersonalizeMiddlewareOptions.md) | personalize middleware options |

## Returns

[`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Express middleware
