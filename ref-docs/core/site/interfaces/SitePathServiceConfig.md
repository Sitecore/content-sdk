[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / SitePathServiceConfig

# Interface: SitePathServiceConfig

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitepath-service.ts:129](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitepath-service.ts#L129)
=======
Defined in: [packages/core/src/site/sitepath-service.ts:129](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitepath-service.ts#L129)
>>>>>>> dd686bb50 (Update API docs)

Configuration options for

## See

SitePathService instances

## Extends

- `Omit`\<`SiteRouteQueryVariables`, `"language"` \| `"siteName"`\>

## Properties

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitepath-service.ts:141](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitepath-service.ts#L141)
=======
Defined in: [packages/core/src/site/sitepath-service.ts:141](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitepath-service.ts#L141)
>>>>>>> dd686bb50 (Update API docs)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

***

### excludedPaths?

> `optional` **excludedPaths**: `string`[]

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitepath-service.ts:85](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitepath-service.ts#L85)
=======
Defined in: [packages/core/src/site/sitepath-service.ts:85](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitepath-service.ts#L85)
>>>>>>> dd686bb50 (Update API docs)

Optional. Paths starting with these provided prefixes will be excluded from returned results.

#### Inherited from

`Omit.excludedPaths`

***

### includedPaths?

> `optional` **includedPaths**: `string`[]

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitepath-service.ts:81](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitepath-service.ts#L81)
=======
Defined in: [packages/core/src/site/sitepath-service.ts:81](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitepath-service.ts#L81)
>>>>>>> dd686bb50 (Update API docs)

Optional. Only paths starting with these provided prefixes will be returned.

#### Inherited from

`Omit.includedPaths`

***

### includePersonalizedRoutes?

> `optional` **includePersonalizedRoutes**: `boolean`

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitepath-service.ts:136](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitepath-service.ts#L136)
=======
Defined in: [packages/core/src/site/sitepath-service.ts:136](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitepath-service.ts#L136)
>>>>>>> dd686bb50 (Update API docs)

A flag for whether to include personalized routes in service output.
Only works on XM Cloud for pages using Embedded Personalization (not Component A/B testing).
Turned off by default.

***

### pageSize?

> `optional` **pageSize**: `number`

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitepath-service.ts:93](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitepath-service.ts#L93)
=======
Defined in: [packages/core/src/site/sitepath-service.ts:93](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitepath-service.ts#L93)
>>>>>>> dd686bb50 (Update API docs)

common variable for all GraphQL queries
it will be used for every type of query to regulate result batch size
Optional. How many result items to fetch in each GraphQL call. This is needed for pagination.

#### Default

```ts
100
```

#### Inherited from

`Omit.pageSize`
