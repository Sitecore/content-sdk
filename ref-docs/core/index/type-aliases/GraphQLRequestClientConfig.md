[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / GraphQLRequestClientConfig

# Type Alias: GraphQLRequestClientConfig

> **GraphQLRequestClientConfig** = `object`

Defined in: [packages/core/src/graphql-request-client.ts:37](https://github.com/Sitecore/content-sdk/blob/3746e90462f2207927cf04da92b0c6dc4ff879fc/packages/core/src/graphql-request-client.ts#L37)

Minimum configuration options for classes that implement

## See

GraphQLClient

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/core/src/graphql-request-client.ts:41](https://github.com/Sitecore/content-sdk/blob/3746e90462f2207927cf04da92b0c6dc4ff879fc/packages/core/src/graphql-request-client.ts#L41)

The API key to use for authentication. This will be added as an 'sc_apikey' header.

***

### contextId?

> `optional` **contextId**: `string`

Defined in: [packages/core/src/graphql-request-client.ts:45](https://github.com/Sitecore/content-sdk/blob/3746e90462f2207927cf04da92b0c6dc4ff879fc/packages/core/src/graphql-request-client.ts#L45)

A unified identifier used to connect and retrieve data from XM Cloud instance

***

### debugger?

> `optional` **debugger**: [`Debugger`](Debugger.md)

Defined in: [packages/core/src/graphql-request-client.ts:49](https://github.com/Sitecore/content-sdk/blob/3746e90462f2207927cf04da92b0c6dc4ff879fc/packages/core/src/graphql-request-client.ts#L49)

Override debugger for logging. Uses 'content-sdk:http' by default.

***

### fetch?

> `optional` **fetch**: *typeof* `fetch`

Defined in: [packages/core/src/graphql-request-client.ts:53](https://github.com/Sitecore/content-sdk/blob/3746e90462f2207927cf04da92b0c6dc4ff879fc/packages/core/src/graphql-request-client.ts#L53)

Override fetch method. Uses 'graphql-request' library default otherwise ('cross-fetch').

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/core/src/graphql-request-client.ts:70](https://github.com/Sitecore/content-sdk/blob/3746e90462f2207927cf04da92b0c6dc4ff879fc/packages/core/src/graphql-request-client.ts#L70)

Custom headers to be sent with each request.

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/core/src/graphql-request-client.ts:61](https://github.com/Sitecore/content-sdk/blob/3746e90462f2207927cf04da92b0c6dc4ff879fc/packages/core/src/graphql-request-client.ts#L61)

Number of retries for client. Will use the specified `retryStrategy`.

***

### retryStrategy?

> `optional` **retryStrategy**: [`RetryStrategy`](../interfaces/RetryStrategy.md)

Defined in: [packages/core/src/graphql-request-client.ts:66](https://github.com/Sitecore/content-sdk/blob/3746e90462f2207927cf04da92b0c6dc4ff879fc/packages/core/src/graphql-request-client.ts#L66)

Retry strategy for the client. Uses `DefaultRetryStrategy` by default with exponential
back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/core/src/graphql-request-client.ts:57](https://github.com/Sitecore/content-sdk/blob/3746e90462f2207927cf04da92b0c6dc4ff879fc/packages/core/src/graphql-request-client.ts#L57)

GraphQLClient request timeout (in milliseconds).
