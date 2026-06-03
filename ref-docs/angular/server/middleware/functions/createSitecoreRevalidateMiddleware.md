[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createSitecoreRevalidateMiddleware

# Function: createSitecoreRevalidateMiddleware()

> **createSitecoreRevalidateMiddleware**(`options`): [`ExpressMiddleware`](../../express/type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:65](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L65)

Express middleware aligned with Next.js `createSitecoreRevalidateRouteHandler`.

Handles `POST /api/revalidate` (configurable via `endpoint`):
- Authenticates with `SITECORE_REVALIDATE_SECRET` / `x-revalidate-secret` when configured.
- Parses Experience Edge webhook bodies via [collectSitecoreTagsFromEdgeRevalidateRequestBody](collectSitecoreTagsFromEdgeRevalidateRequestBody.md).
- Optionally appends dictionary loader tags for each configured site.
- Calls `LoaderCache.invalidate` (marks entries stale; does not delete).

Response shape: `{ revalidated, tagsCount, marked, invocation_id, continues, durationMs }`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`SitecoreRevalidateMiddlewareOptions`](../interfaces/SitecoreRevalidateMiddlewareOptions.md) | The options for the middleware |

## Returns

[`ExpressMiddleware`](../../express/type-aliases/ExpressMiddleware.md)

The middleware function
