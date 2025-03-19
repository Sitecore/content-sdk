[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / GraphQLSitePathServiceConfig

# Interface: GraphQLSitePathServiceConfig

Defined in: [packages/core/src/site/graphql-sitepath-service.ts:129](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/site/graphql-sitepath-service.ts#L129)

Configuration options for

## See

GraphQLSitePathService instances

## Extends

- `Omit`\<`SiteRouteQueryVariables`, `"language"` \| `"siteName"`\>

## Properties

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

Defined in: [packages/core/src/site/graphql-sitepath-service.ts:141](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/site/graphql-sitepath-service.ts#L141)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

***

### excludedPaths?

> `optional` **excludedPaths**: `string`[]

Defined in: [packages/core/src/site/graphql-sitepath-service.ts:85](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/site/graphql-sitepath-service.ts#L85)

Optional. Paths starting with these provided prefixes will be excluded from returned results.

#### Inherited from

`Omit.excludedPaths`

***

### includedPaths?

> `optional` **includedPaths**: `string`[]

Defined in: [packages/core/src/site/graphql-sitepath-service.ts:81](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/site/graphql-sitepath-service.ts#L81)

Optional. Only paths starting with these provided prefixes will be returned.

#### Inherited from

`Omit.includedPaths`

***

### includePersonalizedRoutes?

> `optional` **includePersonalizedRoutes**: `boolean`

Defined in: [packages/core/src/site/graphql-sitepath-service.ts:136](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/site/graphql-sitepath-service.ts#L136)

A flag for whether to include personalized routes in service output.
Only works on XM Cloud for pages using Embedded Personalization (not Component A/B testing).
Turned off by default.

***

### pageSize?

> `optional` **pageSize**: `number`

Defined in: [packages/core/src/site/graphql-sitepath-service.ts:93](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/site/graphql-sitepath-service.ts#L93)

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

Defined in: [packages/core/src/site/graphql-sitepath-service.ts:142](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/site/graphql-sitepath-service.ts#L142)
