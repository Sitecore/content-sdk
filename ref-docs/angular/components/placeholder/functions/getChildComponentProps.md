[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [components/placeholder](../README.md) / getChildComponentProps

# Function: getChildComponentProps()

> **getChildComponentProps**(`placeholderFields`, `placeholderParams`, `componentRendering`): [`ChildComponentProps`](../interfaces/ChildComponentProps.md)

Defined in: [packages/angular/src/components/placeholder/placeholder-utils.ts:119](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/components/placeholder/placeholder-utils.ts#L119)

Merge placeholder-level fields/params with per-component fields/params.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `placeholderFields` | \{\[`key`: `string`\]: `unknown`; \} \| `undefined` | Placeholder-level fields. |
| `placeholderParams` | \{\[`key`: `string`\]: `string`; \} \| `undefined` | Placeholder-level params. |
| `componentRendering` | `ComponentRendering` | The component rendering data. |

## Returns

[`ChildComponentProps`](../interfaces/ChildComponentProps.md)

Merged child component props.
