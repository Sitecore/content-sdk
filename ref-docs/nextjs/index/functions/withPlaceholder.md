[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / withPlaceholder

# Function: withPlaceholder()

> **withPlaceholder**(`placeholders`, `options?`): (`WrappedComponent`) => (`props`) => `Element`

Defined in: react/types/enhancers/withPlaceholder.d.ts:36

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
| `WrappedComponent` | `ComponentClass`\<[`PlaceholderComponentProps`](../interfaces/PlaceholderComponentProps.md), `any`\> \| `FunctionComponent`\<[`PlaceholderComponentProps`](../interfaces/PlaceholderComponentProps.md)\> |

### Returns

> (`props`): `Element`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `EnhancedOmit`\<[`PlaceholderComponentProps`](../interfaces/PlaceholderComponentProps.md), keyof [`WithSitecoreProps`](../interfaces/WithSitecoreProps.md)\> |

#### Returns

`Element`
