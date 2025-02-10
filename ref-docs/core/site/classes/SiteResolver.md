[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / SiteResolver

# Class: SiteResolver

Defined in: [packages/core/src/site/site-resolver.ts:9](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/core/src/site/site-resolver.ts#L9)

Resolves site based on the provided host or site name

## Constructors

### new SiteResolver()

> **new SiteResolver**(`sites`): [`SiteResolver`](SiteResolver.md)

Defined in: [packages/core/src/site/site-resolver.ts:13](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/core/src/site/site-resolver.ts#L13)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sites` | [`SiteInfo`](../type-aliases/SiteInfo.md)[] | Array of sites to be used in resolution |

#### Returns

[`SiteResolver`](SiteResolver.md)

## Properties

### sites

> `readonly` **sites**: [`SiteInfo`](../type-aliases/SiteInfo.md)[]

Defined in: [packages/core/src/site/site-resolver.ts:13](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/core/src/site/site-resolver.ts#L13)

Array of sites to be used in resolution

## Methods

### getByHost()

> **getByHost**(`hostName`): [`SiteInfo`](../type-aliases/SiteInfo.md)

Defined in: [packages/core/src/site/site-resolver.ts:21](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/core/src/site/site-resolver.ts#L21)

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

> **getByName**(`siteName`): [`SiteInfo`](../type-aliases/SiteInfo.md)

Defined in: [packages/core/src/site/site-resolver.ts:36](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/core/src/site/site-resolver.ts#L36)

Resolve site by site name

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `siteName` | `string` | the site name |

#### Returns

[`SiteInfo`](../type-aliases/SiteInfo.md)

the resolved site

#### Throws

if a matching site is not found

***

### getHostMap()

> `protected` **getHostMap**(): `Map`\<`string`, [`SiteInfo`](../type-aliases/SiteInfo.md)\>

Defined in: [packages/core/src/site/site-resolver.ts:48](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/core/src/site/site-resolver.ts#L48)

#### Returns

`Map`\<`string`, [`SiteInfo`](../type-aliases/SiteInfo.md)\>

***

### matchesPattern()

> `protected` **matchesPattern**(`hostname`, `pattern`): `boolean`

Defined in: [packages/core/src/site/site-resolver.ts:80](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/core/src/site/site-resolver.ts#L80)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `hostname` | `string` |
| `pattern` | `string` |

#### Returns

`boolean`
