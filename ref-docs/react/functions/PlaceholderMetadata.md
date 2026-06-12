[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / PlaceholderMetadata

# Function: PlaceholderMetadata()

> **PlaceholderMetadata**(`props`): `Element`

Defined in: [packages/react/src/components/Placeholder/PlaceholderMetadata.tsx:43](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/react/src/components/Placeholder/PlaceholderMetadata.tsx#L43)

**`Internal`**

A React component to generate metadata blocks for a placeholder or rendering.
It utilizes dynamic attributes based on whether the component acts as a placeholder
or as a rendering to properly render the surrounding code blocks.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `PlaceholderMetadataProps` | The properties passed to the component. |

## Returns

`Element`

A React fragment containing open and close code blocks surrounding the children elements.
