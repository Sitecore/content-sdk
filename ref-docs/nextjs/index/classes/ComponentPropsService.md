[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / ComponentPropsService

# Class: ComponentPropsService

Defined in: [nextjs/src/services/component-props-service.ts:31](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/services/component-props-service.ts#L31)

## Constructors

### new ComponentPropsService()

> **new ComponentPropsService**(): [`ComponentPropsService`](ComponentPropsService.md)

#### Returns

[`ComponentPropsService`](ComponentPropsService.md)

## Methods

### collectRequests()

> `protected` **collectRequests**\<`NextContext`\>(`params`): `Promise`\<`ComponentPropsRequest`\<`NextContext`\>[]\>

Defined in: [nextjs/src/services/component-props-service.ts:76](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/services/component-props-service.ts#L76)

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

Defined in: [nextjs/src/services/component-props-service.ts:124](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/services/component-props-service.ts#L124)

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

Defined in: [nextjs/src/services/component-props-service.ts:32](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/services/component-props-service.ts#L32)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `FetchComponentPropsArguments`\<`GetServerSidePropsContext` \| `GetStaticPropsContext`\> |

#### Returns

`Promise`\<[`ComponentPropsCollection`](../type-aliases/ComponentPropsCollection.md)\>

***

### flatRenderings()

> `protected` **flatRenderings**(`placeholders`): [`ComponentRendering`](../interfaces/ComponentRendering.md)[]

Defined in: [nextjs/src/services/component-props-service.ts:178](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/services/component-props-service.ts#L178)

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
