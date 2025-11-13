[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / ContentClient

# Class: ContentClient

Defined in: [packages/core/src/content/content-client.ts:39](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/content/content-client.ts#L39)

Class representing a client for interacting with the Content API.

## Constructors

### Constructor

> **new ContentClient**(`__namedParameters`): `ContentClient`

Defined in: [packages/core/src/content/content-client.ts:43](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/content/content-client.ts#L43)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`ContentClientOptions`](../interfaces/ContentClientOptions.md) |

#### Returns

`ContentClient`

## Properties

### endpoint

> **endpoint**: `string`

Defined in: [packages/core/src/content/content-client.ts:40](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/content/content-client.ts#L40)

***

### graphqlClient

> **graphqlClient**: [`GraphQLRequestClient`](../../index/classes/GraphQLRequestClient.md)

Defined in: [packages/core/src/content/content-client.ts:41](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/content/content-client.ts#L41)

## Methods

### get()

> **get**\<`T`\>(`query`, `variables`, `options`): `Promise`\<`T`\>

Defined in: [packages/core/src/content/content-client.ts:107](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/content/content-client.ts#L107)

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

Defined in: [packages/core/src/content/content-client.ts:121](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/content/content-client.ts#L121)

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

Defined in: [packages/core/src/content/content-client.ts:132](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/content/content-client.ts#L132)

Retrieves all available locales from the content service.

#### Returns

`Promise`\<[`Locale`](../type-aliases/Locale.md)[]\>

A promise that resolves to an array of locales.

***

### getTaxonomies()

> **getTaxonomies**(`options?`): `Promise`\<\{ `cursor`: `undefined` \| `string`; `hasMore`: `boolean`; `results`: `object`[]; \}\>

Defined in: [packages/core/src/content/content-client.ts:146](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/content/content-client.ts#L146)

Retrieves all available taxonomies with optional pagination support.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \{ `after?`: `string`; `pageSize?`: `number`; \} | Optional pagination options. |
| `options.after?` | `string` | Cursor for pagination; use the `cursor` returned from the previous call to fetch the next page. |
| `options.pageSize?` | `number` | Limits the number of taxonomies returned per page. Defaults to the API's default |

#### Returns

`Promise`\<\{ `cursor`: `undefined` \| `string`; `hasMore`: `boolean`; `results`: `object`[]; \}\>

A promise that resolves to an object containing taxonomies, their terms, and pagination info.

***

### getTaxonomy()

> **getTaxonomy**(`options`): `Promise`\<`null` \| [`Taxonomy`](../type-aliases/Taxonomy.md)\>

Defined in: [packages/core/src/content/content-client.ts:180](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/content/content-client.ts#L180)

Retrieves a taxonomy by its ID, with optional pagination support for its terms.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | \{ `id`: `string`; `terms?`: \{ `after?`: `string`; `pageSize?`: `number`; \}; \} | Options for fetching the taxonomy. |
| `options.id` | `string` | The unique identifier of the taxonomy. |
| `options.terms?` | \{ `after?`: `string`; `pageSize?`: `number`; \} | Optional pagination options for terms. |
| `options.terms.after?` | `string` | Optional. Cursor for pagination. Used to fetch the next page of terms. |
| `options.terms.pageSize?` | `number` | Optional. Limits the number of terms returned per page. |

#### Returns

`Promise`\<`null` \| [`Taxonomy`](../type-aliases/Taxonomy.md)\>

A promise that resolves to the taxonomy object, including pagination metadata (`hasMore`, `cursor`) for its terms. Returns `null` if the taxonomy is not found.

***

### createClient()

> `static` **createClient**(`options?`): `ContentClient`

Defined in: [packages/core/src/content/content-client.ts:70](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/content/content-client.ts#L70)

Factory method for creating a ContentClient instance. This method allows you to create a client with the values populated from environment variables or provided as arguments.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | `Partial`\<[`ContentClientOptions`](../interfaces/ContentClientOptions.md)\> | client configuration options |

#### Returns

`ContentClient`

ContentClient instance

#### Throws

If tenant or token is not provided
