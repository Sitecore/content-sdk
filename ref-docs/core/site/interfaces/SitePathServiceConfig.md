[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / SitePathServiceConfig

# Interface: SitePathServiceConfig

Defined in: [packages/core/src/site/sitepath-service.ts:133](https://github.com/Sitecore/content-sdk/blob/beeecbc7e1885b9cc78f1e0821299c2967dd9530/packages/core/src/site/sitepath-service.ts#L133)

Configuration options for

## See

SitePathService instances

## Extends

- `Omit`\<`SiteRouteQueryVariables`, `"language"` \| `"siteName"`\>

## Properties

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

Defined in: [packages/core/src/site/sitepath-service.ts:149](https://github.com/Sitecore/content-sdk/blob/beeecbc7e1885b9cc78f1e0821299c2967dd9530/packages/core/src/site/sitepath-service.ts#L149)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

***

### enableDisplayNameRouting?

> `optional` **enableDisplayNameRouting**: `boolean`

Defined in: [packages/core/src/site/sitepath-service.ts:144](https://github.com/Sitecore/content-sdk/blob/beeecbc7e1885b9cc78f1e0821299c2967dd9530/packages/core/src/site/sitepath-service.ts#L144)

Gets a flag indicating whether display name routing is enabled.

***

### excludedPaths?

> `optional` **excludedPaths**: `string`[]

Defined in: [packages/core/src/site/sitepath-service.ts:88](https://github.com/Sitecore/content-sdk/blob/beeecbc7e1885b9cc78f1e0821299c2967dd9530/packages/core/src/site/sitepath-service.ts#L88)

Optional. Paths starting with these provided prefixes will be excluded from returned results.

#### Inherited from

`Omit.excludedPaths`

***

### includedPaths?

> `optional` **includedPaths**: `string`[]

Defined in: [packages/core/src/site/sitepath-service.ts:84](https://github.com/Sitecore/content-sdk/blob/beeecbc7e1885b9cc78f1e0821299c2967dd9530/packages/core/src/site/sitepath-service.ts#L84)

Optional. Only paths starting with these provided prefixes will be returned.

#### Inherited from

`Omit.includedPaths`

***

### includePersonalizedRoutes?

> `optional` **includePersonalizedRoutes**: `boolean`

Defined in: [packages/core/src/site/sitepath-service.ts:140](https://github.com/Sitecore/content-sdk/blob/beeecbc7e1885b9cc78f1e0821299c2967dd9530/packages/core/src/site/sitepath-service.ts#L140)

A flag for whether to include personalized routes in service output.
Only works on XM Cloud for pages using Embedded Personalization (not Component A/B testing).
Turned off by default.

***

### pageSize?

> `optional` **pageSize**: `number`

Defined in: [packages/core/src/site/sitepath-service.ts:96](https://github.com/Sitecore/content-sdk/blob/beeecbc7e1885b9cc78f1e0821299c2967dd9530/packages/core/src/site/sitepath-service.ts#L96)

common variable for all GraphQL queries
it will be used for every type of query to regulate result batch size
Optional. How many result items to fetch in each GraphQL call. This is needed for pagination.

#### Default

```ts
100
```

#### Inherited from

`Omit.pageSize`
