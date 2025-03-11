[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / GraphQLDictionaryServiceConfig

# Interface: GraphQLDictionaryServiceConfig

Defined in: core/types/i18n/graphql-dictionary-service.d.ts:48

Configuration options for

## See

GraphQLDictionaryService instances

## Extends

- [`CacheOptions`](CacheOptions.md).`GraphQLServiceConfig`

## Properties

### cacheEnabled?

> `optional` **cacheEnabled**: `boolean`

Defined in: core/types/cache-client.d.ts:28

Enable/disable caching mechanism

#### Default

```ts
true
```

#### Inherited from

[`CacheOptions`](CacheOptions.md).[`cacheEnabled`](CacheOptions.md#cacheenabled)

***

### cacheTimeout?

> `optional` **cacheTimeout**: `number`

Defined in: core/types/cache-client.d.ts:33

Cache timeout (sec)

#### Default

```ts
60
```

#### Inherited from

[`CacheOptions`](CacheOptions.md).[`cacheTimeout`](CacheOptions.md#cachetimeout)

***

### clientFactory

> **clientFactory**: `GraphQLRequestClientFactory`

Defined in: core/types/i18n/graphql-dictionary-service.d.ts:53

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

#### Overrides

`GraphQLServiceConfig.clientFactory`

***

### debugger?

> `optional` **debugger**: `Debugger`

Defined in: core/types/sitecore-service-base.d.ts:12

Optional debug logger override

#### Inherited from

`GraphQLServiceConfig.debugger`

***

### dictionaryEntryTemplateId?

> `optional` **dictionaryEntryTemplateId**: `string`

Defined in: core/types/i18n/graphql-dictionary-service.d.ts:58

Optional. The template ID to use when searching for dictionary entries.

#### Default

```ts
'6d1cd89719364a3aa511289a94c2a7b1' (/sitecore/templates/System/Dictionary/Dictionary entry)
```

***

### jssAppTemplateId?

> `optional` **jssAppTemplateId**: `string`

Defined in: core/types/i18n/graphql-dictionary-service.d.ts:63

Optional. The template ID of a JSS App to use when searching for the appRootId.

#### Default

```ts
'061cba1554744b918a0617903b102b82' (/sitecore/templates/Foundation/JavaScript Services/App)
```

***

### pageSize?

> `optional` **pageSize**: `number`

Defined in: core/types/i18n/graphql-dictionary-service.d.ts:70

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

Defined in: core/types/config/models.d.ts:70

Retry configuration applied to Layout, Dictionary and ErrorPages services out of the box

#### count?

> `optional` **count**: `number`

Number of retries for graphql client. Will use the specified `retryStrategy`.

##### Default

```ts
3
```

#### retryStrategy?

> `optional` **retryStrategy**: `RetryStrategy`

Retry strategy for the client. By default, uses exponential
back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.

##### Default

```ts
DefaultRetryStrategy
```

#### Inherited from

`GraphQLServiceConfig.retries`
