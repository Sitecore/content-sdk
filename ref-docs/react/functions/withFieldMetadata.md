[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withFieldMetadata

# Function: withFieldMetadata()

> **withFieldMetadata**\<`FieldComponentProps`, `RefElementType`\>(`FieldComponent`, `isForwardRef?`): (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withFieldMetadata.tsx:17](https://github.com/Sitecore/content-sdk/blob/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46/packages/react/src/enhancers/withFieldMetadata.tsx#L17)

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
| `isForwardRef` | `boolean` | `false` | set to 'true' if the ref prop should be explicitly accepted and forwarded |

## Returns

(`props`) => `Element`
