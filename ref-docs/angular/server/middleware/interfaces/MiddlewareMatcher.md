[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / MiddlewareMatcher

# Interface: MiddlewareMatcher

Defined in: [packages/angular/src/server/middleware/models.ts:37](https://github.com/Sitecore/content-sdk/blob/3b9edfe853f8f321e9bd2dff8cfbdda2c3d66627/packages/angular/src/server/middleware/models.ts#L37)

Matcher configuration for middleware path inclusion/exclusion. Each pattern is either a `string`
(matched exactly) or a `RegExp` (matched with `.test`).

## Properties

### excludePaths?

> `optional` **excludePaths?**: [`PathPattern`](../type-aliases/PathPattern.md)[]

Defined in: [packages/angular/src/server/middleware/models.ts:47](https://github.com/Sitecore/content-sdk/blob/3b9edfe853f8f321e9bd2dff8cfbdda2c3d66627/packages/angular/src/server/middleware/models.ts#L47)

Paths to **exclude** (always skipped), evaluated before [MiddlewareMatcher.includePaths](#includepaths).
Example: `['/health', /\.json$/]`

***

### includePaths?

> `optional` **includePaths?**: [`PathPattern`](../type-aliases/PathPattern.md)[]

Defined in: [packages/angular/src/server/middleware/models.ts:42](https://github.com/Sitecore/content-sdk/blob/3b9edfe853f8f321e9bd2dff8cfbdda2c3d66627/packages/angular/src/server/middleware/models.ts#L42)

Paths to **include**. If provided, only matching paths are processed.
Example: `['/about', /^/products//]`
