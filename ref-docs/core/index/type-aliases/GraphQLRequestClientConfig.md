[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / GraphQLRequestClientConfig

# Type Alias: GraphQLRequestClientConfig

> **GraphQLRequestClientConfig** = `object`

Defined in: [packages/core/src/graphql-request-client.ts:36](https://github.com/Sitecore/content-sdk/blob/f28b4a16c174b08cc6903fe1f81d5bfea7fc028e/packages/core/src/graphql-request-client.ts#L36)

Minimum configuration options for classes that implement

## See

GraphQLClient

## Properties

### apiKey?

> `optional` **apiKey?**: `string`

Defined in: [packages/core/src/graphql-request-client.ts:40](https://github.com/Sitecore/content-sdk/blob/f28b4a16c174b08cc6903fe1f81d5bfea7fc028e/packages/core/src/graphql-request-client.ts#L40)

The API key to use for authentication. This will be added as an 'sc_apikey' header.

***

### contextId?

> `optional` **contextId?**: `string`

Defined in: [packages/core/src/graphql-request-client.ts:44](https://github.com/Sitecore/content-sdk/blob/f28b4a16c174b08cc6903fe1f81d5bfea7fc028e/packages/core/src/graphql-request-client.ts#L44)

A unified identifier used to connect and retrieve data from XM Cloud instance

***

### debugger?

> `optional` **debugger?**: [`Debugger`](Debugger.md)

Defined in: [packages/core/src/graphql-request-client.ts:48](https://github.com/Sitecore/content-sdk/blob/f28b4a16c174b08cc6903fe1f81d5bfea7fc028e/packages/core/src/graphql-request-client.ts#L48)

Override debugger for logging. Uses 'content-sdk:http' by default.

***

### fetch?

> `optional` **fetch?**: *typeof* `fetch`

Defined in: [packages/core/src/graphql-request-client.ts:52](https://github.com/Sitecore/content-sdk/blob/f28b4a16c174b08cc6903fe1f81d5bfea7fc028e/packages/core/src/graphql-request-client.ts#L52)

Override fetch method. Uses 'graphql-request' library default otherwise ('cross-fetch').

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [packages/core/src/graphql-request-client.ts:69](https://github.com/Sitecore/content-sdk/blob/f28b4a16c174b08cc6903fe1f81d5bfea7fc028e/packages/core/src/graphql-request-client.ts#L69)

Custom headers to be sent with each request.

***

### retries?

> `optional` **retries?**: `number`

Defined in: [packages/core/src/graphql-request-client.ts:60](https://github.com/Sitecore/content-sdk/blob/f28b4a16c174b08cc6903fe1f81d5bfea7fc028e/packages/core/src/graphql-request-client.ts#L60)

Number of retries for client. Will use the specified `retryStrategy`.

***

### retryStrategy?

> `optional` **retryStrategy?**: [`RetryStrategy`](../interfaces/RetryStrategy.md)

Defined in: [packages/core/src/graphql-request-client.ts:65](https://github.com/Sitecore/content-sdk/blob/f28b4a16c174b08cc6903fe1f81d5bfea7fc028e/packages/core/src/graphql-request-client.ts#L65)

Retry strategy for the client. Uses `DefaultRetryStrategy` by default with exponential
back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [packages/core/src/graphql-request-client.ts:56](https://github.com/Sitecore/content-sdk/blob/f28b4a16c174b08cc6903fe1f81d5bfea7fc028e/packages/core/src/graphql-request-client.ts#L56)

GraphQLClient request timeout (in milliseconds).
