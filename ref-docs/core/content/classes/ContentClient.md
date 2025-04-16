[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / ContentClient

# Class: ContentClient

Defined in: [packages/core/src/content/content-client.ts:26](https://github.com/Sitecore/content-sdk/blob/8c45c5a4d77502417a7ac54d5a26d90faede3b66/packages/core/src/content/content-client.ts#L26)

Class representing a client for interacting with the Content API.

## Constructors

### new ContentClient()

> **new ContentClient**(`__namedParameters`): [`ContentClient`](ContentClient.md)

Defined in: [packages/core/src/content/content-client.ts:30](https://github.com/Sitecore/content-sdk/blob/8c45c5a4d77502417a7ac54d5a26d90faede3b66/packages/core/src/content/content-client.ts#L30)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`ContentClientOptions`](../interfaces/ContentClientOptions.md) |

#### Returns

[`ContentClient`](ContentClient.md)

## Properties

### endpoint

> **endpoint**: `string`

Defined in: [packages/core/src/content/content-client.ts:27](https://github.com/Sitecore/content-sdk/blob/8c45c5a4d77502417a7ac54d5a26d90faede3b66/packages/core/src/content/content-client.ts#L27)

***

### graphqlClient

> **graphqlClient**: [`GraphQLRequestClient`](../../index/classes/GraphQLRequestClient.md)

Defined in: [packages/core/src/content/content-client.ts:28](https://github.com/Sitecore/content-sdk/blob/8c45c5a4d77502417a7ac54d5a26d90faede3b66/packages/core/src/content/content-client.ts#L28)

## Methods

### get()

> **get**\<`T`\>(`query`, `variables`, `options`): `Promise`\<`T`\>

Defined in: [packages/core/src/content/content-client.ts:94](https://github.com/Sitecore/content-sdk/blob/8c45c5a4d77502417a7ac54d5a26d90faede3b66/packages/core/src/content/content-client.ts#L94)

Execute graphql request

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `query` | `string` \| `DocumentNode` | graphql query |
| `variables` | `Record`\<`string`, `unknown`\> | variables for the query |
| `options` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | options for configuring the request |

#### Returns

`Promise`\<`T`\>

response data

***

### createClient()

> `static` **createClient**(`options`?): [`ContentClient`](ContentClient.md)

Defined in: [packages/core/src/content/content-client.ts:57](https://github.com/Sitecore/content-sdk/blob/8c45c5a4d77502417a7ac54d5a26d90faede3b66/packages/core/src/content/content-client.ts#L57)

Factory method for creating a ContentClient instance. This method allows you to create a client with the values populated from environment variables or provided as arguments.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options`? | `Partial`\<[`ContentClientOptions`](../interfaces/ContentClientOptions.md)\> | client configuration options |

#### Returns

[`ContentClient`](ContentClient.md)

ContentClient instance

#### Throws

If tenant or token is not provided
