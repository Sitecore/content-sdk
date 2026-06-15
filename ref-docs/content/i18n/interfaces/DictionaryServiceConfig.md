[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [i18n](../README.md) / DictionaryServiceConfig

# Interface: DictionaryServiceConfig

Defined in: [content/src/i18n/dictionary-service.ts:76](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/content/src/i18n/dictionary-service.ts#L76)

Configuration options for

## See

DictionaryService instances

## Extends

- `CacheOptions`.`GraphQLServiceConfig`

## Properties

### cacheEnabled?

> `optional` **cacheEnabled?**: `boolean`

Defined in: core/types/cache-client.d.ts:30

Enable/disable caching mechanism

#### Default

```ts
true
```

#### Inherited from

`CacheOptions.cacheEnabled`

***

### cacheTimeout?

> `optional` **cacheTimeout?**: `number`

Defined in: core/types/cache-client.d.ts:35

Cache timeout (sec)

#### Default

```ts
60
```

#### Inherited from

`CacheOptions.cacheTimeout`

***

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

Defined in: [content/src/i18n/dictionary-service.ts:81](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/content/src/i18n/dictionary-service.ts#L81)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

#### Overrides

`GraphQLServiceConfig.clientFactory`

***

### debugger?

> `optional` **debugger?**: `Debugger`

Defined in: [content/src/sitecore-service-base.ts:13](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/content/src/sitecore-service-base.ts#L13)

Optional debug logger override

#### Inherited from

`GraphQLServiceConfig.debugger`

***

### dictionaryEntryTemplateId?

> `optional` **dictionaryEntryTemplateId?**: `string`

Defined in: [content/src/i18n/dictionary-service.ts:87](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/content/src/i18n/dictionary-service.ts#L87)

Optional. The template ID to use when searching for dictionary entries.

#### Default

```ts
'6d1cd89719364a3aa511289a94c2a7b1' (/sitecore/templates/System/Dictionary/Dictionary entry)
```

***

### pageSize?

> `optional` **pageSize?**: `number`

Defined in: [content/src/i18n/dictionary-service.ts:95](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/content/src/i18n/dictionary-service.ts#L95)

common variable for all GraphQL queries
it will be used for every type of query to regulate result batch size
Optional. How many result items to fetch in each GraphQL call. This is needed for pagination.

#### Default

```ts
10
```

***

### retries?

> `optional` **retries?**: `object`

Defined in: [content/src/config/models.ts:88](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/content/src/config/models.ts#L88)

Retry configuration applied to Layout, Dictionary and ErrorPages services

#### count?

> `optional` **count?**: `number`

Number of retries for the GraphQL client.

##### Default

```ts
3
```

#### retryStrategy?

> `optional` **retryStrategy?**: [`RetryStrategy`](../../client/interfaces/RetryStrategy.md)

Retry strategy for the client. By default, uses exponential
back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.

##### Default

```ts
DefaultRetryStrategy
```

#### Inherited from

`GraphQLServiceConfig.retries`
