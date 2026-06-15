[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / withAppPlaceholder

# Variable: withAppPlaceholder

> `const` **withAppPlaceholder**: \<`T`, `W`\>(`Component`) => (`props`) => `React.JSX.Element`

Defined in: react/types/enhancers/withAppPlaceholder.d.ts:21

Provides a slot-like functionality by wrapping a component and rendering placeholders defined in the layout data.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `ComponentProps` |
| `W` *extends* `T` & `WrapperProps` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `Component` | `ComponentType`\<`T`\> | The component to be wrapped around placeholders. |

## Returns

A new component that renders the original component with placeholders.

(`props`) => `React.JSX.Element`
