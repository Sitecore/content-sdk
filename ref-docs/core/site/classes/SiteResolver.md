[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / SiteResolver

# Class: SiteResolver

<<<<<<< HEAD
Defined in: [packages/core/src/site/site-resolver.ts:9](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/site-resolver.ts#L9)
=======
Defined in: [packages/core/src/site/site-resolver.ts:9](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/site-resolver.ts#L9)
>>>>>>> dd686bb50 (Update API docs)

Resolves site based on the provided host or site name

## Constructors

### Constructor

> **new SiteResolver**(`sites`): `SiteResolver`

<<<<<<< HEAD
Defined in: [packages/core/src/site/site-resolver.ts:13](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/site-resolver.ts#L13)
=======
Defined in: [packages/core/src/site/site-resolver.ts:13](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/site-resolver.ts#L13)
>>>>>>> dd686bb50 (Update API docs)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sites` | [`SiteInfo`](../type-aliases/SiteInfo.md)[] | Array of sites to be used in resolution |

#### Returns

`SiteResolver`

## Properties

### sites

> `readonly` **sites**: [`SiteInfo`](../type-aliases/SiteInfo.md)[]

<<<<<<< HEAD
Defined in: [packages/core/src/site/site-resolver.ts:13](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/site-resolver.ts#L13)
=======
Defined in: [packages/core/src/site/site-resolver.ts:13](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/site-resolver.ts#L13)
>>>>>>> dd686bb50 (Update API docs)

Array of sites to be used in resolution

## Methods

### getByHost()

> **getByHost**(`hostName`): [`SiteInfo`](../type-aliases/SiteInfo.md)

<<<<<<< HEAD
Defined in: [packages/core/src/site/site-resolver.ts:21](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/site-resolver.ts#L21)
=======
Defined in: [packages/core/src/site/site-resolver.ts:21](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/site-resolver.ts#L21)
>>>>>>> dd686bb50 (Update API docs)

Resolve site by host name

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hostName` | `string` | the host name |

#### Returns

[`SiteInfo`](../type-aliases/SiteInfo.md)

the resolved site

#### Throws

if a matching site is not found

***

### getByName()

> **getByName**(`siteName`): `undefined` \| [`SiteInfo`](../type-aliases/SiteInfo.md)

<<<<<<< HEAD
Defined in: [packages/core/src/site/site-resolver.ts:35](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/site-resolver.ts#L35)
=======
Defined in: [packages/core/src/site/site-resolver.ts:35](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/site-resolver.ts#L35)
>>>>>>> dd686bb50 (Update API docs)

Resolve site by site name

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `siteName` | `string` | the site name |

#### Returns

`undefined` \| [`SiteInfo`](../type-aliases/SiteInfo.md)

the resolved site or undefined if not found

***

### getHostMap()

> `protected` **getHostMap**(): `Map`\<`string`, [`SiteInfo`](../type-aliases/SiteInfo.md)\>

<<<<<<< HEAD
Defined in: [packages/core/src/site/site-resolver.ts:43](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/site-resolver.ts#L43)
=======
Defined in: [packages/core/src/site/site-resolver.ts:43](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/site-resolver.ts#L43)
>>>>>>> dd686bb50 (Update API docs)

#### Returns

`Map`\<`string`, [`SiteInfo`](../type-aliases/SiteInfo.md)\>

***

### matchesPattern()

> `protected` **matchesPattern**(`hostname`, `pattern`): `boolean`

<<<<<<< HEAD
Defined in: [packages/core/src/site/site-resolver.ts:75](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/site-resolver.ts#L75)
=======
Defined in: [packages/core/src/site/site-resolver.ts:75](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/site-resolver.ts#L75)
>>>>>>> dd686bb50 (Update API docs)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `hostname` | `string` |
| `pattern` | `string` |

#### Returns

`boolean`
