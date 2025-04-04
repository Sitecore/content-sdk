[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [i18n](../README.md) / GraphQLDictionaryServiceConfig

# Interface: GraphQLDictionaryServiceConfig

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:86](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/core/src/i18n/graphql-dictionary-service.ts#L86)

Configuration options for

## See

GraphQLDictionaryService instances

## Extends

- [`CacheOptions`](../../index/interfaces/CacheOptions.md).`GraphQLServiceConfig`

## Properties

### cacheEnabled?

> `optional` **cacheEnabled**: `boolean`

Defined in: [packages/core/src/cache-client.ts:40](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/core/src/cache-client.ts#L40)

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

Defined in: [packages/core/src/cache-client.ts:45](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/core/src/cache-client.ts#L45)

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

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:91](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/core/src/i18n/graphql-dictionary-service.ts#L91)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

#### Overrides

`GraphQLServiceConfig.clientFactory`

***

### debugger?

> `optional` **debugger**: `Debugger`

Defined in: [packages/core/src/sitecore-service-base.ts:14](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/core/src/sitecore-service-base.ts#L14)

Optional debug logger override

#### Inherited from

`GraphQLServiceConfig.debugger`

***

### dictionaryEntryTemplateId?

> `optional` **dictionaryEntryTemplateId**: `string`

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:97](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/core/src/i18n/graphql-dictionary-service.ts#L97)

Optional. The template ID to use when searching for dictionary entries.

#### Default

```ts
'6d1cd89719364a3aa511289a94c2a7b1' (/sitecore/templates/System/Dictionary/Dictionary entry)
```

***

### jssAppTemplateId?

> `optional` **jssAppTemplateId**: `string`

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:103](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/core/src/i18n/graphql-dictionary-service.ts#L103)

Optional. The template ID of a JSS App to use when searching for the appRootId.

#### Default

```ts
'061cba1554744b918a0617903b102b82' (/sitecore/templates/Foundation/JavaScript Services/App)
```

***

### pageSize?

> `optional` **pageSize**: `number`

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:110](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/core/src/i18n/graphql-dictionary-service.ts#L110)

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

Defined in: [packages/core/src/config/models.ts:77](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/core/src/config/models.ts#L77)

Retry configuration applied to Layout, Dictionary and ErrorPages services out of the box

#### count?

> `optional` **count**: `number`

Number of retries for graphql client. Will use the specified `retryStrategy`.

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
