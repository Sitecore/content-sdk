[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/express](../README.md) / ExpressDataHandlerOptions

# Interface: ExpressDataHandlerOptions

Defined in: [packages/angular/src/server/models.ts:90](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/models.ts#L90)

Options for the Express data handler

## Extends

- [`DataHandlerConfig`](DataHandlerConfig.md)

## Properties

### cache?

> `optional` **cache?**: [`LoaderCache`](../../../loaders/interfaces/LoaderCache.md)

Defined in: [packages/angular/src/server/models.ts:99](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/models.ts#L99)

Optional loader cache. When supplied, /_data responses go through
cache-aside; omit to run loaders directly on every request.

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/angular/src/server/models.ts:62](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/models.ts#L62)

The endpoint path for the data handler.

#### Default

```ts
'/_data'
```

#### Inherited from

[`DataHandlerConfig`](DataHandlerConfig.md).[`endpoint`](DataHandlerConfig.md#endpoint)

***

### extractRequestContext?

> `optional` **extractRequestContext?**: (`req`) => [`RequestContext`](../../../loaders/interfaces/RequestContext.md)

Defined in: [packages/angular/src/server/models.ts:105](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/models.ts#L105)

**`Internal`**

Optional request context extractor (e.g. for testing via TestBed).
If not provided, uses the default implementation from loaders/utils.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | [`ExpressRequest`](ExpressRequest.md) |

#### Returns

[`RequestContext`](../../../loaders/interfaces/RequestContext.md)

***

### loaders

> **loaders**: [`LoaderRegistry`](../../../loaders/type-aliases/LoaderRegistry.md)

Defined in: [packages/angular/src/server/models.ts:94](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/models.ts#L94)

The shared loader registry (same object as provideLoaderRegistry).
