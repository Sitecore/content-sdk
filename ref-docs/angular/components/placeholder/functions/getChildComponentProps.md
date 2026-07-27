[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [components/placeholder](../README.md) / getChildComponentProps

# Function: getChildComponentProps()

> **getChildComponentProps**(`placeholderFields`, `placeholderParams`, `componentRendering`): [`ChildComponentProps`](../interfaces/ChildComponentProps.md)

Defined in: [packages/angular/src/components/placeholder/placeholder-utils.ts:165](https://github.com/Sitecore/content-sdk/blob/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46/packages/angular/src/components/placeholder/placeholder-utils.ts#L165)

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
