[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [components](../README.md) / BaseFieldDirective

# Abstract Class: BaseFieldDirective\<TField\>

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:48](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/field-directives/base-field.directive.ts#L48)

**`Internal`**

Abstract base for the structural Sitecore field directives (`*scText`, `*scRichText`,
`*scImage`, `*scLink`, `*scRouterLink`).

The base owns the reactive plumbing (an `effect` that fires [updateView](#updateview) whenever
the field signal changes) plus the editing-mode helpers each subclass uses to compose
its render flow:

  - [shouldRender](#shouldrender) - true when the field has a renderable value
  - renderOpen / renderClose - emit the open/close `<code class="scpm">`
    chrome markers used by Sitecore Pages to discover the field
  - [renderEmpty](#renderempty) - emit the empty-field placeholder between chrome markers when
    the page is in editing mode and the field carries `metadata`

The chrome flow is *not* hidden inside the base: each subclass implements [updateView](#updateview)
explicitly so the open / render / close sequence is visible at the directive level.

This class intentionally has no `@Directive` decorator. Subclasses carry their own
`@Directive({ selector: ... })`, and the shared state here lives in field initializers
that run in the subclass's injection context.

## Extended by

- [`ScTextDirective`](ScTextDirective.md)
- [`ScImageDirective`](ScImageDirective.md)
- [`ScLinkDirective`](ScLinkDirective.md)
- [`ScRichTextDirective`](ScRichTextDirective.md)

## Type Parameters

| Type Parameter |
| ------ |
| `TField` |

## Constructors

### Constructor

> **new BaseFieldDirective**\<`TField`\>(): `BaseFieldDirective`\<`TField`\>

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:64](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/field-directives/base-field.directive.ts#L64)

#### Returns

`BaseFieldDirective`\<`TField`\>

## Properties

### context

> `protected` `readonly` **context**: [`SitecoreContextService`](../../lib/classes/SitecoreContextService.md) \| `null`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:52](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/field-directives/base-field.directive.ts#L52)

***

### defaultEmptyComponent

> `abstract` `protected` `readonly` **defaultEmptyComponent**: `Type`\<`unknown`\>

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:62](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/field-directives/base-field.directive.ts#L62)

Default component rendered when the field is empty in editing mode and no template is supplied.

***

### emptyFieldEditingTemplate

> `abstract` `readonly` **emptyFieldEditingTemplate**: `Signal`\<`TemplateRef`\<`unknown`\> \| `undefined`\>

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:60](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/field-directives/base-field.directive.ts#L60)

Consumer-supplied empty-field template; takes precedence over [defaultEmptyComponent](#defaultemptycomponent).

***

### field

> `abstract` `readonly` **field**: `Signal`\<`TField`\>

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:58](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/field-directives/base-field.directive.ts#L58)

Concrete subclass exposes the Sitecore field via an aliased signal input.

***

### renderer

> `protected` `readonly` **renderer**: `Renderer2`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:51](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/field-directives/base-field.directive.ts#L51)

***

### templateRef

> `protected` `readonly` **templateRef**: `TemplateRef`\<`any`\>

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:50](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/field-directives/base-field.directive.ts#L50)

***

### viewContainer

> `protected` `readonly` **viewContainer**: `ViewContainerRef`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:49](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/field-directives/base-field.directive.ts#L49)

***

### viewRef?

> `protected` `optional` **viewRef?**: `EmbeddedViewRef`\<`unknown`\>

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:55](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/field-directives/base-field.directive.ts#L55)

Embedded view created by the latest successful render; cleared on each tick.

## Accessors

### fieldMetadata

#### Get Signature

> **get** `protected` **fieldMetadata**(): `Record`\<`string`, `unknown`\> \| `undefined`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:94](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/field-directives/base-field.directive.ts#L94)

Field metadata payload, when present.

##### Returns

`Record`\<`string`, `unknown`\> \| `undefined`

## Methods

### isEditing()

> `protected` **isEditing**(): `boolean`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:89](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/field-directives/base-field.directive.ts#L89)

Whether the host page is in editing mode. Falls back to `false` when no context is provided.

#### Returns

`boolean`

***

### renderEditingChrome()

> `protected` **renderEditingChrome**(`kind`): `void`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:123](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/field-directives/base-field.directive.ts#L123)

Inserts a single chrome marker into the structural slot when both editing mode is active
and the field carries metadata. No-ops otherwise.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `kind` | `MetadataKind` | Whether to emit the opening or closing marker. |

#### Returns

`void`

***

### renderEmpty()

> `protected` **renderEmpty**(): `void`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:104](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/field-directives/base-field.directive.ts#L104)

Renders the empty-field state. In editing mode with field metadata, wraps either the
consumer's `emptyFieldEditingTemplate` or [defaultEmptyComponent](#defaultemptycomponent) in chrome markers
so Sitecore Pages can target the empty slot. Outside editing or without metadata, emits
nothing.

#### Returns

`void`

***

### shouldRender()

> `protected` **shouldRender**(): `boolean`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:83](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/field-directives/base-field.directive.ts#L83)

Returns true when the field has a real value to render. Subclasses can override to add
field-specific rules (e.g. `ScLinkDirective` preserves authored text + href).

#### Returns

`boolean`

***

### updateView()

> `abstract` `protected` **updateView**(): `void`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:77](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/angular/src/components/field-directives/base-field.directive.ts#L77)

Renders the structural slot based on the current field value and editing state.
Subclasses compose `shouldRender → renderEmpty | (renderOpen → createEmbeddedView →
apply field value → renderClose)`.

#### Returns

`void`
