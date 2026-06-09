[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / applyRedirect

# Function: applyRedirect()

> **applyRedirect**(`router`, `location`): `void` \| `RedirectCommand`

Defined in: [packages/angular/src/loaders/utils.ts:14](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/utils.ts#L14)

Apply a redirect: internal URLs → RedirectCommand; external URLs → full page navigation.
Use in resolvers and in the navigation error handler (fallback) so redirect behavior is consistent.
Redirects are not errors; this helper is the single place that defines how to perform them.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `router` | `Router` | Angular Router (for internal redirects) |
| `location` | `string` | Target URL (path or full URL) |

## Returns

`void` \| `RedirectCommand`

RedirectCommand for internal, void after window.location.assign for external
