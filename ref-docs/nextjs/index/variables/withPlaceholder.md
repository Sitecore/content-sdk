[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / withPlaceholder

# Variable: withPlaceholder

> `const` **withPlaceholder**: \<`T`, `W`\>(`Component`) => (`props`) => `React.JSX.Element`

Defined in: react/types/enhancers/withPlaceholder.d.ts:18

Provides a slot-like functionality by wrapping a component in client/SSR context and rendering placeholders defined in the layout data.

## Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-__typet"></a> `T` *extends* `ComponentProps` |
| <a id="type-parameter-__typew"></a> `W` *extends* `T` & `WrapperProps` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `Component` | `ComponentType`\<`T`\> | The component to be wrapped around placeholders. |

## Returns

A new component that renders the original component with placeholders.

(`props`) => `React.JSX.Element`
