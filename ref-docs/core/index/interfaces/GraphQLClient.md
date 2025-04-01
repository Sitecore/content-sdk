[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / GraphQLClient

# Interface: GraphQLClient

Defined in: [packages/core/src/graphql-request-client.ts:12](https://github.com/Sitecore/xmc-jss-dev/blob/2d716c1b15bc7f650cb9eb490f393fec3b1f4809/packages/core/src/graphql-request-client.ts#L12)

An interface for GraphQL clients for Sitecore APIs

## Methods

### request()

> **request**\<`T`\>(`query`, `variables`?, `options`?): `Promise`\<`T`\>

Defined in: [packages/core/src/graphql-request-client.ts:18](https://github.com/Sitecore/xmc-jss-dev/blob/2d716c1b15bc7f650cb9eb490f393fec3b1f4809/packages/core/src/graphql-request-client.ts#L18)

Execute graphql request

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `query` | `string` \| `DocumentNode` | graphql query |
| `variables`? | \{\} | - |
| `options`? | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | options and variables for configuring a GraphQL request. |

#### Returns

`Promise`\<`T`\>
