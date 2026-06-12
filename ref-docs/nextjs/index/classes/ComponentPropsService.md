[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / ComponentPropsService

# Class: ComponentPropsService

Defined in: [nextjs/src/services/component-props-service.ts:32](https://github.com/Sitecore/content-sdk/blob/858afaf01a974e0a9c38f2e5c3bd6506458f062b/packages/nextjs/src/services/component-props-service.ts#L32)

The service for fetching component props.

## Constructors

### Constructor

> **new ComponentPropsService**(): `ComponentPropsService`

#### Returns

`ComponentPropsService`

## Methods

### collectRequests()

> `protected` **collectRequests**(`params`): `Promise`\<`ComponentPropsRequest`[]\>

Defined in: [nextjs/src/services/component-props-service.ts:57](https://github.com/Sitecore/content-sdk/blob/858afaf01a974e0a9c38f2e5c3bd6506458f062b/packages/nextjs/src/services/component-props-service.ts#L57)

Go through layout service data, check all renderings using displayName, which should make some side effects.
Write result in requests variable

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | \{ `components`: [`ComponentMap`](../type-aliases/ComponentMap.md)\<[`NextjsContentSdkComponent`](../type-aliases/NextjsContentSdkComponent.md)\>; `context`: `NextContext`; `layoutData`: [`LayoutServiceData`](../interfaces/LayoutServiceData.md); `placeholders?`: [`PlaceholdersData`](../type-aliases/PlaceholdersData.md); `requests?`: `ComponentPropsRequest`[]; \} | params |
| `params.components` | [`ComponentMap`](../type-aliases/ComponentMap.md)\<[`NextjsContentSdkComponent`](../type-aliases/NextjsContentSdkComponent.md)\> | - |
| `params.context` | `NextContext` | - |
| `params.layoutData` | [`LayoutServiceData`](../interfaces/LayoutServiceData.md) | - |
| `params.placeholders?` | [`PlaceholdersData`](../type-aliases/PlaceholdersData.md) | - |
| `params.requests?` | `ComponentPropsRequest`[] | - |

#### Returns

`Promise`\<`ComponentPropsRequest`[]\>

array of requests

***

### execRequests()

> `protected` **execRequests**(`requests`): `Promise`\<[`ComponentPropsCollection`](../type-aliases/ComponentPropsCollection.md)\>

Defined in: [nextjs/src/services/component-props-service.ts:106](https://github.com/Sitecore/content-sdk/blob/858afaf01a974e0a9c38f2e5c3bd6506458f062b/packages/nextjs/src/services/component-props-service.ts#L106)

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

Defined in: [nextjs/src/services/component-props-service.ts:33](https://github.com/Sitecore/content-sdk/blob/858afaf01a974e0a9c38f2e5c3bd6506458f062b/packages/nextjs/src/services/component-props-service.ts#L33)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `FetchComponentPropsArguments` |

#### Returns

`Promise`\<[`ComponentPropsCollection`](../type-aliases/ComponentPropsCollection.md)\>

***

### flatRenderings()

> `protected` **flatRenderings**(`placeholders`): [`ComponentRendering`](../interfaces/ComponentRendering.md)\<[`ComponentFields`](../interfaces/ComponentFields.md)\>[]

Defined in: [nextjs/src/services/component-props-service.ts:160](https://github.com/Sitecore/content-sdk/blob/858afaf01a974e0a9c38f2e5c3bd6506458f062b/packages/nextjs/src/services/component-props-service.ts#L160)

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
