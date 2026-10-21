[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / handleNavigationError

# Function: handleNavigationError()

> **handleNavigationError**(): (`error`) => `void` \| `RedirectCommand`

Defined in: [packages/angular/src/loaders/router-error-handling.ts:77](https://github.com/Sitecore/content-sdk/blob/f0d8e2f2a4d2702c275ba74dc0030e61bf69fd01/packages/angular/src/loaders/router-error-handling.ts#L77)

Returns a navigation error handler for use with withNavigationErrorHandler.
Delegates to [redirectOnNavigationError](redirectOnNavigationError.md).

## Returns

A handler compatible with `provideRouter(routes, withNavigationErrorHandler(...))`

(`error`) => `void` \| `RedirectCommand`
