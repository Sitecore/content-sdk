[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withEmptyFieldEditingComponent

# Function: withEmptyFieldEditingComponent()

> **withEmptyFieldEditingComponent**\<`FieldComponentProps`, `RefElementType`\>(`FieldComponent`, `options`): (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withEmptyFieldEditingComponent.tsx:40](https://github.com/Sitecore/content-sdk/blob/ab9e875d0e7b49a2476a9634f4e57b1fe6847d09/packages/react/src/enhancers/withEmptyFieldEditingComponent.tsx#L40)

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
