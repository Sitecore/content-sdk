[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [graphql](../README.md) / SearchQueryVariables

# Interface: SearchQueryVariables

Defined in: [packages/core/src/graphql/search-service.ts:39](https://github.com/Sitecore/xmc-jss-dev/blob/ecfb4b66ff16c45f596cda74396c27d7d39de5a5/packages/core/src/graphql/search-service.ts#L39)

Describes the variables used by the 'search' query. Language should always be specified.
The other predicates are optional.

## Properties

### language

> **language**: `string`

Defined in: [packages/core/src/graphql/search-service.ts:43](https://github.com/Sitecore/xmc-jss-dev/blob/ecfb4b66ff16c45f596cda74396c27d7d39de5a5/packages/core/src/graphql/search-service.ts#L43)

Required. The language versions to search for. Fetch pages that have versions in this language.

***

### pageSize?

> `optional` **pageSize**: `number`

Defined in: [packages/core/src/graphql/search-service.ts:61](https://github.com/Sitecore/xmc-jss-dev/blob/ecfb4b66ff16c45f596cda74396c27d7d39de5a5/packages/core/src/graphql/search-service.ts#L61)

common variable for all GraphQL queries
it will be used for every type of query to regulate result batch size
Optional. How many result items to fetch in each GraphQL call. This is needed for pagination.

#### Default

```ts
10
```

***

### rootItemId?

> `optional` **rootItemId**: `string`

Defined in: [packages/core/src/graphql/search-service.ts:48](https://github.com/Sitecore/xmc-jss-dev/blob/ecfb4b66ff16c45f596cda74396c27d7d39de5a5/packages/core/src/graphql/search-service.ts#L48)

Optional. The ID of the search root item. Fetch items that have this item as an ancestor.

***

### templates?

> `optional` **templates**: `string`

Defined in: [packages/core/src/graphql/search-service.ts:53](https://github.com/Sitecore/xmc-jss-dev/blob/ecfb4b66ff16c45f596cda74396c27d7d39de5a5/packages/core/src/graphql/search-service.ts#L53)

Optional. Sitecore template ID(s). Fetch items that inherit from this template(s).
