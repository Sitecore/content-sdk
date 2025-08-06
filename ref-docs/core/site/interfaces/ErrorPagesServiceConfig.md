[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / ErrorPagesServiceConfig

# Interface: ErrorPagesServiceConfig

<<<<<<< HEAD
Defined in: [packages/core/src/site/error-pages-service.ts:28](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/error-pages-service.ts#L28)
=======
Defined in: [packages/core/src/site/error-pages-service.ts:28](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/error-pages-service.ts#L28)
>>>>>>> dd686bb50 (Update API docs)

## Extends

- `GraphQLServiceConfig`

## Properties

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

<<<<<<< HEAD
Defined in: [packages/core/src/site/error-pages-service.ts:37](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/error-pages-service.ts#L37)
=======
Defined in: [packages/core/src/site/error-pages-service.ts:37](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/error-pages-service.ts#L37)
>>>>>>> dd686bb50 (Update API docs)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

#### Overrides

`GraphQLServiceConfig.clientFactory`

***

### debugger?

> `optional` **debugger**: `Debugger`

<<<<<<< HEAD
Defined in: [packages/core/src/sitecore-service-base.ts:14](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/sitecore-service-base.ts#L14)
=======
Defined in: [packages/core/src/sitecore-service-base.ts:14](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/sitecore-service-base.ts#L14)
>>>>>>> dd686bb50 (Update API docs)

Optional debug logger override

#### Inherited from

`GraphQLServiceConfig.debugger`

***

### language

> **language**: `string`

<<<<<<< HEAD
Defined in: [packages/core/src/site/error-pages-service.ts:32](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/error-pages-service.ts#L32)
=======
Defined in: [packages/core/src/site/error-pages-service.ts:32](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/error-pages-service.ts#L32)
>>>>>>> dd686bb50 (Update API docs)

The language

***

### retries?

> `optional` **retries**: `object`

<<<<<<< HEAD
Defined in: [packages/core/src/config/models.ts:87](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/config/models.ts#L87)
=======
Defined in: [packages/core/src/config/models.ts:87](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/config/models.ts#L87)
>>>>>>> dd686bb50 (Update API docs)

Retry configuration applied to Layout, Dictionary and ErrorPages services

#### count?

> `optional` **count**: `number`

Number of retries for the GraphQL client.

##### Default

```ts
3
```

#### retryStrategy?

> `optional` **retryStrategy**: [`RetryStrategy`](../../index/interfaces/RetryStrategy.md)

Retry strategy for the client. By default, uses exponential
back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.

##### Default

```ts
DefaultRetryStrategy
```

#### Inherited from

`GraphQLServiceConfig.retries`
