[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / ComponentPropsService

# Class: ComponentPropsService

Defined in: [nextjs/src/services/component-props-service.ts:32](https://github.com/Sitecore/content-sdk/blob/d43cd6b87786479497db0c411c900beadb8b920e/packages/nextjs/src/services/component-props-service.ts#L32)

## Constructors

### Constructor

> **new ComponentPropsService**(): `ComponentPropsService`

#### Returns

`ComponentPropsService`

## Methods

### collectRequests()

> `protected` **collectRequests**(`params`): `Promise`\<`ComponentPropsRequest`[]\>

Defined in: [nextjs/src/services/component-props-service.ts:59](https://github.com/Sitecore/content-sdk/blob/d43cd6b87786479497db0c411c900beadb8b920e/packages/nextjs/src/services/component-props-service.ts#L59)

Go through layout service data, check all renderings using displayName, which should make some side effects.
Write result in requests variable

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | \{ `context`: `NextContext`; `fetchFunctionFactory`: `FetchFunctionFactory`; `layoutData`: [`LayoutServiceData`](../interfaces/LayoutServiceData.md); `placeholders?`: [`PlaceholdersData`](../type-aliases/PlaceholdersData.md); `requests?`: `ComponentPropsRequest`[]; \} | params |
| `params.context` | `NextContext` |  |
| `params.fetchFunctionFactory` | `FetchFunctionFactory` |  |
| `params.layoutData` | [`LayoutServiceData`](../interfaces/LayoutServiceData.md) |  |
| `params.placeholders?` | [`PlaceholdersData`](../type-aliases/PlaceholdersData.md) |  |
| `params.requests?` | `ComponentPropsRequest`[] |  |

#### Returns

`Promise`\<`ComponentPropsRequest`[]\>

array of requests

***

### execRequests()

> `protected` **execRequests**(`requests`): `Promise`\<[`ComponentPropsCollection`](../type-aliases/ComponentPropsCollection.md)\>

Defined in: [nextjs/src/services/component-props-service.ts:107](https://github.com/Sitecore/content-sdk/blob/d43cd6b87786479497db0c411c900beadb8b920e/packages/nextjs/src/services/component-props-service.ts#L107)

Execute request for component props

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `requests` | `ComponentPropsRequest`[] | requests |

#### Returns

`Promise`\<[`ComponentPropsCollection`](../type-aliases/ComponentPropsCollection.md)\>

requests result

***

### fetchComponentProps()

> **fetchComponentProps**(`params`): `Promise`\<[`ComponentPropsCollection`](../type-aliases/ComponentPropsCollection.md)\>

Defined in: [nextjs/src/services/component-props-service.ts:33](https://github.com/Sitecore/content-sdk/blob/d43cd6b87786479497db0c411c900beadb8b920e/packages/nextjs/src/services/component-props-service.ts#L33)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `FetchComponentPropsArguments` |

#### Returns

`Promise`\<[`ComponentPropsCollection`](../type-aliases/ComponentPropsCollection.md)\>

***

### flatRenderings()

> `protected` **flatRenderings**(`placeholders`): [`ComponentRendering`](../interfaces/ComponentRendering.md)\<[`ComponentFields`](../interfaces/ComponentFields.md)\>[]

Defined in: [nextjs/src/services/component-props-service.ts:161](https://github.com/Sitecore/content-sdk/blob/d43cd6b87786479497db0c411c900beadb8b920e/packages/nextjs/src/services/component-props-service.ts#L161)

Take renderings from all placeholders and returns a flat array of renderings.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `placeholders` | [`PlaceholdersData`](../type-aliases/PlaceholdersData.md) | placeholders |

#### Returns

[`ComponentRendering`](../interfaces/ComponentRendering.md)\<[`ComponentFields`](../interfaces/ComponentFields.md)\>[]

renderings

#### Example

```ts
const placeholders = {
   x1: [{ uid: 1 }, { uid: 2 }],
   x2: [{ uid: 11 }, { uid: 22 }]
}

flatRenderings(placeholders);

RESULT: [{ uid: 1 }, { uid: 2 }, { uid: 11 }, { uid: 22 }]
```
