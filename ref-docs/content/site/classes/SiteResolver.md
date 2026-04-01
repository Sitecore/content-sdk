[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / SiteResolver

# Class: SiteResolver

Defined in: [content/src/site/site-resolver.ts:13](https://github.com/Sitecore/content-sdk/blob/0ae7ff2b415bcf81d01745bfcd179fc1062f369e/packages/content/src/site/site-resolver.ts#L13)

Resolves site based on the provided host or site name

## Constructors

### Constructor

> **new SiteResolver**(`sites`): `SiteResolver`

Defined in: [content/src/site/site-resolver.ts:17](https://github.com/Sitecore/content-sdk/blob/0ae7ff2b415bcf81d01745bfcd179fc1062f369e/packages/content/src/site/site-resolver.ts#L17)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sites` | [`SiteInfo`](../type-aliases/SiteInfo.md)[] | Array of sites to be used in resolution |

#### Returns

`SiteResolver`

## Properties

### sites

> `readonly` **sites**: [`SiteInfo`](../type-aliases/SiteInfo.md)[]

Defined in: [content/src/site/site-resolver.ts:17](https://github.com/Sitecore/content-sdk/blob/0ae7ff2b415bcf81d01745bfcd179fc1062f369e/packages/content/src/site/site-resolver.ts#L17)

Array of sites to be used in resolution

## Methods

### getByHost()

> **getByHost**(`hostName`): [`SiteInfo`](../type-aliases/SiteInfo.md)

Defined in: [content/src/site/site-resolver.ts:25](https://github.com/Sitecore/content-sdk/blob/0ae7ff2b415bcf81d01745bfcd179fc1062f369e/packages/content/src/site/site-resolver.ts#L25)

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

> **getByName**(`siteName`): [`SiteInfo`](../type-aliases/SiteInfo.md) \| `undefined`

Defined in: [content/src/site/site-resolver.ts:39](https://github.com/Sitecore/content-sdk/blob/0ae7ff2b415bcf81d01745bfcd179fc1062f369e/packages/content/src/site/site-resolver.ts#L39)

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

> `protected` **getHostMap**(): `Map`\<`string`, [`SiteInfo`](../type-aliases/SiteInfo.md)\>

Defined in: [content/src/site/site-resolver.ts:47](https://github.com/Sitecore/content-sdk/blob/0ae7ff2b415bcf81d01745bfcd179fc1062f369e/packages/content/src/site/site-resolver.ts#L47)

#### Returns

`Map`\<`string`, [`SiteInfo`](../type-aliases/SiteInfo.md)\>

***

### matchesPattern()

> `protected` **matchesPattern**(`hostname`, `pattern`): `boolean`

Defined in: [content/src/site/site-resolver.ts:76](https://github.com/Sitecore/content-sdk/blob/0ae7ff2b415bcf81d01745bfcd179fc1062f369e/packages/content/src/site/site-resolver.ts#L76)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `hostname` | `string` |
| `pattern` | `string` |

#### Returns

`boolean`
