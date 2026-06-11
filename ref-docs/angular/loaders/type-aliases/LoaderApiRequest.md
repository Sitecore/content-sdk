[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderApiRequest

# Type Alias: LoaderApiRequest

> **LoaderApiRequest** = `object`

Defined in: [packages/angular/src/loaders/models.ts:80](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/loaders/models.ts#L80)

## Properties

### angularRequestContext?

> `optional` **angularRequestContext?**: [`RequestContext`](../interfaces/RequestContext.md)

Defined in: [packages/angular/src/loaders/models.ts:91](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/loaders/models.ts#L91)

Server-derived request context (hostname, headers, cookies, query).
Populated once at the request boundary (`/_data` middleware closure or the
SSR resolver). Downstream code reads this directly; nobody re-extracts.
Phase 2 of the refactor plan.

***

### cacheOptions?

> `optional` **cacheOptions?**: [`LoaderCacheConfig`](../interfaces/LoaderCacheConfig.md)

Defined in: [packages/angular/src/loaders/models.ts:97](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/loaders/models.ts#L97)

Per-route cache overrides supplied at the `loaderResolver(id, cacheOptions)`
call site. The browser includes them in the `/_data` POST body so the same
per-route policy applies on CSR navigations. Phase 5 of the refactor plan.

***

### loaderId

> **loaderId**: `string`

Defined in: [packages/angular/src/loaders/models.ts:81](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/loaders/models.ts#L81)

***

### params

> **params**: `Params`

Defined in: [packages/angular/src/loaders/models.ts:83](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/loaders/models.ts#L83)

***

### query

> **query**: `Record`\<`string`, `any`\>

Defined in: [packages/angular/src/loaders/models.ts:84](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/loaders/models.ts#L84)

***

### url

> **url**: `string`

Defined in: [packages/angular/src/loaders/models.ts:82](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/loaders/models.ts#L82)
