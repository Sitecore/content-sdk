[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / GraphQLRequestClientConfig

# Type Alias: GraphQLRequestClientConfig

> **GraphQLRequestClientConfig** = `object`

Defined in: [packages/core/src/graphql-request-client.ts:34](https://github.com/Sitecore/content-sdk/blob/eb3a033122ca57fc4562bef04a2d36e3fbd30f7c/packages/core/src/graphql-request-client.ts#L34)

Minimum configuration options for classes that implement

## See

GraphQLClient

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/core/src/graphql-request-client.ts:38](https://github.com/Sitecore/content-sdk/blob/eb3a033122ca57fc4562bef04a2d36e3fbd30f7c/packages/core/src/graphql-request-client.ts#L38)

The API key to use for authentication. This will be added as an 'sc_apikey' header.

***

### debugger?

> `optional` **debugger**: [`Debugger`](Debugger.md)

Defined in: [packages/core/src/graphql-request-client.ts:42](https://github.com/Sitecore/content-sdk/blob/eb3a033122ca57fc4562bef04a2d36e3fbd30f7c/packages/core/src/graphql-request-client.ts#L42)

Override debugger for logging. Uses 'core:http' by default.

***

### fetch?

> `optional` **fetch**: *typeof* `fetch`

Defined in: [packages/core/src/graphql-request-client.ts:46](https://github.com/Sitecore/content-sdk/blob/eb3a033122ca57fc4562bef04a2d36e3fbd30f7c/packages/core/src/graphql-request-client.ts#L46)

Override fetch method. Uses 'graphql-request' library default otherwise ('cross-fetch').

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/core/src/graphql-request-client.ts:63](https://github.com/Sitecore/content-sdk/blob/eb3a033122ca57fc4562bef04a2d36e3fbd30f7c/packages/core/src/graphql-request-client.ts#L63)

Custom headers to be sent with each request.

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/core/src/graphql-request-client.ts:54](https://github.com/Sitecore/content-sdk/blob/eb3a033122ca57fc4562bef04a2d36e3fbd30f7c/packages/core/src/graphql-request-client.ts#L54)

Number of retries for client. Will use the specified `retryStrategy`.

***

### retryStrategy?

> `optional` **retryStrategy**: [`RetryStrategy`](../interfaces/RetryStrategy.md)

Defined in: [packages/core/src/graphql-request-client.ts:59](https://github.com/Sitecore/content-sdk/blob/eb3a033122ca57fc4562bef04a2d36e3fbd30f7c/packages/core/src/graphql-request-client.ts#L59)

Retry strategy for the client. Uses `DefaultRetryStrategy` by default with exponential
back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/core/src/graphql-request-client.ts:50](https://github.com/Sitecore/content-sdk/blob/eb3a033122ca57fc4562bef04a2d36e3fbd30f7c/packages/core/src/graphql-request-client.ts#L50)

GraphQLClient request timeout (in milliseconds).
