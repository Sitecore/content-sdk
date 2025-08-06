[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [i18n](../README.md) / DictionaryServiceConfig

# Interface: DictionaryServiceConfig

<<<<<<< HEAD
Defined in: [packages/core/src/i18n/dictionary-service.ts:70](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/i18n/dictionary-service.ts#L70)
=======
Defined in: [packages/core/src/i18n/dictionary-service.ts:70](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/i18n/dictionary-service.ts#L70)
>>>>>>> dd686bb50 (Update API docs)

Configuration options for

## See

DictionaryService instances

## Extends

- [`CacheOptions`](../../index/interfaces/CacheOptions.md).`GraphQLServiceConfig`

## Properties

### cacheEnabled?

> `optional` **cacheEnabled**: `boolean`

<<<<<<< HEAD
Defined in: [packages/core/src/cache-client.ts:40](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/cache-client.ts#L40)
=======
Defined in: [packages/core/src/cache-client.ts:40](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/cache-client.ts#L40)
>>>>>>> dd686bb50 (Update API docs)

Enable/disable caching mechanism

#### Default

```ts
true
```

#### Inherited from

[`CacheOptions`](../../index/interfaces/CacheOptions.md).[`cacheEnabled`](../../index/interfaces/CacheOptions.md#cacheenabled)

***

### cacheTimeout?

> `optional` **cacheTimeout**: `number`

<<<<<<< HEAD
Defined in: [packages/core/src/cache-client.ts:45](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/cache-client.ts#L45)
=======
Defined in: [packages/core/src/cache-client.ts:45](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/cache-client.ts#L45)
>>>>>>> dd686bb50 (Update API docs)

Cache timeout (sec)

#### Default

```ts
60
```

#### Inherited from

[`CacheOptions`](../../index/interfaces/CacheOptions.md).[`cacheTimeout`](../../index/interfaces/CacheOptions.md#cachetimeout)

***

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

<<<<<<< HEAD
Defined in: [packages/core/src/i18n/dictionary-service.ts:75](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/i18n/dictionary-service.ts#L75)
=======
Defined in: [packages/core/src/i18n/dictionary-service.ts:75](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/i18n/dictionary-service.ts#L75)
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

### dictionaryEntryTemplateId?

> `optional` **dictionaryEntryTemplateId**: `string`

<<<<<<< HEAD
Defined in: [packages/core/src/i18n/dictionary-service.ts:81](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/i18n/dictionary-service.ts#L81)
=======
Defined in: [packages/core/src/i18n/dictionary-service.ts:81](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/i18n/dictionary-service.ts#L81)
>>>>>>> dd686bb50 (Update API docs)

Optional. The template ID to use when searching for dictionary entries.

#### Default

```ts
'6d1cd89719364a3aa511289a94c2a7b1' (/sitecore/templates/System/Dictionary/Dictionary entry)
```

***

### pageSize?

> `optional` **pageSize**: `number`

<<<<<<< HEAD
Defined in: [packages/core/src/i18n/dictionary-service.ts:89](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/i18n/dictionary-service.ts#L89)
=======
Defined in: [packages/core/src/i18n/dictionary-service.ts:89](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/i18n/dictionary-service.ts#L89)
>>>>>>> dd686bb50 (Update API docs)

common variable for all GraphQL queries
it will be used for every type of query to regulate result batch size
Optional. How many result items to fetch in each GraphQL call. This is needed for pagination.

#### Default

```ts
10
```

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
