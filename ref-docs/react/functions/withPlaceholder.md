[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withPlaceholder

# Function: withPlaceholder()

> **withPlaceholder**(`placeholders`, `options?`): (`WrappedComponent`) => (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withPlaceholder.tsx:47](https://github.com/Sitecore/content-sdk/blob/875026478718f4c8b8e0a7ccb65eac312b3fb4f6/packages/react/src/enhancers/withPlaceholder.tsx#L47)

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
