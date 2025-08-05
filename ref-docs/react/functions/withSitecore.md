[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withSitecore

# Function: withSitecore()

> **withSitecore**(`options?`): \<`ComponentProps`\>(`Component`) => (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withSitecore.tsx:43](https://github.com/Sitecore/content-sdk/blob/0104fee07cb6a0d1ee5c47a0cf6e259308ac7b0f/packages/react/src/enhancers/withSitecore.tsx#L43)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | [`WithSitecoreOptions`](../interfaces/WithSitecoreOptions.md) |  |

## Returns

> \<`ComponentProps`\>(`Component`): (`props`) => `Element`

### Type Parameters

| Type Parameter |
| ------ |
| `ComponentProps` *extends* [`WithSitecoreProps`](../interfaces/WithSitecoreProps.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `Component` | `ComponentType`\<`ComponentProps`\> |

### Returns

> (`props`): `Element`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | [`WithSitecoreHocProps`](../type-aliases/WithSitecoreHocProps.md)\<`ComponentProps`\> |

#### Returns

`Element`
