[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / ComponentPropsService

# Class: ComponentPropsService

Defined in: [nextjs/src/services/component-props-service.ts:32](https://github.com/Sitecore/content-sdk/blob/bc4d59e76288877091ea87e0b1f0d7300950e831/packages/nextjs/src/services/component-props-service.ts#L32)

## Constructors

### new ComponentPropsService()

> **new ComponentPropsService**(): [`ComponentPropsService`](ComponentPropsService.md)

#### Returns

[`ComponentPropsService`](ComponentPropsService.md)

## Methods

### collectRequests()

> `protected` **collectRequests**\<`NextContext`\>(`params`): `Promise`\<`ComponentPropsRequest`\<`NextContext`\>[]\>

Defined in: [nextjs/src/services/component-props-service.ts:72](https://github.com/Sitecore/content-sdk/blob/bc4d59e76288877091ea87e0b1f0d7300950e831/packages/nextjs/src/services/component-props-service.ts#L72)

Go through layout service data, check all renderings using displayName, which should make some side effects.
Write result in requests variable

#### Type Parameters

| Type Parameter |
| ------ |
| `NextContext` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | \{ `context`: `NextContext`; `fetchFunctionFactory`: `FetchFunctionFactory`\<`NextContext`\>; `layoutData`: [`LayoutServiceData`](../interfaces/LayoutServiceData.md); `placeholders`: [`PlaceholdersData`](../type-aliases/PlaceholdersData.md); `requests`: `ComponentPropsRequest`\<`NextContext`\>[]; \} | params |
| `params.context` | `NextContext` |  |
| `params.fetchFunctionFactory` | `FetchFunctionFactory`\<`NextContext`\> |  |
| `params.layoutData` | [`LayoutServiceData`](../interfaces/LayoutServiceData.md) |  |
| `params.placeholders`? | [`PlaceholdersData`](../type-aliases/PlaceholdersData.md) |  |
| `params.requests`? | `ComponentPropsRequest`\<`NextContext`\>[] |  |

#### Returns

`Promise`\<`ComponentPropsRequest`\<`NextContext`\>[]\>

array of requests

***

### execRequests()

> `protected` **execRequests**\<`NextContext`\>(`requests`): `Promise`\<[`ComponentPropsCollection`](../type-aliases/ComponentPropsCollection.md)\>

Defined in: [nextjs/src/services/component-props-service.ts:120](https://github.com/Sitecore/content-sdk/blob/bc4d59e76288877091ea87e0b1f0d7300950e831/packages/nextjs/src/services/component-props-service.ts#L120)

Execute request for component props

#### Type Parameters

| Type Parameter |
| ------ |
| `NextContext` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `requests` | `ComponentPropsRequest`\<`NextContext`\>[] | requests |

#### Returns

`Promise`\<[`ComponentPropsCollection`](../type-aliases/ComponentPropsCollection.md)\>

requests result

***

### fetchComponentProps()

> **fetchComponentProps**(`params`): `Promise`\<[`ComponentPropsCollection`](../type-aliases/ComponentPropsCollection.md)\>

Defined in: [nextjs/src/services/component-props-service.ts:33](https://github.com/Sitecore/content-sdk/blob/bc4d59e76288877091ea87e0b1f0d7300950e831/packages/nextjs/src/services/component-props-service.ts#L33)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `FetchComponentPropsArguments`\<`GetServerSidePropsContext` \| `GetStaticPropsContext`\> |

#### Returns

`Promise`\<[`ComponentPropsCollection`](../type-aliases/ComponentPropsCollection.md)\>

***

### flatRenderings()

> `protected` **flatRenderings**(`placeholders`): [`ComponentRendering`](../interfaces/ComponentRendering.md)[]

Defined in: [nextjs/src/services/component-props-service.ts:174](https://github.com/Sitecore/content-sdk/blob/bc4d59e76288877091ea87e0b1f0d7300950e831/packages/nextjs/src/services/component-props-service.ts#L174)

Take renderings from all placeholders and returns a flat array of renderings.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `placeholders` | [`PlaceholdersData`](../type-aliases/PlaceholdersData.md) | placeholders |

#### Returns

[`ComponentRendering`](../interfaces/ComponentRendering.md)[]

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
