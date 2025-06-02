[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withPlaceholder

# Function: withPlaceholder()

> **withPlaceholder**(`placeholders`, `options?`): (`WrappedComponent`) => (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withPlaceholder.tsx:42](https://github.com/Sitecore/content-sdk/blob/ccaca47e1d3be54d4807fac59220b223d5ccd97e/packages/react/src/enhancers/withPlaceholder.tsx#L42)

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
| `WrappedComponent` | `ComponentClass`\<`PlaceholderProps`, `any`\> \| `FunctionComponent`\<`PlaceholderProps`\> |

### Returns

> (`props`): `Element`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | [`EnhancedOmit`](../type-aliases/EnhancedOmit.md)\<`PlaceholderProps`\> |

#### Returns

`Element`
