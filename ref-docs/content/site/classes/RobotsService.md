[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / RobotsService

# Class: RobotsService

Defined in: [content/src/site/robots-service.ts:44](https://github.com/Sitecore/content-sdk/blob/210f354a75bc745a00ce1e1fd340e7f684e24c81/packages/content/src/site/robots-service.ts#L44)

Service that fetch the robots.txt data using Sitecore's GraphQL API.

## Constructors

### Constructor

> **new RobotsService**(`options`): `RobotsService`

Defined in: [content/src/site/robots-service.ts:51](https://github.com/Sitecore/content-sdk/blob/210f354a75bc745a00ce1e1fd340e7f684e24c81/packages/content/src/site/robots-service.ts#L51)

Creates an instance of graphQL robots.txt service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`RobotsServiceConfig`](../type-aliases/RobotsServiceConfig.md) | instance |

#### Returns

`RobotsService`

## Properties

### options

> **options**: [`RobotsServiceConfig`](../type-aliases/RobotsServiceConfig.md)

Defined in: [content/src/site/robots-service.ts:51](https://github.com/Sitecore/content-sdk/blob/210f354a75bc745a00ce1e1fd340e7f684e24c81/packages/content/src/site/robots-service.ts#L51)

instance

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [content/src/site/robots-service.ts:55](https://github.com/Sitecore/content-sdk/blob/210f354a75bc745a00ce1e1fd340e7f684e24c81/packages/content/src/site/robots-service.ts#L55)

##### Returns

`string`

## Methods

### fetchRobots()

> **fetchRobots**(`fetchOptions?`): `Promise`\<`string`\>

Defined in: [content/src/site/robots-service.ts:65](https://github.com/Sitecore/content-sdk/blob/210f354a75bc745a00ce1e1fd340e7f684e24c81/packages/content/src/site/robots-service.ts#L65)

Fetch a data of robots.txt from API

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | The fetch options to be used for the request. |

#### Returns

`Promise`\<`string`\>

text of robots.txt

#### Throws

if the siteName is empty.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

Defined in: [content/src/site/robots-service.ts:94](https://github.com/Sitecore/content-sdk/blob/210f354a75bc745a00ce1e1fd340e7f684e24c81/packages/content/src/site/robots-service.ts#L94)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

implementation
