[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / ClientPreLoaderDataService

# Class: ClientPreLoaderDataService

Defined in: [packages/angular/src/loaders/pre-loader-data.service.ts:39](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/pre-loader-data.service.ts#L39)

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

Defined in: [packages/angular/src/loaders/pre-loader-data.service.ts:45](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/pre-loader-data.service.ts#L45)

#### Returns

`ClientPreLoaderDataService`

## Methods

### prefetchForRoute()

> **prefetchForRoute**(`route`, `state`): `Promise`\<`void`\>

Defined in: [packages/angular/src/loaders/pre-loader-data.service.ts:67](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/pre-loader-data.service.ts#L67)

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
