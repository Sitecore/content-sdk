[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [components](../README.md) / ScPlaceholderComponent

# Class: ScPlaceholderComponent

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:88](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L88)

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

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:143](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L143)

#### Returns

`ScPlaceholderComponent`

## Properties

### componentMap

> `readonly` **componentMap**: `InputSignal`\<[`ComponentMap`](../type-aliases/ComponentMap.md) \| `undefined`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:115](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L115)

Override component map (defaults to injected `SITECORE_COMPONENT_MAP`).

***

### componentRendering

> `readonly` **componentRendering**: `Signal`\<`ComponentRendering`\<`ComponentFields`\>\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:94](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L94)

***

### emptyInEditing

> `protected` `readonly` **emptyInEditing**: `WritableSignal`\<`boolean`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:131](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L131)

True when the placeholder has no renderings and the page is in editing mode.

***

### fields

> `readonly` **fields**: `InputSignal`\<\{\[`key`: `string`\]: `unknown`; \} \| `undefined`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:97](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L97)

Optional placeholder-level fields merged into each child.

***

### hiddenRenderingComponent

> `readonly` **hiddenRenderingComponent**: `InputSignal`\<`Type`\<`unknown`\> \| `undefined`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:121](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L121)

Override for hidden rendering component.

***

### injector

> `protected` `readonly` **injector**: `Injector`

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:141](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L141)

***

### isEditing

> `protected` `readonly` **isEditing**: `Signal`\<`boolean`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:128](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L128)

***

### missingComponent

> `readonly` **missingComponent**: `InputSignal`\<`Type`\<`unknown`\> \| `undefined`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:118](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L118)

Override for missing component rendering.

***

### name

> `readonly` **name**: `InputSignal`\<`string`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:90](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L90)

Name of the placeholder to render.

***

### params

> `readonly` **params**: `InputSignal`\<\{\[`key`: `string`\]: `string`; \} \| `undefined`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:100](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L100)

Optional placeholder-level params merged into each child's `params` input.

***

### passThroughProps

> `readonly` **passThroughProps**: `InputSignal`\<`Readonly`\<`Record`\<`string`, `unknown`\>\>\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:112](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L112)

Extra inputs to set on each dynamically created component, after the standard `fields`,
`params`, and `rendering` inputs. Keys must match `input()` names on the target components.

***

### rendering

> `readonly` **rendering**: `InputSignal`\<`RouteData`\<`Record`\<`string`, `Field`\<`GenericFieldValue`\> \| `Item` \| `Item`[]\>\> \| `ComponentRendering`\<`ComponentFields`\>\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:93](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L93)

Rendering or route data containing placeholders.

***

### resolvedRenderings

> `protected` `readonly` **resolvedRenderings**: `WritableSignal`\<`object`[]\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:101](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L101)

***

### showEditingChrome

> `protected` `readonly` **showEditingChrome**: `Signal`\<`boolean`\>

Defined in: [packages/angular/src/components/placeholder/sc-placeholder.component.ts:138](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/components/placeholder/sc-placeholder.component.ts#L138)

Whether to emit the outer editing chrome. Only in editing mode, and only when the placeholder
has renderings or is a declared-but-empty placeholder. An undeclared placeholder name emits no
chrome (parity with JSS PlaceholderComponent's early return).
