[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createSitecoreRevalidateMiddleware

# Function: createSitecoreRevalidateMiddleware()

> **createSitecoreRevalidateMiddleware**(`options`): [`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:65](https://github.com/Sitecore/content-sdk/blob/df0ab91f7e1cc1e11e1d2458da0d151ccdbea3af/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L65)

Express middleware aligned with other frameworks' `createSitecoreRevalidateRouteHandler`.

Handles `POST /api/revalidate` (configurable via `endpoint`):
- Authenticates with `SITECORE_REVALIDATE_SECRET` / `x-revalidate-secret` when configured.
- Parses Experience Edge webhook bodies via [collectSitecoreTagsFromEdgeRevalidateRequestBody](collectSitecoreTagsFromEdgeRevalidateRequestBody.md),
  which resolves Dictionary entry updates to the specific site's dictionary tag using `sites`.
- Calls `LoaderCache.invalidate` (marks entries stale; does not delete).

Response shape: `{ revalidated, tagsCount, marked, invocation_id, continues, durationMs }`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`SitecoreRevalidateMiddlewareOptions`](../interfaces/SitecoreRevalidateMiddlewareOptions.md) | The options for the middleware |

## Returns

[`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

The middleware function
