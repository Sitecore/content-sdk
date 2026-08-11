[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / renderEmptyPlaceholder

# Function: renderEmptyPlaceholder()

> **renderEmptyPlaceholder**(`node`): `Element`

Defined in: [packages/react/src/components/Placeholder/placeholder-utils.tsx:110](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/react/src/components/Placeholder/placeholder-utils.tsx#L110)

Renders the placeholder when it is empty. The required CSS styles are applied to the placeholder in edit mode.

`suppressHydrationWarning` is set because Pages Editor attaches chrome (e.g. `cursor: pointer`
styling, click handlers) directly to this element outside of React, which can happen before
client-side hydration completes. That DOM mutation is expected in edit mode and isn't something
app code can control, so it shouldn't surface as a hydration mismatch.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | `ReactNode` \| `ReactElement`\<`unknown`, string \| JSXElementConstructor\<any\>\>[] | react node |

## Returns

`Element`

react node
