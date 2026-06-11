[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [components](../README.md) / ScLinkDirective

# Class: ScLinkDirective

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:61](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/sc-link.directive.ts#L61)

Structural directive that renders a Sitecore link field onto a consumer-supplied `<a>`.

Editing flow:
  - field has a renderable href/text → emit opening chrome marker, embed the consumer's
    `<a>` template, write `href/title/target/class/text` onto it (locale-aware), emit
    closing chrome marker.
  - field is empty in editing mode + has `metadata` → render the empty-link placeholder
    between markers (overridable via `scLinkEmptyFieldEditingTemplate`).

Locale-awareness: when a configured locale list is provided via `sitecore.config`,
internal hrefs are prefixed with the current URL locale (read from
[SitecoreContextService](../../lib/classes/SitecoreContextService.md)). Hrefs that already contain a configured-locale segment
are written as-is, which respects author-intent cross-locale links and keeps the
directive idempotent under repeated change detection.

Usage:
```html
<a *scLink="fields.Link"></a>
<a *scLink="fields.Link">Optional child content</a>
```

## Extends

- [`BaseFieldDirective`](BaseFieldDirective.md)\<`LinkField` \| `LinkFieldValue` \| `undefined`\>

## Extended by

- [`ScRouterLinkDirective`](ScRouterLinkDirective.md)

## Constructors

### Constructor

> **new ScLinkDirective**(): `ScLinkDirective`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:67](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/base-field.directive.ts#L67)

#### Returns

`ScLinkDirective`

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`constructor`](BaseFieldDirective.md#constructor)

## Properties

### context

> `protected` `readonly` **context**: [`SitecoreContextService`](../../lib/classes/SitecoreContextService.md) \| `null`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:54](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/base-field.directive.ts#L54)

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`context`](BaseFieldDirective.md#context)

***

### defaultEmptyComponent

> `protected` `readonly` **defaultEmptyComponent**: `Type`\<`unknown`\> = `DefaultEmptyFieldEditingComponent`

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:71](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/sc-link.directive.ts#L71)

Default component rendered when the field is empty in editing mode and no template is supplied.

#### Overrides

[`BaseFieldDirective`](BaseFieldDirective.md).[`defaultEmptyComponent`](BaseFieldDirective.md#defaultemptycomponent)

***

### emptyFieldEditingTemplate

> `readonly` **emptyFieldEditingTemplate**: `InputSignal`\<`TemplateRef`\<`unknown`\> \| `undefined`\>

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:67](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/sc-link.directive.ts#L67)

Consumer-supplied template rendered between chrome markers when the field is empty in editing mode.

#### Overrides

[`BaseFieldDirective`](BaseFieldDirective.md).[`emptyFieldEditingTemplate`](BaseFieldDirective.md#emptyfieldeditingtemplate)

***

### field

> `readonly` **field**: `InputSignal`\<`LinkField` \| `LinkFieldValue` \| `undefined`\>

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:63](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/sc-link.directive.ts#L63)

The Sitecore link field.

#### Overrides

[`BaseFieldDirective`](BaseFieldDirective.md).[`field`](BaseFieldDirective.md#field)

***

### preferTextFromField

> `readonly` **preferTextFromField**: `InputSignal`\<`boolean`\>

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:65](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/sc-link.directive.ts#L65)

Whether to override existing anchor text with the field's text value.

***

### renderer

> `protected` `readonly` **renderer**: `Renderer2`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:53](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/base-field.directive.ts#L53)

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`renderer`](BaseFieldDirective.md#renderer)

***

### sitecoreContext

> `protected` `readonly` **sitecoreContext**: [`SitecoreContextService`](../../lib/classes/SitecoreContextService.md)

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:72](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/sc-link.directive.ts#L72)

***

### templateRef

> `protected` `readonly` **templateRef**: `TemplateRef`\<`any`\>

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:52](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/base-field.directive.ts#L52)

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`templateRef`](BaseFieldDirective.md#templateref)

***

### viewContainer

> `protected` `readonly` **viewContainer**: `ViewContainerRef`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:51](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/base-field.directive.ts#L51)

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`viewContainer`](BaseFieldDirective.md#viewcontainer)

***

### viewRef?

> `protected` `optional` **viewRef?**: `EmbeddedViewRef`\<`unknown`\>

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:58](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/base-field.directive.ts#L58)

Embedded view created by the latest successful render; cleared on each tick.

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`viewRef`](BaseFieldDirective.md#viewref)

## Accessors

### fieldMetadata

#### Get Signature

> **get** `protected` **fieldMetadata**(): `Record`\<`string`, `unknown`\> \| `undefined`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:97](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/base-field.directive.ts#L97)

Field metadata payload, when present.

##### Returns

`Record`\<`string`, `unknown`\> \| `undefined`

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`fieldMetadata`](BaseFieldDirective.md#fieldmetadata)

## Methods

### applyValue()

> `protected` **applyValue**(): `void`

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:102](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/sc-link.directive.ts#L102)

#### Returns

`void`

***

### isEditing()

> `protected` **isEditing**(): `boolean`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:92](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/base-field.directive.ts#L92)

Whether the host page is in editing mode. Falls back to `false` when no context is provided.

#### Returns

`boolean`

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`isEditing`](BaseFieldDirective.md#isediting)

***

### renderEditingChrome()

> `protected` **renderEditingChrome**(`kind`): `void`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:131](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/base-field.directive.ts#L131)

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

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:107](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/base-field.directive.ts#L107)

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

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:92](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/sc-link.directive.ts#L92)

Returns true when the field has a real value to render. Subclasses can override to add
field-specific rules (e.g. `ScLinkDirective` preserves authored text + href).

#### Returns

`boolean`

#### Overrides

[`BaseFieldDirective`](BaseFieldDirective.md).[`shouldRender`](BaseFieldDirective.md#shouldrender)

***

### updateView()

> `protected` **updateView**(): `void`

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:77](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/components/field-directives/sc-link.directive.ts#L77)

Renders the structural slot based on the current field value and editing state.
Subclasses compose `shouldRender → renderEmpty | (renderOpen → createEmbeddedView →
apply field value → renderClose)`.

#### Returns

`void`

#### Overrides

[`BaseFieldDirective`](BaseFieldDirective.md).[`updateView`](BaseFieldDirective.md#updateview)
