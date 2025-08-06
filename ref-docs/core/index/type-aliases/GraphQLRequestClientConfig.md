[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / GraphQLRequestClientConfig

# Type Alias: GraphQLRequestClientConfig

> **GraphQLRequestClientConfig** = `object`

<<<<<<< HEAD
Defined in: [packages/core/src/graphql-request-client.ts:34](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/graphql-request-client.ts#L34)
=======
Defined in: [packages/core/src/graphql-request-client.ts:34](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/graphql-request-client.ts#L34)
>>>>>>> dd686bb50 (Update API docs)

Minimum configuration options for classes that implement

## See

GraphQLClient

## Properties

### apiKey?

> `optional` **apiKey**: `string`

<<<<<<< HEAD
Defined in: [packages/core/src/graphql-request-client.ts:38](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/graphql-request-client.ts#L38)
=======
Defined in: [packages/core/src/graphql-request-client.ts:38](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/graphql-request-client.ts#L38)
>>>>>>> dd686bb50 (Update API docs)

The API key to use for authentication. This will be added as an 'sc_apikey' header.

***

### debugger?

> `optional` **debugger**: [`Debugger`](Debugger.md)

<<<<<<< HEAD
Defined in: [packages/core/src/graphql-request-client.ts:42](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/graphql-request-client.ts#L42)
=======
Defined in: [packages/core/src/graphql-request-client.ts:42](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/graphql-request-client.ts#L42)
>>>>>>> dd686bb50 (Update API docs)

Override debugger for logging. Uses 'content-sdk:http' by default.

***

### fetch?

> `optional` **fetch**: *typeof* `fetch`

<<<<<<< HEAD
Defined in: [packages/core/src/graphql-request-client.ts:46](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/graphql-request-client.ts#L46)
=======
Defined in: [packages/core/src/graphql-request-client.ts:46](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/graphql-request-client.ts#L46)
>>>>>>> dd686bb50 (Update API docs)

Override fetch method. Uses 'graphql-request' library default otherwise ('cross-fetch').

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

<<<<<<< HEAD
Defined in: [packages/core/src/graphql-request-client.ts:63](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/graphql-request-client.ts#L63)
=======
Defined in: [packages/core/src/graphql-request-client.ts:63](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/graphql-request-client.ts#L63)
>>>>>>> dd686bb50 (Update API docs)

Custom headers to be sent with each request.

***

### retries?

> `optional` **retries**: `number`

<<<<<<< HEAD
Defined in: [packages/core/src/graphql-request-client.ts:54](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/graphql-request-client.ts#L54)
=======
Defined in: [packages/core/src/graphql-request-client.ts:54](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/graphql-request-client.ts#L54)
>>>>>>> dd686bb50 (Update API docs)

Number of retries for client. Will use the specified `retryStrategy`.

***

### retryStrategy?

> `optional` **retryStrategy**: [`RetryStrategy`](../interfaces/RetryStrategy.md)

<<<<<<< HEAD
Defined in: [packages/core/src/graphql-request-client.ts:59](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/graphql-request-client.ts#L59)
=======
Defined in: [packages/core/src/graphql-request-client.ts:59](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/graphql-request-client.ts#L59)
>>>>>>> dd686bb50 (Update API docs)

Retry strategy for the client. Uses `DefaultRetryStrategy` by default with exponential
back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.

***

### timeout?

> `optional` **timeout**: `number`

<<<<<<< HEAD
Defined in: [packages/core/src/graphql-request-client.ts:50](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/graphql-request-client.ts#L50)
=======
Defined in: [packages/core/src/graphql-request-client.ts:50](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/graphql-request-client.ts#L50)
>>>>>>> dd686bb50 (Update API docs)

GraphQLClient request timeout (in milliseconds).
