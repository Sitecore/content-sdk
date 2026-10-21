[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / renderEmptyPlaceholder

# Variable: renderEmptyPlaceholder

> `const` **renderEmptyPlaceholder**: (`node`) => `React.JSX.Element`

Defined in: react/types/components/Placeholder/placeholder-utils.d.ts:32

Renders the placeholder when it is empty. The required CSS styles are applied to the placeholder in edit mode.

`suppressHydrationWarning` is set because Pages Editor attaches chrome (e.g. `cursor: pointer`
styling, click handlers) directly to this element outside of React, which can happen before
client-side hydration completes. That DOM mutation is expected in edit mode and isn't something
app code can control, so it shouldn't surface as a hydration mismatch.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | `React.ReactNode` \| `React.ReactElement`[] | react node |

## Returns

`React.JSX.Element`

react node
