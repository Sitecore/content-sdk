[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / ComponentPropsService

# Class: ComponentPropsService

<<<<<<< HEAD
Defined in: [nextjs/src/services/component-props-service.ts:28](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/services/component-props-service.ts#L28)
=======
Defined in: [nextjs/src/services/component-props-service.ts:28](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/services/component-props-service.ts#L28)
>>>>>>> dd686bb50 (Update API docs)

## Constructors

### Constructor

> **new ComponentPropsService**(): `ComponentPropsService`

#### Returns

`ComponentPropsService`

## Methods

### collectRequests()

> `protected` **collectRequests**(`params`): `Promise`\<`ComponentPropsRequest`[]\>

<<<<<<< HEAD
Defined in: [nextjs/src/services/component-props-service.ts:53](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/services/component-props-service.ts#L53)
=======
Defined in: [nextjs/src/services/component-props-service.ts:53](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/services/component-props-service.ts#L53)
>>>>>>> dd686bb50 (Update API docs)

Go through layout service data, check all renderings using displayName, which should make some side effects.
Write result in requests variable

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | \{ `components`: [`ComponentMap`](../type-aliases/ComponentMap.md)\<[`NextjsContentSdkComponent`](../type-aliases/NextjsContentSdkComponent.md)\>; `context`: `NextContext`; `layoutData`: [`LayoutServiceData`](../interfaces/LayoutServiceData.md); `placeholders?`: [`PlaceholdersData`](../type-aliases/PlaceholdersData.md); `requests?`: `ComponentPropsRequest`[]; \} | params |
| `params.components` | [`ComponentMap`](../type-aliases/ComponentMap.md)\<[`NextjsContentSdkComponent`](../type-aliases/NextjsContentSdkComponent.md)\> |  |
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

<<<<<<< HEAD
Defined in: [nextjs/src/services/component-props-service.ts:102](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/services/component-props-service.ts#L102)
=======
Defined in: [nextjs/src/services/component-props-service.ts:102](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/services/component-props-service.ts#L102)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/services/component-props-service.ts:29](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/services/component-props-service.ts#L29)
=======
Defined in: [nextjs/src/services/component-props-service.ts:29](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/services/component-props-service.ts#L29)
>>>>>>> dd686bb50 (Update API docs)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `FetchComponentPropsArguments` |

#### Returns

`Promise`\<[`ComponentPropsCollection`](../type-aliases/ComponentPropsCollection.md)\>

***

### flatRenderings()

> `protected` **flatRenderings**(`placeholders`): [`ComponentRendering`](../interfaces/ComponentRendering.md)\<[`ComponentFields`](../interfaces/ComponentFields.md)\>[]

<<<<<<< HEAD
Defined in: [nextjs/src/services/component-props-service.ts:156](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/services/component-props-service.ts#L156)
=======
Defined in: [nextjs/src/services/component-props-service.ts:156](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/services/component-props-service.ts#L156)
>>>>>>> dd686bb50 (Update API docs)

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
