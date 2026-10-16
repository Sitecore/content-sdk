[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createRedirectsMiddleware

# Function: createRedirectsMiddleware()

> **createRedirectsMiddleware**(`options`): [`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/redirects-middleware.ts:139](https://github.com/Sitecore/content-sdk/blob/cc697f1b79c7ea3d0da73c83f919cdbb67d0d0c9/packages/angular/src/server/middleware/redirects-middleware.ts#L139)

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
