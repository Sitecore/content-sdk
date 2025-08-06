[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / FetchOptions

# Type Alias: FetchOptions

> **FetchOptions** = `object`

<<<<<<< HEAD
Defined in: [packages/core/src/models.ts:69](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/models.ts#L69)
=======
Defined in: [packages/core/src/models.ts:69](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/models.ts#L69)
>>>>>>> dd686bb50 (Update API docs)

## Properties

### debugger?

> `optional` **debugger**: `Debugger`

<<<<<<< HEAD
Defined in: [packages/core/src/models.ts:89](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/models.ts#L89)
=======
Defined in: [packages/core/src/models.ts:89](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/models.ts#L89)
>>>>>>> dd686bb50 (Update API docs)

Override debugger for logging. Uses 'content-sdk:http' by default.

***

### fetch?

> `optional` **fetch**: *typeof* `fetch`

<<<<<<< HEAD
Defined in: [packages/core/src/models.ts:81](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/models.ts#L81)
=======
Defined in: [packages/core/src/models.ts:81](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/models.ts#L81)
>>>>>>> dd686bb50 (Update API docs)

Override to replace default nodeJS fetch implementation

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

<<<<<<< HEAD
Defined in: [packages/core/src/models.ts:85](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/models.ts#L85)
=======
Defined in: [packages/core/src/models.ts:85](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/models.ts#L85)
>>>>>>> dd686bb50 (Update API docs)

Custom headers to be sent with each request.

***

### retries?

> `optional` **retries**: `number`

<<<<<<< HEAD
Defined in: [packages/core/src/models.ts:73](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/models.ts#L73)
=======
Defined in: [packages/core/src/models.ts:73](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/models.ts#L73)
>>>>>>> dd686bb50 (Update API docs)

Number of retries GraphQL client will attempt on request error

***

### retryStrategy?

> `optional` **retryStrategy**: [`RetryStrategy`](../../index/interfaces/RetryStrategy.md)

<<<<<<< HEAD
Defined in: [packages/core/src/models.ts:77](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/models.ts#L77)
=======
Defined in: [packages/core/src/models.ts:77](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/models.ts#L77)
>>>>>>> dd686bb50 (Update API docs)

Retry strategy instance
