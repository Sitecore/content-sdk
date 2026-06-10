[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / PlaceholderMetadata

# Function: PlaceholderMetadata()

> **PlaceholderMetadata**(`props`): `Element`

Defined in: [packages/react/src/components/Placeholder/PlaceholderMetadata.tsx:43](https://github.com/Sitecore/content-sdk/blob/0325d614f670aabc44a25c7deff996ace6a1fe8c/packages/react/src/components/Placeholder/PlaceholderMetadata.tsx#L43)

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
