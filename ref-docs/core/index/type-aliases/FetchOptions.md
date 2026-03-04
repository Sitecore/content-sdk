[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / FetchOptions

# Type Alias: FetchOptions

> **FetchOptions** = `object`

Defined in: [packages/core/src/models.ts:44](https://github.com/Sitecore/content-sdk/blob/da3af374c12a806fb6f8807e6b8d4e5bb6a4d421/packages/core/src/models.ts#L44)

Fetch options

## Properties

### debugger?

> `optional` **debugger**: `Debugger`

Defined in: [packages/core/src/models.ts:64](https://github.com/Sitecore/content-sdk/blob/da3af374c12a806fb6f8807e6b8d4e5bb6a4d421/packages/core/src/models.ts#L64)

Override debugger for logging. Uses 'content-sdk:http' by default.

***

### fetch?

> `optional` **fetch**: *typeof* `fetch`

Defined in: [packages/core/src/models.ts:56](https://github.com/Sitecore/content-sdk/blob/da3af374c12a806fb6f8807e6b8d4e5bb6a4d421/packages/core/src/models.ts#L56)

Override to replace default nodeJS fetch implementation

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/core/src/models.ts:60](https://github.com/Sitecore/content-sdk/blob/da3af374c12a806fb6f8807e6b8d4e5bb6a4d421/packages/core/src/models.ts#L60)

Custom headers to be sent with each request.

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/core/src/models.ts:48](https://github.com/Sitecore/content-sdk/blob/da3af374c12a806fb6f8807e6b8d4e5bb6a4d421/packages/core/src/models.ts#L48)

Number of retries GraphQL client will attempt on request error

***

### retryStrategy?

> `optional` **retryStrategy**: [`RetryStrategy`](../interfaces/RetryStrategy.md)

Defined in: [packages/core/src/models.ts:52](https://github.com/Sitecore/content-sdk/blob/da3af374c12a806fb6f8807e6b8d4e5bb6a4d421/packages/core/src/models.ts#L52)

Retry strategy instance
