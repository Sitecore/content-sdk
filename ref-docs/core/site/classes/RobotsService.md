[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / RobotsService

# Class: RobotsService

<<<<<<< HEAD
Defined in: [packages/core/src/site/robots-service.ts:37](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/robots-service.ts#L37)
=======
Defined in: [packages/core/src/site/robots-service.ts:37](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/robots-service.ts#L37)
>>>>>>> dd686bb50 (Update API docs)

Service that fetch the robots.txt data using Sitecore's GraphQL API.

## Constructors

### Constructor

> **new RobotsService**(`options`): `RobotsService`

<<<<<<< HEAD
Defined in: [packages/core/src/site/robots-service.ts:44](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/robots-service.ts#L44)
=======
Defined in: [packages/core/src/site/robots-service.ts:44](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/robots-service.ts#L44)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/site/robots-service.ts:44](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/robots-service.ts#L44)
=======
Defined in: [packages/core/src/site/robots-service.ts:44](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/robots-service.ts#L44)
>>>>>>> dd686bb50 (Update API docs)

instance

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

<<<<<<< HEAD
Defined in: [packages/core/src/site/robots-service.ts:48](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/robots-service.ts#L48)
=======
Defined in: [packages/core/src/site/robots-service.ts:48](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/robots-service.ts#L48)
>>>>>>> dd686bb50 (Update API docs)

##### Returns

`string`

## Methods

### fetchRobots()

> **fetchRobots**(`fetchOptions?`): `Promise`\<`string`\>

<<<<<<< HEAD
Defined in: [packages/core/src/site/robots-service.ts:58](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/robots-service.ts#L58)
=======
Defined in: [packages/core/src/site/robots-service.ts:58](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/robots-service.ts#L58)
>>>>>>> dd686bb50 (Update API docs)

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

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

<<<<<<< HEAD
Defined in: [packages/core/src/site/robots-service.ts:87](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/robots-service.ts#L87)
=======
Defined in: [packages/core/src/site/robots-service.ts:87](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/robots-service.ts#L87)
>>>>>>> dd686bb50 (Update API docs)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation
