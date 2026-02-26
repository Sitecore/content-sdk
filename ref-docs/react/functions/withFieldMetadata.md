[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withFieldMetadata

# Function: withFieldMetadata()

> **withFieldMetadata**\<`FieldComponentProps`, `RefElementType`\>(`FieldComponent`, `isForwardRef`): (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withFieldMetadata.tsx:17](https://github.com/Sitecore/content-sdk/blob/0ba09b9a5fb85cb3112ce168d8e0ff92da4b4633/packages/react/src/enhancers/withFieldMetadata.tsx#L17)

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

> (`props`): `Element`

### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `FieldComponentProps` & `object` |

### Returns

`Element`
