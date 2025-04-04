[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / withEmptyFieldEditingComponent

# Function: withEmptyFieldEditingComponent()

> **withEmptyFieldEditingComponent**\<`FieldComponentProps`, `RefElementType`\>(`FieldComponent`, `options`): `React.ForwardRefExoticComponent`\<`React.PropsWithoutRef`\<`FieldComponentProps`\> & `React.RefAttributes`\<`RefElementType`\>\> \| (`props`) => `React.JSX.Element`

Defined in: react/types/enhancers/withEmptyFieldEditingComponent.d.ts:26

Returns the passed field component or default component in case field value is empty and edit mode is 'metadata'

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `FieldComponentProps` *extends* `WithEmptyFieldEditingComponentProps` | - |
| `RefElementType` | `HTMLElement` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `FieldComponent` | `ComponentType`\<`FieldComponentProps`\> | the field component |
| `options` | `WithEmptyFieldEditingComponentOptions` | the options of the HOC; |

## Returns

`React.ForwardRefExoticComponent`\<`React.PropsWithoutRef`\<`FieldComponentProps`\> & `React.RefAttributes`\<`RefElementType`\>\> \| (`props`) => `React.JSX.Element`
