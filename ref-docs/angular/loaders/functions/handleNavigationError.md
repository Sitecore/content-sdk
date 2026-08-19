[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / handleNavigationError

# Function: handleNavigationError()

> **handleNavigationError**(): (`error`) => `void` \| `RedirectCommand`

Defined in: [packages/angular/src/loaders/router-error-handling.ts:77](https://github.com/Sitecore/content-sdk/blob/84866ded66f6f8f69e7f007b2311494e086b493b/packages/angular/src/loaders/router-error-handling.ts#L77)

Returns a navigation error handler for use with withNavigationErrorHandler.
Delegates to [redirectOnNavigationError](redirectOnNavigationError.md).

## Returns

A handler compatible with `provideRouter(routes, withNavigationErrorHandler(...))`

(`error`) => `void` \| `RedirectCommand`
