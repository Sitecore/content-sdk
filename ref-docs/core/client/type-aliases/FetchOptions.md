[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / FetchOptions

# Type Alias: FetchOptions

> **FetchOptions** = `object`

Defined in: packages/core/src/models.ts:78

Fetch options

## Properties

### debugger?

> `optional` **debugger**: `Debugger`

Defined in: packages/core/src/models.ts:98

Override debugger for logging. Uses 'content-sdk:http' by default.

***

### fetch?

> `optional` **fetch**: *typeof* `fetch`

Defined in: packages/core/src/models.ts:90

Override to replace default nodeJS fetch implementation

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: packages/core/src/models.ts:94

Custom headers to be sent with each request.

***

### retries?

> `optional` **retries**: `number`

Defined in: packages/core/src/models.ts:82

Number of retries GraphQL client will attempt on request error

***

### retryStrategy?

> `optional` **retryStrategy**: [`RetryStrategy`](../../index/interfaces/RetryStrategy.md)

Defined in: packages/core/src/models.ts:86

Retry strategy instance
