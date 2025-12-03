[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / SiteResolver

# Class: SiteResolver

Defined in: [packages/core/src/site/site-resolver.ts:10](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/core/src/site/site-resolver.ts#L10)

Resolves site based on the provided host or site name

## Constructors

### Constructor

> **new SiteResolver**(`sites`): `SiteResolver`

Defined in: [packages/core/src/site/site-resolver.ts:14](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/core/src/site/site-resolver.ts#L14)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sites` | [`SiteInfo`](../type-aliases/SiteInfo.md)[] | Array of sites to be used in resolution |

#### Returns

`SiteResolver`

## Properties

### sites

> `readonly` **sites**: [`SiteInfo`](../type-aliases/SiteInfo.md)[]

Defined in: [packages/core/src/site/site-resolver.ts:14](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/core/src/site/site-resolver.ts#L14)

Array of sites to be used in resolution

## Methods

### getByHost()

> **getByHost**(`hostName`): [`SiteInfo`](../type-aliases/SiteInfo.md)

Defined in: [packages/core/src/site/site-resolver.ts:22](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/core/src/site/site-resolver.ts#L22)

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

Defined in: [packages/core/src/site/site-resolver.ts:36](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/core/src/site/site-resolver.ts#L36)

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

Defined in: [packages/core/src/site/site-resolver.ts:44](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/core/src/site/site-resolver.ts#L44)

#### Returns

`Map`\<`string`, [`SiteInfo`](../type-aliases/SiteInfo.md)\>

***

### matchesPattern()

> `protected` **matchesPattern**(`hostname`, `pattern`): `boolean`

Defined in: [packages/core/src/site/site-resolver.ts:73](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/core/src/site/site-resolver.ts#L73)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `hostname` | `string` |
| `pattern` | `string` |

#### Returns

`boolean`
