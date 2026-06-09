[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [components](../README.md) / ScPlaceholderComponent

# Class: ScPlaceholderComponent

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:44](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L44)

Angular placeholder component. Renders components from layout data for a given placeholder name.

Usage:
```html
<sc-placeholder name="headless-main" [rendering]="route"></sc-placeholder>
```

Optional `[passThroughProps]` sets extra `input()` values on each child (merged after `fields`, `params`, and `rendering`).

## Constructors

### Constructor

> **new ScPlaceholderComponent**(): `ScPlaceholderComponent`

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:80](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L80)

#### Returns

`ScPlaceholderComponent`

## Properties

### componentMap

> `readonly` **componentMap**: `InputSignal`\<[`ComponentMap`](../type-aliases/ComponentMap.md) \| `undefined`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:64](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L64)

Override component map (defaults to injected SITECORE_COMPONENT_MAP).

***

### fields

> `readonly` **fields**: `InputSignal`\<\{\[`key`: `string`\]: `unknown`; \} \| `undefined`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:52](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L52)

Optional placeholder-level fields merged into each child.

***

### hiddenRenderingComponent

> `readonly` **hiddenRenderingComponent**: `InputSignal`\<`Type`\<`unknown`\> \| `undefined`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:70](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L70)

Override for hidden rendering component.

***

### missingComponent

> `readonly` **missingComponent**: `InputSignal`\<`Type`\<`unknown`\> \| `undefined`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:67](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L67)

Override for missing component rendering.

***

### name

> `readonly` **name**: `InputSignal`\<`string`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:46](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L46)

Name of the placeholder to render.

***

### params

> `readonly` **params**: `InputSignal`\<\{\[`key`: `string`\]: `string`; \} \| `undefined`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:55](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L55)

Optional placeholder-level params merged into each child's `params` input.

***

### passThroughProps

> `readonly` **passThroughProps**: `InputSignal`\<`Readonly`\<`Record`\<`string`, `unknown`\>\>\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:61](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L61)

Extra inputs to set on each dynamically created component, after the standard `fields`, `params`, and `rendering` inputs.
Keys must match `input()` names on the target components.

***

### rendering

> `readonly` **rendering**: `InputSignal`\<`RouteData`\<`Record`\<`string`, `Field`\<`GenericFieldValue`\> \| `Item` \| `Item`[]\>\> \| `ComponentRendering`\<`ComponentFields`\>\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:49](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L49)

Rendering or route data containing placeholders.
