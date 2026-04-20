[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withPlaceholder

# Function: withPlaceholder()

> **withPlaceholder**\<`T`, `W`\>(`Component`): (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withPlaceholder.tsx:22](https://github.com/Sitecore/content-sdk/blob/70eccc43077e1c9d1fe9da2ed5681f1cd3574c75/packages/react/src/enhancers/withPlaceholder.tsx#L22)

Provides a slot-like functionality by wrapping a component in client/SSR context and rendering placeholders defined in the layout data.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `ComponentProps` |
| `W` *extends* `ComponentProps` & `WrapperProps` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `Component` | `ComponentType`\<`T`\> | The component to be wrapped around placeholders. |

## Returns

A new component that renders the original component with placeholders.

(`props`) => `Element`
