[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / FetchOptions

# Type Alias: FetchOptions

> **FetchOptions**: `object`

Defined in: [packages/core/src/models.ts:69](https://github.com/Sitecore/xmc-jss-dev/blob/fb28e62d080186b27c7d4ce8540b36be242e1f86/packages/core/src/models.ts#L69)

## Type declaration

### debugger?

> `optional` **debugger**: `Debugger`

Override debugger for logging. Uses 'core:http' by default.

### fetch?

> `optional` **fetch**: *typeof* `fetch`

Override to replace default nodeJS fetch implementation

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Custom headers to be sent with each request.

### retries?

> `optional` **retries**: `number`

Number of retries GraphQL client will attempt on request error

### retryStrategy?

> `optional` **retryStrategy**: [`RetryStrategy`](../../index/interfaces/RetryStrategy.md)

Retry strategy instance
