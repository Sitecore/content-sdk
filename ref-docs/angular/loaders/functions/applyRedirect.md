[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / applyRedirect

# Function: applyRedirect()

> **applyRedirect**(`router`, `location`): `void` \| `RedirectCommand`

Defined in: [packages/angular/src/loaders/utils.ts:18](https://github.com/Sitecore/content-sdk/blob/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46/packages/angular/src/loaders/utils.ts#L18)

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
