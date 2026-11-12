[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withFieldMetadata

# Function: withFieldMetadata()

> **withFieldMetadata**\<`FieldComponentProps`, `RefElementType`\>(`FieldComponent`, `isForwardRef?`): (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withFieldMetadata.tsx:17](https://github.com/Sitecore/content-sdk/blob/a6f2fa837d94ddfacbf5ffaa348ac01f0737da82/packages/react/src/enhancers/withFieldMetadata.tsx#L17)

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
