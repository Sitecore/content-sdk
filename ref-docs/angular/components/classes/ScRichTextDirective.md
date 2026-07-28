[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [components](../README.md) / ScRichTextDirective

# Class: ScRichTextDirective

Defined in: [packages/angular/src/components/field-directives/sc-rich-text.directive.ts:23](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/angular/src/components/field-directives/sc-rich-text.directive.ts#L23)

Structural directive that renders a Sitecore rich-text field value as the `innerHTML` of
the consumer-supplied wrapper element.

Internal links inside the rendered HTML are intercepted and routed through
Router.navigateByUrl so CMS-authored in-app links behave like SPA navigation.
External URLs, `target="_blank"`, and links clicked while the page is in editing mode
are left to the browser.

## Extends

- [`BaseFieldDirective`](BaseFieldDirective.md)\<`TextField` \| `undefined`\>

## Constructors

### Constructor

> **new ScRichTextDirective**(): `ScRichTextDirective`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:64](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/angular/src/components/field-directives/base-field.directive.ts#L64)

#### Returns

`ScRichTextDirective`

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`constructor`](BaseFieldDirective.md#constructor)

## Properties

### context

> `protected` `readonly` **context**: [`SitecoreContextService`](../../lib/classes/SitecoreContextService.md) \| `null`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:52](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/angular/src/components/field-directives/base-field.directive.ts#L52)

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`context`](BaseFieldDirective.md#context)

***

### defaultEmptyComponent

> `protected` `readonly` **defaultEmptyComponent**: `Type`\<`unknown`\> = `DefaultEmptyFieldEditingComponent`

Defined in: [packages/angular/src/components/field-directives/sc-rich-text.directive.ts:32](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/angular/src/components/field-directives/sc-rich-text.directive.ts#L32)

Default component rendered when the field is empty in editing mode and no template is supplied.

#### Overrides

[`BaseFieldDirective`](BaseFieldDirective.md).[`defaultEmptyComponent`](BaseFieldDirective.md#defaultemptycomponent)

***

### emptyFieldEditingTemplate

> `readonly` **emptyFieldEditingTemplate**: `InputSignal`\<`TemplateRef`\<`unknown`\> \| `undefined`\>

Defined in: [packages/angular/src/components/field-directives/sc-rich-text.directive.ts:28](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/angular/src/components/field-directives/sc-rich-text.directive.ts#L28)

Consumer-supplied template rendered between chrome markers when the field is empty in editing mode.

#### Overrides

[`BaseFieldDirective`](BaseFieldDirective.md).[`emptyFieldEditingTemplate`](BaseFieldDirective.md#emptyfieldeditingtemplate)

***

### field

> `readonly` **field**: `InputSignal`\<`TextField` \| `undefined`\>

Defined in: [packages/angular/src/components/field-directives/sc-rich-text.directive.ts:25](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/angular/src/components/field-directives/sc-rich-text.directive.ts#L25)

The Sitecore rich-text field.

#### Overrides

[`BaseFieldDirective`](BaseFieldDirective.md).[`field`](BaseFieldDirective.md#field)

***

### renderer

> `protected` `readonly` **renderer**: `Renderer2`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:51](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/angular/src/components/field-directives/base-field.directive.ts#L51)

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`renderer`](BaseFieldDirective.md#renderer)

***

### templateRef

> `protected` `readonly` **templateRef**: `TemplateRef`\<`any`\>

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:50](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/angular/src/components/field-directives/base-field.directive.ts#L50)

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`templateRef`](BaseFieldDirective.md#templateref)

***

### viewContainer

> `protected` `readonly` **viewContainer**: `ViewContainerRef`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:49](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/angular/src/components/field-directives/base-field.directive.ts#L49)

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`viewContainer`](BaseFieldDirective.md#viewcontainer)

***

### viewRef?

> `protected` `optional` **viewRef?**: `EmbeddedViewRef`\<`unknown`\>

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:55](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/angular/src/components/field-directives/base-field.directive.ts#L55)

Embedded view created by the latest successful render; cleared on each tick.

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`viewRef`](BaseFieldDirective.md#viewref)

## Accessors

### fieldMetadata

#### Get Signature

> **get** `protected` **fieldMetadata**(): `Record`\<`string`, `unknown`\> \| `undefined`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:94](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/angular/src/components/field-directives/base-field.directive.ts#L94)

Field metadata payload, when present.

##### Returns

`Record`\<`string`, `unknown`\> \| `undefined`

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`fieldMetadata`](BaseFieldDirective.md#fieldmetadata)

## Methods

### isEditing()

> `protected` **isEditing**(): `boolean`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:89](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/angular/src/components/field-directives/base-field.directive.ts#L89)

Whether the host page is in editing mode. Falls back to `false` when no context is provided.

#### Returns

`boolean`

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`isEditing`](BaseFieldDirective.md#isediting)

***

### renderEditingChrome()

> `protected` **renderEditingChrome**(`kind`): `void`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:123](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/angular/src/components/field-directives/base-field.directive.ts#L123)

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

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:104](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/angular/src/components/field-directives/base-field.directive.ts#L104)

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

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:83](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/angular/src/components/field-directives/base-field.directive.ts#L83)

Returns true when the field has a real value to render. Subclasses can override to add
field-specific rules (e.g. `ScLinkDirective` preserves authored text + href).

#### Returns

`boolean`

#### Inherited from

[`BaseFieldDirective`](BaseFieldDirective.md).[`shouldRender`](BaseFieldDirective.md#shouldrender)

***

### updateView()

> `protected` **updateView**(): `void`

Defined in: [packages/angular/src/components/field-directives/sc-rich-text.directive.ts:38](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/angular/src/components/field-directives/sc-rich-text.directive.ts#L38)

Renders the structural slot based on the current field value and editing state.
Subclasses compose `shouldRender → renderEmpty | (renderOpen → createEmbeddedView →
apply field value → renderClose)`.

#### Returns

`void`

#### Overrides

[`BaseFieldDirective`](BaseFieldDirective.md).[`updateView`](BaseFieldDirective.md#updateview)
