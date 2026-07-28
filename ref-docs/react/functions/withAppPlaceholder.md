[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withAppPlaceholder

# Function: withAppPlaceholder()

> **withAppPlaceholder**\<`T`, `W`\>(`Component`): (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withAppPlaceholder.tsx:25](https://github.com/Sitecore/content-sdk/blob/6f8e423028bdf8a74a2fc4b8cb084961d755b73f/packages/react/src/enhancers/withAppPlaceholder.tsx#L25)

Provides a slot-like functionality by wrapping a component and rendering placeholders defined in the layout data.

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
