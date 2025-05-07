[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / ContentClient

# Class: ContentClient

Defined in: [packages/core/src/content/content-client.ts:32](https://github.com/Sitecore/xmc-jss-dev/blob/99b79b70ecdd8272d2885ff915ba6fc798d5fd0a/packages/core/src/content/content-client.ts#L32)

Class representing a client for interacting with the Content API.

## Constructors

### new ContentClient()

> **new ContentClient**(`__namedParameters`): [`ContentClient`](ContentClient.md)

Defined in: [packages/core/src/content/content-client.ts:36](https://github.com/Sitecore/xmc-jss-dev/blob/99b79b70ecdd8272d2885ff915ba6fc798d5fd0a/packages/core/src/content/content-client.ts#L36)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`ContentClientOptions`](../interfaces/ContentClientOptions.md) |

#### Returns

[`ContentClient`](ContentClient.md)

## Properties

### endpoint

> **endpoint**: `string`

Defined in: [packages/core/src/content/content-client.ts:33](https://github.com/Sitecore/xmc-jss-dev/blob/99b79b70ecdd8272d2885ff915ba6fc798d5fd0a/packages/core/src/content/content-client.ts#L33)

***

### graphqlClient

> **graphqlClient**: [`GraphQLRequestClient`](../../index/classes/GraphQLRequestClient.md)

Defined in: [packages/core/src/content/content-client.ts:34](https://github.com/Sitecore/xmc-jss-dev/blob/99b79b70ecdd8272d2885ff915ba6fc798d5fd0a/packages/core/src/content/content-client.ts#L34)

## Methods

### get()

> **get**\<`T`\>(`query`, `variables`, `options`): `Promise`\<`T`\>

Defined in: [packages/core/src/content/content-client.ts:100](https://github.com/Sitecore/xmc-jss-dev/blob/99b79b70ecdd8272d2885ff915ba6fc798d5fd0a/packages/core/src/content/content-client.ts#L100)

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

### getLocale()

> **getLocale**(`id`): `Promise`\<`null` \| [`Locale`](../type-aliases/Locale.md)\>

Defined in: [packages/core/src/content/content-client.ts:116](https://github.com/Sitecore/xmc-jss-dev/blob/99b79b70ecdd8272d2885ff915ba6fc798d5fd0a/packages/core/src/content/content-client.ts#L116)

Retrieves the locale information for a given locale ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the locale item. |

#### Returns

`Promise`\<`null` \| [`Locale`](../type-aliases/Locale.md)\>

A promise that resolves to the locale information associated with the specified locale ID.

***

### getLocales()

> **getLocales**(): `Promise`\<[`Locale`](../type-aliases/Locale.md)[]\>

Defined in: [packages/core/src/content/content-client.ts:128](https://github.com/Sitecore/xmc-jss-dev/blob/99b79b70ecdd8272d2885ff915ba6fc798d5fd0a/packages/core/src/content/content-client.ts#L128)

Retrieves all available locales from the content service.

#### Returns

`Promise`\<[`Locale`](../type-aliases/Locale.md)[]\>

A promise that resolves to an array of locales.

***

### createClient()

> `static` **createClient**(`options`?): [`ContentClient`](ContentClient.md)

Defined in: [packages/core/src/content/content-client.ts:63](https://github.com/Sitecore/xmc-jss-dev/blob/99b79b70ecdd8272d2885ff915ba6fc798d5fd0a/packages/core/src/content/content-client.ts#L63)

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
