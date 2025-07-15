[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / addComponentPreviewHandler

# Function: addComponentPreviewHandler()

> **addComponentPreviewHandler**(`callback`): `undefined` \| () => `void`

Defined in: [packages/core/src/editing/design-library.ts:212](https://github.com/Sitecore/content-sdk/blob/42aee3f536f5272b3c6ccd994169ef4c19839501/packages/core/src/editing/design-library.ts#L212)

Adds the browser-side event handler for 'component:generation:component-preview' message used in Design Library
The event should contain the component code, styles and imports.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback` | (`Component`) => `void` | callback to be called after component is received |

## Returns

`undefined` \| () => `void`
