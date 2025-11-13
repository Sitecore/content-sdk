[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withEmptyFieldEditingComponent

# Function: withEmptyFieldEditingComponent()

> **withEmptyFieldEditingComponent**\<`FieldComponentProps`, `RefElementType`\>(`FieldComponent`, `options`): `ForwardRefExoticComponent`\<`PropsWithoutRef`\<`FieldComponentProps`\> & `RefAttributes`\<`RefElementType`\>\> \| (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withEmptyFieldEditingComponent.tsx:38](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/react/src/enhancers/withEmptyFieldEditingComponent.tsx#L38)

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

`ForwardRefExoticComponent`\<`PropsWithoutRef`\<`FieldComponentProps`\> & `RefAttributes`\<`RefElementType`\>\> \| (`props`) => `Element`
