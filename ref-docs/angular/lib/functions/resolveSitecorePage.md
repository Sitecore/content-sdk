[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [lib](../README.md) / resolveSitecorePage

# Function: resolveSitecorePage()

> **resolveSitecorePage**(`path`, `sitecoreConfig`, `client`, `options?`): `Promise`\<`Page` \| `null`\>

Defined in: [packages/angular/src/lib/sitecore-page-resolver.ts:19](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/lib/sitecore-page-resolver.ts#L19)

Resolves layout/page data for a route path using a [SitecoreClient](../content/client/classes/SitecoreClient.md) and Sitecore config.
Import your `sitecore.config` default and shared client (e.g. `getClient()`) from the app;
this stays usable from route loaders without Angular injection context.

Future: add helpers for personalization and multisite alongside this call.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | Route path (e.g. `'/'` or `'/about'`). |
| `sitecoreConfig` | [`AngularSitecoreConfig`](../../config/interfaces/AngularSitecoreConfig.md) | Resolved Sitecore configuration (e.g. default export from `sitecore.config.ts`). |
| `client` | [`SitecoreClient`](../content/client/classes/SitecoreClient.md) | Sitecore client instance (e.g. from a module singleton). |
| `options?` | \{ `locale?`: `string`; `site?`: `string`; \} | Optional `locale` / `site` overrides. |
| `options.locale?` | `string` | Optional locale override. |
| `options.site?` | `string` | Optional site override. |

## Returns

`Promise`\<`Page` \| `null`\>

Page layout data, or `null` if not found.
