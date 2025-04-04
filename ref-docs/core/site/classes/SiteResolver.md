[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / SiteResolver

# Class: SiteResolver

Defined in: [packages/core/src/site/site-resolver.ts:9](https://github.com/Sitecore/content-sdk/blob/583ad5957e2a493b98fa21293939a57df8afd235/packages/core/src/site/site-resolver.ts#L9)

Resolves site based on the provided host or site name

## Constructors

### new SiteResolver()

> **new SiteResolver**(`sites`): [`SiteResolver`](SiteResolver.md)

Defined in: [packages/core/src/site/site-resolver.ts:13](https://github.com/Sitecore/content-sdk/blob/583ad5957e2a493b98fa21293939a57df8afd235/packages/core/src/site/site-resolver.ts#L13)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sites` | [`SiteInfo`](../type-aliases/SiteInfo.md)[] | Array of sites to be used in resolution |

#### Returns

[`SiteResolver`](SiteResolver.md)

## Properties

### sites

> `readonly` **sites**: [`SiteInfo`](../type-aliases/SiteInfo.md)[]

Defined in: [packages/core/src/site/site-resolver.ts:13](https://github.com/Sitecore/content-sdk/blob/583ad5957e2a493b98fa21293939a57df8afd235/packages/core/src/site/site-resolver.ts#L13)

Array of sites to be used in resolution

## Methods

### getByHost()

> **getByHost**(`hostName`): [`SiteInfo`](../type-aliases/SiteInfo.md)

Defined in: [packages/core/src/site/site-resolver.ts:21](https://github.com/Sitecore/content-sdk/blob/583ad5957e2a493b98fa21293939a57df8afd235/packages/core/src/site/site-resolver.ts#L21)

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

Defined in: [packages/core/src/site/site-resolver.ts:35](https://github.com/Sitecore/content-sdk/blob/583ad5957e2a493b98fa21293939a57df8afd235/packages/core/src/site/site-resolver.ts#L35)

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

Defined in: [packages/core/src/site/site-resolver.ts:43](https://github.com/Sitecore/content-sdk/blob/583ad5957e2a493b98fa21293939a57df8afd235/packages/core/src/site/site-resolver.ts#L43)

#### Returns

`Map`\<`string`, [`SiteInfo`](../type-aliases/SiteInfo.md)\>

***

### matchesPattern()

> `protected` **matchesPattern**(`hostname`, `pattern`): `boolean`

Defined in: [packages/core/src/site/site-resolver.ts:75](https://github.com/Sitecore/content-sdk/blob/583ad5957e2a493b98fa21293939a57df8afd235/packages/core/src/site/site-resolver.ts#L75)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `hostname` | `string` |
| `pattern` | `string` |

#### Returns

`boolean`
