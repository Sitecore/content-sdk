[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [components](../README.md) / ScPlaceholderComponent

# Class: ScPlaceholderComponent

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:94](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L94)

Angular placeholder component. Renders components from layout data for a given placeholder name.

Usage:
```html
<sc-placeholder name="headless-main" [rendering]="route"></sc-placeholder>
```

Optional `[passThroughProps]` sets extra `input()` values on each child (merged after
`fields`, `params`, and `rendering`).

**Editing chrome (Metadata mode only).** When the page is in editing mode, the placeholder
emits Sitecore Pages chrome markers using a declarative `<ng-template>` rendered into the
same `ViewContainerRef` that hosts the dynamic child components. The structure matches
Metadata-mode output:

```
<code class="scpm" chrometype="placeholder" kind="open" id="…" />   ← once, outer
  <code class="scpm" chrometype="rendering" kind="open" id="<uid>"/>
  <child-component />
  <code class="scpm" chrometype="rendering" kind="close" />
  …
<code class="scpm" chrometype="placeholder" kind="close" />          ← once, outer
```

An empty placeholder still emits the outer placeholder pair in editing mode so authors can
target the empty region in Sitecore Pages.

**Guards & data resolvers.** Inject `PLACEHOLDER_GUARD_RESOLVER` and/or
`PLACEHOLDER_DATA_RESOLVER` to filter or decorate the renderings before they are
instantiated. Resolvers are synchronous; if you need async data, fetch it in the page
loader and feed cached results into the resolver.

## Constructors

### Constructor

> **new ScPlaceholderComponent**(): `ScPlaceholderComponent`

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:136](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L136)

#### Returns

`ScPlaceholderComponent`

## Properties

### componentMap

> `readonly` **componentMap**: `InputSignal`\<[`ComponentMap`](../type-aliases/ComponentMap.md) \| `undefined`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:114](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L114)

Override component map (defaults to injected `SITECORE_COMPONENT_MAP`).

***

### emptyInEditing

> `protected` `readonly` **emptyInEditing**: `WritableSignal`\<`boolean`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:134](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L134)

True when the placeholder has no renderings and the page is in editing mode.

***

### fields

> `readonly` **fields**: `InputSignal`\<\{\[`key`: `string`\]: `unknown`; \} \| `undefined`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:102](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L102)

Optional placeholder-level fields merged into each child.

***

### hiddenRenderingComponent

> `readonly` **hiddenRenderingComponent**: `InputSignal`\<`Type`\<`unknown`\> \| `undefined`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:120](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L120)

Override for hidden rendering component.

***

### missingComponent

> `readonly` **missingComponent**: `InputSignal`\<`Type`\<`unknown`\> \| `undefined`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:117](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L117)

Override for missing component rendering.

***

### name

> `readonly` **name**: `InputSignal`\<`string`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:96](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L96)

Name of the placeholder to render.

***

### params

> `readonly` **params**: `InputSignal`\<\{\[`key`: `string`\]: `string`; \} \| `undefined`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:105](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L105)

Optional placeholder-level params merged into each child's `params` input.

***

### passThroughProps

> `readonly` **passThroughProps**: `InputSignal`\<`Readonly`\<`Record`\<`string`, `unknown`\>\>\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:111](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L111)

Extra inputs to set on each dynamically created component, after the standard `fields`,
`params`, and `rendering` inputs. Keys must match `input()` names on the target components.

***

### rendering

> `readonly` **rendering**: `InputSignal`\<`RouteData`\<`Record`\<`string`, `Field`\<`GenericFieldValue`\> \| `Item` \| `Item`[]\>\> \| `ComponentRendering`\<`ComponentFields`\>\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:99](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L99)

Rendering or route data containing placeholders.
