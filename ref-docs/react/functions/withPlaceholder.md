[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withPlaceholder

# Function: withPlaceholder()

> **withPlaceholder**(`placeholders`, `options?`): (`WrappedComponent`) => (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withPlaceholder.tsx:49](https://github.com/Sitecore/content-sdk/blob/e70bcf4a0aa34d1ca05e3c9f8e1720f1c4be4408/packages/react/src/enhancers/withPlaceholder.tsx#L49)

HOC to provide client-side placeholder functionality to a component.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `placeholders` | `WithPlaceholderSpec` |  |
| `options?` | `WithPlaceholderOptions` |  |

## Returns

> (`WrappedComponent`): (`props`) => `Element`

### Parameters

| Parameter | Type |
| ------ | ------ |
| `WrappedComponent` | `ComponentClass`\<[`PlaceholderProps`](../interfaces/PlaceholderProps.md), `any`\> \| `FunctionComponent`\<[`PlaceholderProps`](../interfaces/PlaceholderProps.md)\> |

### Returns

> (`props`): `Element`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | [`WithSitecoreHocProps`](../type-aliases/WithSitecoreHocProps.md)\<`ComponentProps`\> |

#### Returns

`Element`
