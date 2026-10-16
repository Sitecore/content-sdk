[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [components/placeholder](../README.md) / getChildComponentProps

# Function: getChildComponentProps()

> **getChildComponentProps**(`placeholderFields`, `placeholderParams`, `componentRendering`): [`ChildComponentProps`](../interfaces/ChildComponentProps.md)

Defined in: [packages/angular/src/components/placeholder/placeholder-utils.ts:165](https://github.com/Sitecore/content-sdk/blob/96d36170a4e88e0d43d2575e3412e8921e0a8da8/packages/angular/src/components/placeholder/placeholder-utils.ts#L165)

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
