[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createRedirectsMiddleware

# Function: createRedirectsMiddleware()

> **createRedirectsMiddleware**(`options`): [`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/redirects-middleware.ts:139](https://github.com/Sitecore/content-sdk/blob/b858df1f6f27c4f7a00a2d33c81c5e5233790233/packages/angular/src/server/middleware/redirects-middleware.ts#L139)

Middleware to support Sitecore redirects on the Angular Express SSR server.

Fetches redirects for the resolved site, matches the incoming request against locale-versioned
and redirect-map (static/regex) rules using the shared redirect utilities, and dispatches a
301/302 redirect or an internal server-transfer rewrite. Fails open (`next()`) on any error so a
misconfigured redirect never takes the site down.

Must run after the multisite middleware (which resolves `scParams.siteName`) and before the
Angular SSR handler.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`RedirectsMiddlewareOptions`](../type-aliases/RedirectsMiddlewareOptions.md) | Redirects middleware options. |

## Returns

[`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Express middleware.
