[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [client](../README.md) / FetchOptions

# Type Alias: FetchOptions

> **FetchOptions** = `object`

Defined in: core/types/models.d.ts:41

Fetch options

## Properties

### debugger?

> `optional` **debugger?**: `Debugger`

Defined in: core/types/models.d.ts:61

Override debugger for logging. Uses 'content-sdk:http' by default.

***

### fetch?

> `optional` **fetch?**: *typeof* `fetch`

Defined in: core/types/models.d.ts:53

Override to replace default nodeJS fetch implementation

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: core/types/models.d.ts:57

Custom headers to be sent with each request.

***

### retries?

> `optional` **retries?**: `number`

Defined in: core/types/models.d.ts:45

Number of retries GraphQL client will attempt on request error

***

### retryStrategy?

> `optional` **retryStrategy?**: [`RetryStrategy`](../interfaces/RetryStrategy.md)

Defined in: core/types/models.d.ts:49

Retry strategy instance
