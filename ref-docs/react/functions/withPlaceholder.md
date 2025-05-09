[**@sitecore-content-sdk/react**](../README.md)

---

[@sitecore-content-sdk/react](../README.md) / withPlaceholder

# Function: withPlaceholder()

> **withPlaceholder**(`placeholders`, `options?`): (`WrappedComponent`) => (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withPlaceholder.tsx:42](https://github.com/Sitecore/content-sdk/blob/d60a82d1a68474e16b7f78b07443588ed56138bb/packages/react/src/enhancers/withPlaceholder.tsx#L42)

## Parameters

| Parameter      | Type                     | Description |
| -------------- | ------------------------ | ----------- |
| `placeholders` | `WithPlaceholderSpec`    |             |
| `options?`     | `WithPlaceholderOptions` |             |

## Returns

> (`WrappedComponent`): (`props`) => `Element`

### Parameters

| Parameter          | Type                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `WrappedComponent` | `ComponentClass`\<`PlaceholderProps`, `any`\> \| `FunctionComponent`\<`PlaceholderProps`\> |

### Returns

> (`props`): `Element`

#### Parameters

| Parameter | Type                                                                    |
| --------- | ----------------------------------------------------------------------- |
| `props`   | [`EnhancedOmit`](../type-aliases/EnhancedOmit.md)\<`PlaceholderProps`\> |

#### Returns

`Element`
