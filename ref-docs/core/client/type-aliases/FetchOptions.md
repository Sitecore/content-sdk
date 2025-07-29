[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / FetchOptions

# Type Alias: FetchOptions

> **FetchOptions** = `object`

Defined in: [packages/core/src/models.ts:69](https://github.com/Sitecore/content-sdk/blob/48a62ac9202e17ce82f8b49dbe7816a096a9747e/packages/core/src/models.ts#L69)

## Properties

### debugger?

> `optional` **debugger**: `Debugger`

Defined in: [packages/core/src/models.ts:89](https://github.com/Sitecore/content-sdk/blob/48a62ac9202e17ce82f8b49dbe7816a096a9747e/packages/core/src/models.ts#L89)

Override debugger for logging. Uses 'content-sdk:http' by default.

***

### fetch?

> `optional` **fetch**: *typeof* `fetch`

Defined in: [packages/core/src/models.ts:81](https://github.com/Sitecore/content-sdk/blob/48a62ac9202e17ce82f8b49dbe7816a096a9747e/packages/core/src/models.ts#L81)

Override to replace default nodeJS fetch implementation

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/core/src/models.ts:85](https://github.com/Sitecore/content-sdk/blob/48a62ac9202e17ce82f8b49dbe7816a096a9747e/packages/core/src/models.ts#L85)

Custom headers to be sent with each request.

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/core/src/models.ts:73](https://github.com/Sitecore/content-sdk/blob/48a62ac9202e17ce82f8b49dbe7816a096a9747e/packages/core/src/models.ts#L73)

Number of retries GraphQL client will attempt on request error

***

### retryStrategy?

> `optional` **retryStrategy**: [`RetryStrategy`](../../index/interfaces/RetryStrategy.md)

Defined in: [packages/core/src/models.ts:77](https://github.com/Sitecore/content-sdk/blob/48a62ac9202e17ce82f8b49dbe7816a096a9747e/packages/core/src/models.ts#L77)

Retry strategy instance
