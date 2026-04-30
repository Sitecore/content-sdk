[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / SiteInfoServiceConfig

# Type Alias: SiteInfoServiceConfig

> **SiteInfoServiceConfig** = `CacheOptions` & `object`

Defined in: [content/src/site/siteinfo-service.ts:22](https://github.com/Sitecore/content-sdk/blob/b76e6169344e65141a96238321b74ef92202b436/packages/content/src/site/siteinfo-service.ts#L22)

Configuration for

## Type Declaration

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

### pageSize?

> `optional` **pageSize**: `number`

common variable for all GraphQL queries
it will be used for every type of query to regulate result batch size
Optional. How many result items to fetch in each GraphQL call. This is needed for pagination.

#### Default

```ts
10
```

## See

SiteInfoService instances
