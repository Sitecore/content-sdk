[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [personalize](../README.md) / CdpHelper

# Class: CdpHelper

Defined in: [packages/core/src/personalize/utils.ts:83](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/personalize/utils.ts#L83)

Static utility class for Sitecore CDP

## Constructors

### new CdpHelper()

> **new CdpHelper**(): [`CdpHelper`](CdpHelper.md)

#### Returns

[`CdpHelper`](CdpHelper.md)

## Methods

### getComponentFriendlyId()

> `static` **getComponentFriendlyId**(`pageId`, `componentId`, `language`, `scope`?): `string`

Defined in: [packages/core/src/personalize/utils.ts:130](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/personalize/utils.ts#L130)

Gets the friendly id for Component A/B Testing in the required format `component_[<scope>_]<pageId>_<componentId>_<language>*`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pageId` | `string` | the page id |
| `componentId` | `string` | the component id |
| `language` | `string` | the language |
| `scope`? | `string` | the scope value |

#### Returns

`string`

the friendly id

***

### getPageFriendlyId()

> `static` **getPageFriendlyId**(`pageId`, `language`, `scope`?): `string`

Defined in: [packages/core/src/personalize/utils.ts:115](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/personalize/utils.ts#L115)

Gets the friendly id for (page-level) Embedded Personalization in the required format `embedded_[<scope>_]<id>_<lang>`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pageId` | `string` | the page id |
| `language` | `string` | the language |
| `scope`? | `string` | the scope value |

#### Returns

`string`

the friendly id

***

### getPageVariantId()

> `static` **getPageVariantId**(`pageId`, `language`, `variantId`, `scope`?): `string`

Defined in: [packages/core/src/personalize/utils.ts:92](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/personalize/utils.ts#L92)

Gets the page variant id for CDP in the required format

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pageId` | `string` | the page id |
| `language` | `string` | the language |
| `variantId` | `string` | the variant id |
| `scope`? | `string` | the scope value |

#### Returns

`string`

the formatted page variant id

***

### normalizeScope()

> `static` **normalizeScope**(`scope`?): `string`

Defined in: [packages/core/src/personalize/utils.ts:149](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/personalize/utils.ts#L149)

Normalizes the scope from the given string value
Removes all non-alphanumeric characters

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `scope`? | `string` | the scope value |

#### Returns

`string`

normalized scope value
