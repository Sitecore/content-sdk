[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / withFieldMetadata

# Function: withFieldMetadata()

> **withFieldMetadata**\<`FieldComponentProps`, `RefElementType`\>(`FieldComponent`, `isForwardRef`?): `React.ForwardRefExoticComponent`\<`React.PropsWithoutRef`\<`FieldComponentProps`\> & `React.RefAttributes`\<`RefElementType`\>\> \| (`props`) => `React.JSX.Element`

Defined in: react/types/enhancers/withFieldMetadata.d.ts:15

Wraps the field component with metadata markup intended to be used for chromes hydration in Pages

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `FieldComponentProps` *extends* `WithMetadataProps` | - |
| `RefElementType` | `HTMLElement` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `FieldComponent` | `ComponentType`\<`FieldComponentProps`\> | the field component |
| `isForwardRef`? | `boolean` | set to 'true' if forward reference is needed |

## Returns

`React.ForwardRefExoticComponent`\<`React.PropsWithoutRef`\<`FieldComponentProps`\> & `React.RefAttributes`\<`RefElementType`\>\> \| (`props`) => `React.JSX.Element`
