[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / ComponentPropsService

# Class: ComponentPropsService

Defined in: [nextjs/src/services/component-props-service.ts:28](https://github.com/Sitecore/content-sdk/blob/d4cd22bf5a3ce46c0788d7f3685bca4d16dcca42/packages/nextjs/src/services/component-props-service.ts#L28)

## Constructors

### Constructor

> **new ComponentPropsService**(): `ComponentPropsService`

#### Returns

`ComponentPropsService`

## Methods

### collectRequests()

> `protected` **collectRequests**(`params`): `Promise`\<`ComponentPropsRequest`[]\>

Defined in: [nextjs/src/services/component-props-service.ts:53](https://github.com/Sitecore/content-sdk/blob/d4cd22bf5a3ce46c0788d7f3685bca4d16dcca42/packages/nextjs/src/services/component-props-service.ts#L53)

Go through layout service data, check all renderings using displayName, which should make some side effects.
Write result in requests variable

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | \{ `components`: [`ComponentMap`](../type-aliases/ComponentMap.md)\<[`NextjsJssComponent`](../type-aliases/NextjsJssComponent.md)\>; `context`: `NextContext`; `layoutData`: [`LayoutServiceData`](../interfaces/LayoutServiceData.md); `placeholders?`: [`PlaceholdersData`](../type-aliases/PlaceholdersData.md); `requests?`: `ComponentPropsRequest`[]; \} | params |
| `params.components` | [`ComponentMap`](../type-aliases/ComponentMap.md)\<[`NextjsJssComponent`](../type-aliases/NextjsJssComponent.md)\> |  |
| `params.context` | `NextContext` |  |
| `params.layoutData` | [`LayoutServiceData`](../interfaces/LayoutServiceData.md) |  |
| `params.placeholders?` | [`PlaceholdersData`](../type-aliases/PlaceholdersData.md) |  |
| `params.requests?` | `ComponentPropsRequest`[] |  |

#### Returns

`Promise`\<`ComponentPropsRequest`[]\>

array of requests

***

### execRequests()

> `protected` **execRequests**(`requests`): `Promise`\<[`ComponentPropsCollection`](../type-aliases/ComponentPropsCollection.md)\>

Defined in: [nextjs/src/services/component-props-service.ts:102](https://github.com/Sitecore/content-sdk/blob/d4cd22bf5a3ce46c0788d7f3685bca4d16dcca42/packages/nextjs/src/services/component-props-service.ts#L102)

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

Defined in: [nextjs/src/services/component-props-service.ts:29](https://github.com/Sitecore/content-sdk/blob/d4cd22bf5a3ce46c0788d7f3685bca4d16dcca42/packages/nextjs/src/services/component-props-service.ts#L29)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `FetchComponentPropsArguments` |

#### Returns

`Promise`\<[`ComponentPropsCollection`](../type-aliases/ComponentPropsCollection.md)\>

***

### flatRenderings()

> `protected` **flatRenderings**(`placeholders`): [`ComponentRendering`](../interfaces/ComponentRendering.md)\<[`ComponentFields`](../interfaces/ComponentFields.md)\>[]

Defined in: [nextjs/src/services/component-props-service.ts:156](https://github.com/Sitecore/content-sdk/blob/d4cd22bf5a3ce46c0788d7f3685bca4d16dcca42/packages/nextjs/src/services/component-props-service.ts#L156)

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
