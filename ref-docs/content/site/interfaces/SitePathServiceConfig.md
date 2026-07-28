[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / SitePathServiceConfig

# Interface: SitePathServiceConfig

Defined in: [content/src/site/sitepath-service.ts:132](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/content/src/site/sitepath-service.ts#L132)

Configuration options for

## See

SitePathService instances

## Extends

- `Omit`\<`SiteRouteQueryVariables`, `"language"` \| `"siteName"`\>

## Properties

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

Defined in: [content/src/site/sitepath-service.ts:144](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/content/src/site/sitepath-service.ts#L144)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

***

### excludedPaths?

> `optional` **excludedPaths?**: `string`[]

Defined in: [content/src/site/sitepath-service.ts:87](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/content/src/site/sitepath-service.ts#L87)

Optional. Paths starting with these provided prefixes will be excluded from returned results.

#### Inherited from

`Omit.excludedPaths`

***

### includedPaths?

> `optional` **includedPaths?**: `string`[]

Defined in: [content/src/site/sitepath-service.ts:83](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/content/src/site/sitepath-service.ts#L83)

Optional. Only paths starting with these provided prefixes will be returned.

#### Inherited from

`Omit.includedPaths`

***

### includePersonalizedRoutes?

> `optional` **includePersonalizedRoutes?**: `boolean`

Defined in: [content/src/site/sitepath-service.ts:139](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/content/src/site/sitepath-service.ts#L139)

A flag for whether to include personalized routes in service output.
Only works on XM Cloud for pages using Embedded Personalization (not Component A/B testing).
Turned off by default.

***

### pageSize?

> `optional` **pageSize?**: `number`

Defined in: [content/src/site/sitepath-service.ts:95](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/content/src/site/sitepath-service.ts#L95)

common variable for all GraphQL queries
it will be used for every type of query to regulate result batch size
Optional. How many result items to fetch in each GraphQL call. This is needed for pagination.

#### Default

```ts
100
```

#### Inherited from

`Omit.pageSize`
