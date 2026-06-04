[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/express](../README.md) / ExpressDataHandlerOptions

# Interface: ExpressDataHandlerOptions

Defined in: [packages/angular/src/server/models.ts:80](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/server/models.ts#L80)

Options for the Express data handler

## Extends

- [`DataHandlerConfig`](DataHandlerConfig.md)

## Properties

### cache?

> `optional` **cache?**: [`LoaderCache`](../../../loaders/interfaces/LoaderCache.md)

Defined in: [packages/angular/src/server/models.ts:89](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/server/models.ts#L89)

Optional loader cache. When supplied, /_data responses go through
cache-aside; omit to run loaders directly on every request.

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/angular/src/server/models.ts:52](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/server/models.ts#L52)

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

Defined in: [packages/angular/src/server/models.ts:95](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/server/models.ts#L95)

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

Defined in: [packages/angular/src/server/models.ts:84](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/server/models.ts#L84)

The shared loader registry (same object as provideLoaderRegistry).
