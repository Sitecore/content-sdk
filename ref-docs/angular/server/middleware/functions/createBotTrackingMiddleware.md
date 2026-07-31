[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createBotTrackingMiddleware

# Function: createBotTrackingMiddleware()

> **createBotTrackingMiddleware**(`options`): [`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/bot-tracking-middleware.ts:70](https://github.com/Sitecore/content-sdk/blob/07c6169d94098a2bc2f491ef61de4d253b52b098/packages/angular/src/server/middleware/bot-tracking-middleware.ts#L70)

Middleware that runs bot detection once per request. When the request is from a bot it marks the
request/response with the `sc_bot` cookie (so downstream middlewares — e.g. personalize — and the
SSR analytics adapters detect the bot within the same request) and dispatches a dedicated
`botPageView` event.

Must run before the personalize middleware so the bot cookie is set before personalize reads it.
The `botPageView` dispatch is awaited (not backgrounded): `initContentSdk` writes the module-global
core context, and the SSR render re-inits it after `next()`, so awaiting sequences init + dispatch
before that happens. The extra latency lands on bot requests only.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`BotTrackingMiddlewareOptions`](../type-aliases/BotTrackingMiddlewareOptions.md) | bot tracking middleware options |

## Returns

[`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Express middleware
