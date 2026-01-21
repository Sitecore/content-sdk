[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withFieldMetadata

# Function: withFieldMetadata()

> **withFieldMetadata**\<`FieldComponentProps`, `RefElementType`\>(`FieldComponent`, `isForwardRef`): `ForwardRefExoticComponent`\<`PropsWithoutRef`\<`FieldComponentProps`\> & `RefAttributes`\<`RefElementType`\>\> \| (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withFieldMetadata.tsx:17](https://github.com/Sitecore/content-sdk/blob/8dcb9d458e61f7c39bf98898c9a004ce461038f8/packages/react/src/enhancers/withFieldMetadata.tsx#L17)

Wraps the field component with metadata markup intended to be used for chromes hydration in Pages

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `FieldComponentProps` *extends* `WithMetadataProps` | - |
| `RefElementType` | `HTMLElement` |

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `FieldComponent` | `ComponentType`\<`FieldComponentProps`\> | `undefined` | the field component |
| `isForwardRef` | `boolean` | `false` | set to 'true' if forward reference is needed |

## Returns

`ForwardRefExoticComponent`\<`PropsWithoutRef`\<`FieldComponentProps`\> & `RefAttributes`\<`RefElementType`\>\> \| (`props`) => `Element`
