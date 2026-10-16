[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / handleNavigationError

# Function: handleNavigationError()

> **handleNavigationError**(): (`error`) => `void` \| `RedirectCommand`

Defined in: [packages/angular/src/loaders/router-error-handling.ts:77](https://github.com/Sitecore/content-sdk/blob/5509bcddfb4134f289ce04760ee3a119d66b3d04/packages/angular/src/loaders/router-error-handling.ts#L77)

Returns a navigation error handler for use with withNavigationErrorHandler.
Delegates to [redirectOnNavigationError](redirectOnNavigationError.md).

## Returns

A handler compatible with `provideRouter(routes, withNavigationErrorHandler(...))`

(`error`) => `void` \| `RedirectCommand`
