[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / redirectOnNavigationError

# Function: redirectOnNavigationError()

> **redirectOnNavigationError**(`err`, `failedUrl`, `notFoundRoute`, `errorRoute`, `router`): `void` \| `RedirectCommand`

Defined in: [packages/angular/src/loaders/router-error-handling.ts:38](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/loaders/router-error-handling.ts#L38)

Resolves a navigation error to a RedirectCommand or void.
Handles loader exceptions (NotFoundNavigationError and other errors) and prevents redirect loops
when the failed navigation was already to the not-found route or the error route.
Must be called from an injection context (uses NOT_FOUND_ROUTE_TOKEN, ERROR_ROUTE_TOKEN, Router).

**HTTP status codes (SSR):** RedirectCommand only triggers navigation to the not-found or error
route; it does not set the HTTP response status. To return 404 or 500 when those pages are
rendered on the server, configure your app so the server sends the correct status. For example,
in `app.routes.server.ts` add ServerRoute entries for your not-found and error paths with
`status: 404` and `status: 500` (see Angular "Setting headers and status codes" in the SSR guide).
Alternatively, inject `RESPONSE_INIT` in your NotFoundComponent and ErrorComponent and set the
status when running on the server.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `err` | `Error` | The error from the navigation (e.g. NotFoundNavigationError or LoaderHttpError) |
| `failedUrl` | `string` | URL that failed to load |
| `notFoundRoute` | `string` | Path for the not-found page (e.g. '/404') |
| `errorRoute` | `string` | Path for the error page (e.g. '/500') |
| `router` | `Router` | Angular Router instance |

## Returns

`void` \| `RedirectCommand`

RedirectCommand to redirect, or void to cancel and avoid a loop
