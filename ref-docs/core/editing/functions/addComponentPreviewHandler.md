[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / addComponentPreviewHandler

# Function: addComponentPreviewHandler()

> **addComponentPreviewHandler**(`callback`): `undefined` \| () => `void`

Defined in: [packages/core/src/editing/design-library.ts:212](https://github.com/Sitecore/content-sdk/blob/169fa6f8f7c780947b604fe2c86cd4df025f3748/packages/core/src/editing/design-library.ts#L212)

Adds the browser-side event handler for 'component:generation:component-preview' message used in Design Library
The event should contain the component code, styles and imports.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback` | (`Component`) => `void` | callback to be called after component is received |

## Returns

`undefined` \| () => `void`
