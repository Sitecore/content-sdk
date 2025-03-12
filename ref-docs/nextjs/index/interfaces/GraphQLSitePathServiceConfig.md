[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / GraphQLSitePathServiceConfig

# Interface: GraphQLSitePathServiceConfig

Defined in: core/types/site/graphql-sitepath-service.d.ts:72

Configuration options for

## See

GraphQLSitePathService instances

## Extends

- `Omit`\<`SiteRouteQueryVariables`, `"language"` \| `"siteName"`\>

## Properties

### clientFactory

> **clientFactory**: `GraphQLRequestClientFactory`

Defined in: core/types/site/graphql-sitepath-service.d.ts:83

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

***

### excludedPaths?

> `optional` **excludedPaths**: `string`[]

Defined in: core/types/site/graphql-sitepath-service.d.ts:32

Optional. Paths starting with these provided prefixes will be excluded from returned results.

#### Inherited from

`Omit.excludedPaths`

***

### includedPaths?

> `optional` **includedPaths**: `string`[]

Defined in: core/types/site/graphql-sitepath-service.d.ts:28

Optional. Only paths starting with these provided prefixes will be returned.

#### Inherited from

`Omit.includedPaths`

***

### includePersonalizedRoutes?

> `optional` **includePersonalizedRoutes**: `boolean`

Defined in: core/types/site/graphql-sitepath-service.d.ts:78

A flag for whether to include personalized routes in service output.
Only works on XM Cloud for pages using Embedded Personalization (not Component A/B testing).
Turned off by default.

***

### pageSize?

> `optional` **pageSize**: `number`

Defined in: core/types/site/graphql-sitepath-service.d.ts:39

common variable for all GraphQL queries
it will be used for every type of query to regulate result batch size
Optional. How many result items to fetch in each GraphQL call. This is needed for pagination.

#### Default

```ts
100
```

#### Inherited from

`Omit.pageSize`

***

### sites

> **sites**: [`SiteInfo`](../type-aliases/SiteInfo.md)[]

Defined in: core/types/site/graphql-sitepath-service.d.ts:84
