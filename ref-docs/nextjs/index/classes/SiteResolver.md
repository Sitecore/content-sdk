[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / SiteResolver

# Class: SiteResolver

Defined in: content/types/site/site-resolver.d.ts:6

Resolves site based on the provided host or site name

## Constructors

### Constructor

> **new SiteResolver**(`sites`): `SiteResolver`

Defined in: content/types/site/site-resolver.d.ts:11

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sites` | [`SiteInfo`](../type-aliases/SiteInfo.md)[] | Array of sites to be used in resolution |

#### Returns

`SiteResolver`

## Properties

### getByHost()

> **getByHost**: (`hostName`) => [`SiteInfo`](../type-aliases/SiteInfo.md)

Defined in: content/types/site/site-resolver.d.ts:18

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

> **getByName**: (`siteName`) => [`SiteInfo`](../type-aliases/SiteInfo.md) \| `undefined`

Defined in: content/types/site/site-resolver.d.ts:24

Resolve site by site name

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `siteName` | `string` | the site name |

#### Returns

[`SiteInfo`](../type-aliases/SiteInfo.md) \| `undefined`

the resolved site or undefined if not found

***

### getHostMap()

> `protected` **getHostMap**: () => `Map`\<`string`, [`SiteInfo`](../type-aliases/SiteInfo.md)\>

Defined in: content/types/site/site-resolver.d.ts:25

#### Returns

`Map`\<`string`, [`SiteInfo`](../type-aliases/SiteInfo.md)\>

***

### sites

> `readonly` **sites**: [`SiteInfo`](../type-aliases/SiteInfo.md)[]

Defined in: content/types/site/site-resolver.d.ts:7

## Methods

### matchesPattern()

> `protected` **matchesPattern**(`hostname`, `pattern`): `boolean`

Defined in: content/types/site/site-resolver.d.ts:26

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `hostname` | `string` |
| `pattern` | `string` |

#### Returns

`boolean`
