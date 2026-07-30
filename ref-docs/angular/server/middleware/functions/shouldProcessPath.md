[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / shouldProcessPath

# Function: shouldProcessPath()

> **shouldProcessPath**(`path`, `matcher?`): `boolean`

Defined in: [packages/angular/src/server/middleware/utils.ts:156](https://github.com/Sitecore/content-sdk/blob/4c907d5f6aac9870a7c40fd993f1f70ddce4802f/packages/angular/src/server/middleware/utils.ts#L156)

Determine whether a middleware should process a request based on path matching.
Applies the default exclusions (API routes, Sitecore routes, static files) and then any custom
`excludePaths` / `includePaths` from the matcher. Editing/preview gating is handled separately by
each middleware (see [isEditingPreview](isEditingPreview.md)), not here.

Precedence: default exclusions and `excludePaths` always win; when `includePaths` is provided the
path must additionally match at least one include pattern. Each pattern is a `string` (exact
match) or a `RegExp`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The normalized request path (query string stripped). |
| `matcher?` | [`MiddlewareMatcher`](../interfaces/MiddlewareMatcher.md) | Custom include/exclude patterns. |

## Returns

`boolean`

True if the middleware should process this request.
