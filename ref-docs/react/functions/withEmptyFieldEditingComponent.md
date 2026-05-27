[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withEmptyFieldEditingComponent

# Function: withEmptyFieldEditingComponent()

> **withEmptyFieldEditingComponent**\<`FieldComponentProps`, `RefElementType`\>(`FieldComponent`, `options`): (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withEmptyFieldEditingComponent.tsx:39](https://github.com/Sitecore/content-sdk/blob/932dec9d0ea130c3f620b32f2a21cb0a49bd0481/packages/react/src/enhancers/withEmptyFieldEditingComponent.tsx#L39)

Returns the passed field component or default component in case field value is empty and edit mode is 'metadata'

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `FieldComponentProps` *extends* `WithEmptyFieldEditingComponentProps`\<`FieldComponentProps`\> | - |
| `RefElementType` | `HTMLElement` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `FieldComponent` | `ComponentType`\<`FieldComponentProps`\> | the field component |
| `options` | `WithEmptyFieldEditingComponentOptions` | the options of the HOC; |

## Returns

(`props`) => `Element`
