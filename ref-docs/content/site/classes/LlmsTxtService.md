[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / LlmsTxtService

# Class: LlmsTxtService

Defined in: [content/src/site/llms-txt-service.ts:57](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/content/src/site/llms-txt-service.ts#L57)

Service that fetches the llms.txt content managed via Sitecore AI, using Sitecore's GraphQL API.

## Constructors

### Constructor

> **new LlmsTxtService**(`options`): `LlmsTxtService`

Defined in: [content/src/site/llms-txt-service.ts:64](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/content/src/site/llms-txt-service.ts#L64)

Creates an instance of graphQL llms.txt service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`LlmsTxtServiceConfig`](../type-aliases/LlmsTxtServiceConfig.md) | instance |

#### Returns

`LlmsTxtService`

## Properties

### options

> **options**: [`LlmsTxtServiceConfig`](../type-aliases/LlmsTxtServiceConfig.md)

Defined in: [content/src/site/llms-txt-service.ts:64](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/content/src/site/llms-txt-service.ts#L64)

instance

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [content/src/site/llms-txt-service.ts:68](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/content/src/site/llms-txt-service.ts#L68)

##### Returns

`string`

## Methods

### fetchLlmsTxt()

> **fetchLlmsTxt**(`fetchOptions?`): `Promise`\<`string`\>

Defined in: [content/src/site/llms-txt-service.ts:78](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/content/src/site/llms-txt-service.ts#L78)

Fetch a data of llms.txt from API

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | The fetch options to be used for the request. |

#### Returns

`Promise`\<`string`\>

text of llms.txt

#### Throws

if the siteName is empty.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

Defined in: [content/src/site/llms-txt-service.ts:107](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/content/src/site/llms-txt-service.ts#L107)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

implementation
