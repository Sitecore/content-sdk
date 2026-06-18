[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [components](../README.md) / ScImageDirective

# Class: ScImageDirective

Defined in: [packages/angular/src/components/field-directives/sc-image.directive.ts:49](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/sc-image.directive.ts#L49)

Structural directive that renders a Sitecore image field onto a consumer-supplied `<img>`
element.

Editing flow:
  - field has a renderable src → emit opening chrome marker, embed the consumer's `<img>`
    template, write `src/alt/width/height/class` onto it, emit closing chrome marker.
  - field is empty in editing mode + has `metadata` → render the empty-image placeholder
    between markers (overridable via `scImageEmptyFieldEditingTemplate`).

Usage:
```html
<img *scImage="fields.Image" />
<img *scImage="fields.Image; imageParams: { mw: 800 }" />
```

## Extends

- [`BaseFieldDirective`](BaseFieldDirective.md)\<[`ImageField`](../interfaces/ImageField.md) \| [`ImageFieldValue`](../interfaces/ImageFieldValue.md) \| `undefined`\>

## Constructors

### Constructor

> **new ScImageDirective**(): `ScImageDirective`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:64](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/base-field.directive.ts#L64)

#### Returns

`ScImageDirective`

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`constructor`](BaseFieldDirective.md#constructor)

## Properties

### context

> `protected` `readonly` **context**: [`SitecoreContextService`](../../lib/classes/SitecoreContextService.md) \| `null`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:52](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/base-field.directive.ts#L52)

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`context`](BaseFieldDirective.md#context)

***

### defaultEmptyComponent

> `protected` `readonly` **defaultEmptyComponent**: `Type`\<`unknown`\> = `DefaultEmptyImageFieldEditingComponent`

Defined in: [packages/angular/src/components/field-directives/sc-image.directive.ts:62](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/sc-image.directive.ts#L62)

Default component rendered when the field is empty in editing mode and no template is supplied.

#### Overrides

[`BaseFieldDirective`](BaseFieldDirective.md).[`defaultEmptyComponent`](BaseFieldDirective.md#defaultemptycomponent)

***

### emptyFieldEditingTemplate

> `readonly` **emptyFieldEditingTemplate**: `InputSignal`\<`TemplateRef`\<`unknown`\> \| `undefined`\>

Defined in: [packages/angular/src/components/field-directives/sc-image.directive.ts:60](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/sc-image.directive.ts#L60)

Consumer-supplied template rendered between chrome markers when the field is empty in editing mode.

#### Overrides

[`BaseFieldDirective`](BaseFieldDirective.md).[`emptyFieldEditingTemplate`](BaseFieldDirective.md#emptyfieldeditingtemplate)

***

### field

> `readonly` **field**: `InputSignal`\<[`ImageFieldValue`](../interfaces/ImageFieldValue.md) \| [`ImageField`](../interfaces/ImageField.md) \| `undefined`\>

Defined in: [packages/angular/src/components/field-directives/sc-image.directive.ts:51](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/sc-image.directive.ts#L51)

The Sitecore image field (raw value or `{ value }` wrapper).

#### Overrides

[`BaseFieldDirective`](BaseFieldDirective.md).[`field`](BaseFieldDirective.md#field)

***

### imageParams

> `readonly` **imageParams**: `InputSignal`\<\{\[`paramName`: `string`\]: `string` \| `number`; \} \| `undefined`\>

Defined in: [packages/angular/src/components/field-directives/sc-image.directive.ts:54](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/sc-image.directive.ts#L54)

Optional image params for media URL transformation.

***

### mediaUrlPrefix

> `readonly` **mediaUrlPrefix**: `InputSignal`\<`RegExp` \| `undefined`\>

Defined in: [packages/angular/src/components/field-directives/sc-image.directive.ts:57](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/sc-image.directive.ts#L57)

Optional media URL prefix regexp.

***

### renderer

> `protected` `readonly` **renderer**: `Renderer2`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:51](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/base-field.directive.ts#L51)

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`renderer`](BaseFieldDirective.md#renderer)

***

### templateRef

> `protected` `readonly` **templateRef**: `TemplateRef`\<`any`\>

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:50](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/base-field.directive.ts#L50)

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`templateRef`](BaseFieldDirective.md#templateref)

***

### viewContainer

> `protected` `readonly` **viewContainer**: `ViewContainerRef`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:49](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/base-field.directive.ts#L49)

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`viewContainer`](BaseFieldDirective.md#viewcontainer)

***

### viewRef?

> `protected` `optional` **viewRef?**: `EmbeddedViewRef`\<`unknown`\>

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:55](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/base-field.directive.ts#L55)

Embedded view created by the latest successful render; cleared on each tick.

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`viewRef`](BaseFieldDirective.md#viewref)

## Accessors

### fieldMetadata

#### Get Signature

> **get** `protected` **fieldMetadata**(): `Record`\<`string`, `unknown`\> \| `undefined`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:94](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/base-field.directive.ts#L94)

Field metadata payload, when present.

##### Returns

`Record`\<`string`, `unknown`\> \| `undefined`

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`fieldMetadata`](BaseFieldDirective.md#fieldmetadata)

## Methods

### isEditing()

> `protected` **isEditing**(): `boolean`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:89](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/base-field.directive.ts#L89)

Whether the host page is in editing mode. Falls back to `false` when no context is provided.

#### Returns

`boolean`

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`isEditing`](BaseFieldDirective.md#isediting)

***

### renderEditingChrome()

> `protected` **renderEditingChrome**(`kind`): `void`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:123](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/base-field.directive.ts#L123)

Inserts a single chrome marker into the structural slot when both editing mode is active
and the field carries metadata. No-ops otherwise.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `kind` | `MetadataKind` | Whether to emit the opening or closing marker. |

#### Returns

`void`

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`renderEditingChrome`](BaseFieldDirective.md#rendereditingchrome)

***

### renderEmpty()

> `protected` **renderEmpty**(): `void`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:104](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/base-field.directive.ts#L104)

Renders the empty-field state. In editing mode with field metadata, wraps either the
consumer's `emptyFieldEditingTemplate` or [defaultEmptyComponent](#defaultemptycomponent) in chrome markers
so Sitecore Pages can target the empty slot. Outside editing or without metadata, emits
nothing.

#### Returns

`void`

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`renderEmpty`](BaseFieldDirective.md#renderempty)

***

### shouldRender()

> `protected` **shouldRender**(): `boolean`

Defined in: [packages/angular/src/components/field-directives/sc-image.directive.ts:79](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/sc-image.directive.ts#L79)

Returns true when the field has a real value to render. Subclasses can override to add
field-specific rules (e.g. `ScLinkDirective` preserves authored text + href).

#### Returns

`boolean`

#### Overrides

[`BaseFieldDirective`](BaseFieldDirective.md).[`shouldRender`](BaseFieldDirective.md#shouldrender)

***

### updateView()

> `protected` **updateView**(): `void`

Defined in: [packages/angular/src/components/field-directives/sc-image.directive.ts:64](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/components/field-directives/sc-image.directive.ts#L64)

Renders the structural slot based on the current field value and editing state.
Subclasses compose `shouldRender → renderEmpty | (renderOpen → createEmbeddedView →
apply field value → renderClose)`.

#### Returns

`void`

#### Overrides

[`BaseFieldDirective`](BaseFieldDirective.md).[`updateView`](BaseFieldDirective.md#updateview)
