[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / FetchOptions

# Type Alias: FetchOptions

> **FetchOptions** = `object`

Defined in: [packages/core/src/models.ts:78](https://github.com/Sitecore/content-sdk/blob/6eae15c675a64fb02f95da52f5ad7786bf53c7c0/packages/core/src/models.ts#L78)

Fetch options

## Properties

### debugger?

> `optional` **debugger**: `Debugger`

Defined in: [packages/core/src/models.ts:98](https://github.com/Sitecore/content-sdk/blob/6eae15c675a64fb02f95da52f5ad7786bf53c7c0/packages/core/src/models.ts#L98)

Override debugger for logging. Uses 'content-sdk:http' by default.

***

### fetch?

> `optional` **fetch**: *typeof* `fetch`

Defined in: [packages/core/src/models.ts:90](https://github.com/Sitecore/content-sdk/blob/6eae15c675a64fb02f95da52f5ad7786bf53c7c0/packages/core/src/models.ts#L90)

Override to replace default nodeJS fetch implementation

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/core/src/models.ts:94](https://github.com/Sitecore/content-sdk/blob/6eae15c675a64fb02f95da52f5ad7786bf53c7c0/packages/core/src/models.ts#L94)

Custom headers to be sent with each request.

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/core/src/models.ts:82](https://github.com/Sitecore/content-sdk/blob/6eae15c675a64fb02f95da52f5ad7786bf53c7c0/packages/core/src/models.ts#L82)

Number of retries GraphQL client will attempt on request error

***

### retryStrategy?

> `optional` **retryStrategy**: [`RetryStrategy`](../../index/interfaces/RetryStrategy.md)

Defined in: [packages/core/src/models.ts:86](https://github.com/Sitecore/content-sdk/blob/6eae15c675a64fb02f95da52f5ad7786bf53c7c0/packages/core/src/models.ts#L86)

Retry strategy instance
