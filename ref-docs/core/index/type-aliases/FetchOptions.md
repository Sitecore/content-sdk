[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / FetchOptions

# Type Alias: FetchOptions

> **FetchOptions** = `object`

Defined in: [packages/core/src/models.ts:44](https://github.com/Sitecore/content-sdk/blob/200841a0259c72fee00f61fef7f94179a0bdad7d/packages/core/src/models.ts#L44)

Fetch options

## Properties

### debugger?

> `optional` **debugger?**: `Debugger`

Defined in: [packages/core/src/models.ts:64](https://github.com/Sitecore/content-sdk/blob/200841a0259c72fee00f61fef7f94179a0bdad7d/packages/core/src/models.ts#L64)

Override debugger for logging. Uses 'content-sdk:http' by default.

***

### fetch?

> `optional` **fetch?**: *typeof* `fetch`

Defined in: [packages/core/src/models.ts:56](https://github.com/Sitecore/content-sdk/blob/200841a0259c72fee00f61fef7f94179a0bdad7d/packages/core/src/models.ts#L56)

Override to replace default nodeJS fetch implementation

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [packages/core/src/models.ts:60](https://github.com/Sitecore/content-sdk/blob/200841a0259c72fee00f61fef7f94179a0bdad7d/packages/core/src/models.ts#L60)

Custom headers to be sent with each request.

***

### retries?

> `optional` **retries?**: `number`

Defined in: [packages/core/src/models.ts:48](https://github.com/Sitecore/content-sdk/blob/200841a0259c72fee00f61fef7f94179a0bdad7d/packages/core/src/models.ts#L48)

Number of retries GraphQL client will attempt on request error

***

### retryStrategy?

> `optional` **retryStrategy?**: [`RetryStrategy`](../interfaces/RetryStrategy.md)

Defined in: [packages/core/src/models.ts:52](https://github.com/Sitecore/content-sdk/blob/200841a0259c72fee00f61fef7f94179a0bdad7d/packages/core/src/models.ts#L52)

Retry strategy instance
