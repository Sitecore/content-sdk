[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [client](../README.md) / GraphQLRequestClientConfig

# Type Alias: GraphQLRequestClientConfig

> **GraphQLRequestClientConfig** = `object`

Defined in: core/types/graphql-request-client.d.ts:29

Minimum configuration options for classes that implement

## See

GraphQLClient

## Properties

### apiKey?

> `optional` **apiKey?**: `string`

Defined in: core/types/graphql-request-client.d.ts:33

The API key to use for authentication. This will be added as an 'sc_apikey' header.

***

### contextId?

> `optional` **contextId?**: `string`

Defined in: core/types/graphql-request-client.d.ts:37

A unified identifier used to connect and retrieve data from XM Cloud instance

***

### debugger?

> `optional` **debugger?**: `Debugger`

Defined in: core/types/graphql-request-client.d.ts:41

Override debugger for logging. Uses 'content-sdk:http' by default.

***

### fetch?

> `optional` **fetch?**: *typeof* `fetch`

Defined in: core/types/graphql-request-client.d.ts:45

Override fetch method. Defaults to global `fetch` to avoid `graphql-request`'s node-fetch path (DEP0169).

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: core/types/graphql-request-client.d.ts:62

Custom headers to be sent with each request.

***

### retries?

> `optional` **retries?**: `number`

Defined in: core/types/graphql-request-client.d.ts:53

Number of retries for client. Will use the specified `retryStrategy`.

***

### retryStrategy?

> `optional` **retryStrategy?**: [`RetryStrategy`](../interfaces/RetryStrategy.md)

Defined in: core/types/graphql-request-client.d.ts:58

Retry strategy for the client. Uses `DefaultRetryStrategy` by default with exponential
back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: core/types/graphql-request-client.d.ts:49

GraphQLClient request timeout (in milliseconds).
