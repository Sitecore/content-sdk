[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withPlaceholder

# Function: withPlaceholder()

> **withPlaceholder**(`placeholders`, `options`?): (`WrappedComponent`) => (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withPlaceholder.tsx:42](https://github.com/Sitecore/content-sdk/blob/5647269998b9306151914ae421806dad763f924a/packages/react/src/enhancers/withPlaceholder.tsx#L42)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `placeholders` | `WithPlaceholderSpec` |  |
| `options`? | `WithPlaceholderOptions` |  |

## Returns

`Function`

### Parameters

| Parameter | Type |
| ------ | ------ |
| `WrappedComponent` | `ComponentClass`\<`PlaceholderProps`\> \| `FunctionComponent`\<`PlaceholderProps`\> |

### Returns

`Function`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | [`EnhancedOmit`](../type-aliases/EnhancedOmit.md)\<`PlaceholderProps`, keyof [`WithSitecoreContextProps`](../interfaces/WithSitecoreContextProps.md)\> |

#### Returns

`Element`
