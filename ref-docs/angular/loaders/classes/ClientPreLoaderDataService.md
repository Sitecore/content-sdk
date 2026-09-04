[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / ClientPreLoaderDataService

# Class: ClientPreLoaderDataService

Defined in: [packages/angular/src/loaders/pre-loader-data.service.ts:34](https://github.com/Sitecore/content-sdk/blob/8eb01ef1062b410d0a689de49635870a3d3afbde/packages/angular/src/loaders/pre-loader-data.service.ts#L34)

ClientPreLoaderDataService kicks off loader data fetches for all loaders in the current route
and its parent routes in parallel, so that when Angular runs resolvers sequentially,
resolvers get staged prefetched responses or join already-pending requests instead of waiting.

Subscribes to the router's ActivationStart event and prefetches for the
ActivatedRouteSnapshot when it is the leaf route (browser only). Discovers all loader
resolvers on that snapshot and its parents (via LOADER_ID on pathFromRoot), then
calls ClientLoaderDataService.prefetch() for each (loaderId, url, params, query). Fetches
run in parallel; results are stored in ClientLoaderDataService prefetchedResponses for getData() to consume.

## Constructors

### Constructor

> **new ClientPreLoaderDataService**(): `ClientPreLoaderDataService`

Defined in: [packages/angular/src/loaders/pre-loader-data.service.ts:42](https://github.com/Sitecore/content-sdk/blob/8eb01ef1062b410d0a689de49635870a3d3afbde/packages/angular/src/loaders/pre-loader-data.service.ts#L42)

#### Returns

`ClientPreLoaderDataService`

## Methods

### prefetchForRoute()

> **prefetchForRoute**(`route`, `state`): `Promise`\<`void`\>

Defined in: [packages/angular/src/loaders/pre-loader-data.service.ts:64](https://github.com/Sitecore/content-sdk/blob/8eb01ef1062b410d0a689de49635870a3d3afbde/packages/angular/src/loaders/pre-loader-data.service.ts#L64)

Prefetch loader data for all loaders in the route tree.
Call this at the start of browser resolver execution so all loaders for the route
are kicked off in parallel before resolvers run sequentially.
No-op on server.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `route` | `ActivatedRouteSnapshot` | Current route (pathFromRoot gives current and parent routes) |
| `state` | `RouterStateSnapshot` | Current router state (use state.url for the navigation URL) |

#### Returns

`Promise`\<`void`\>

***

### prefetchForUrl()

> **prefetchForUrl**(`url`, `options?`): `void`

Defined in: [packages/angular/src/loaders/pre-loader-data.service.ts:122](https://github.com/Sitecore/content-sdk/blob/8eb01ef1062b410d0a689de49635870a3d3afbde/packages/angular/src/loaders/pre-loader-data.service.ts#L122)

Resolves the loaders that apply to `url` - without navigating - via matchRouteChain
against `Router.config`, then prefetches each one, same as [prefetchForRoute](#prefetchforroute) does
for a live navigation. Entry point for hover/eager link prefetch; doesn't gate on an enable/disable flag itself - callers decide when to call it.

No-ops on server, for absolute/external URLs, when `url` matches no route, or when the
matched chain has no loaders.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | Candidate navigation URL (e.g. an anchor's `href`). |
| `options?` | \{ `force?`: `boolean`; \} | Prefetch options |
| `options.force?` | `boolean` | Forwarded to [ClientLoaderDataService.prefetch](ClientLoaderDataService.md#prefetch); hover callers pass `true`, eager callers omit it. |

#### Returns

`void`
