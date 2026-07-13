[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [components](../README.md) / ScRouterLinkDirective

# Class: ScRouterLinkDirective

Defined in: [packages/angular/src/components/field-directives/sc-router-link.directive.ts:24](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/sc-router-link.directive.ts#L24)

Structural directive that renders a Sitecore link field onto a consumer-supplied `<a>` and
routes in-app navigation through `Router.navigateByUrl`. Clicks are left to the browser
when `href` is missing/empty, when `target="_blank"`, or when the href uses an external
scheme (http(s), mailto, tel, sms, javascript, data, ftp, protocol-relative `//`).

Editing chrome + empty-field placeholder behavior is inherited from [ScLinkDirective](ScLinkDirective.md).

Usage:
```html
<a *scRouterLink="fields.Link">Optional child content</a>
```

## Extends

- [`ScLinkDirective`](ScLinkDirective.md)

## Constructors

### Constructor

> **new ScRouterLinkDirective**(): `ScRouterLinkDirective`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:64](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/base-field.directive.ts#L64)

#### Returns

`ScRouterLinkDirective`

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`constructor`](ScLinkDirective.md#constructor)

## Properties

### context

> `protected` `readonly` **context**: [`SitecoreContextService`](../../lib/classes/SitecoreContextService.md) \| `null`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:52](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/base-field.directive.ts#L52)

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`context`](ScLinkDirective.md#context)

***

### defaultEmptyComponent

> `protected` `readonly` **defaultEmptyComponent**: `Type`\<`unknown`\> = `DefaultEmptyFieldEditingComponent`

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:71](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/sc-link.directive.ts#L71)

Default component rendered when the field is empty in editing mode and no template is supplied.

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`defaultEmptyComponent`](ScLinkDirective.md#defaultemptycomponent)

***

### emptyFieldEditingTemplate

> `readonly` **emptyFieldEditingTemplate**: `InputSignal`\<`TemplateRef`\<`unknown`\> \| `undefined`\>

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:67](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/sc-link.directive.ts#L67)

Consumer-supplied template rendered between chrome markers when the field is empty in editing mode.

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`emptyFieldEditingTemplate`](ScLinkDirective.md#emptyfieldeditingtemplate)

***

### field

> `readonly` **field**: `InputSignal`\<`LinkField` \| `LinkFieldValue` \| `undefined`\>

Defined in: [packages/angular/src/components/field-directives/sc-router-link.directive.ts:26](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/sc-router-link.directive.ts#L26)

Sitecore link field; aliases the base [ScLinkDirective.field](ScLinkDirective.md#field) input to `scRouterLink`.

#### Overrides

[`ScLinkDirective`](ScLinkDirective.md).[`field`](ScLinkDirective.md#field)

***

### preferTextFromField

> `readonly` **preferTextFromField**: `InputSignal`\<`boolean`\>

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:65](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/sc-link.directive.ts#L65)

Whether to override existing anchor text with the field's text value.

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`preferTextFromField`](ScLinkDirective.md#prefertextfromfield)

***

### renderer

> `protected` `readonly` **renderer**: `Renderer2`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:51](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/base-field.directive.ts#L51)

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`renderer`](ScLinkDirective.md#renderer)

***

### sitecoreContext

> `protected` `readonly` **sitecoreContext**: [`SitecoreContextService`](../../lib/classes/SitecoreContextService.md)

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:72](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/sc-link.directive.ts#L72)

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`sitecoreContext`](ScLinkDirective.md#sitecorecontext)

***

### templateRef

> `protected` `readonly` **templateRef**: `TemplateRef`\<`any`\>

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:50](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/base-field.directive.ts#L50)

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`templateRef`](ScLinkDirective.md#templateref)

***

### viewContainer

> `protected` `readonly` **viewContainer**: `ViewContainerRef`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:49](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/base-field.directive.ts#L49)

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`viewContainer`](ScLinkDirective.md#viewcontainer)

***

### viewRef?

> `protected` `optional` **viewRef?**: `EmbeddedViewRef`\<`unknown`\>

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:55](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/base-field.directive.ts#L55)

Embedded view created by the latest successful render; cleared on each tick.

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`viewRef`](ScLinkDirective.md#viewref)

## Accessors

### fieldMetadata

#### Get Signature

> **get** `protected` **fieldMetadata**(): `Record`\<`string`, `unknown`\> \| `undefined`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:94](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/base-field.directive.ts#L94)

Field metadata payload, when present.

##### Returns

`Record`\<`string`, `unknown`\> \| `undefined`

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`fieldMetadata`](ScLinkDirective.md#fieldmetadata)

## Methods

### applyValue()

> `protected` **applyValue**(): `void`

Defined in: [packages/angular/src/components/field-directives/sc-router-link.directive.ts:33](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/sc-router-link.directive.ts#L33)

#### Returns

`void`

#### Overrides

[`ScLinkDirective`](ScLinkDirective.md).[`applyValue`](ScLinkDirective.md#applyvalue)

***

### isEditing()

> `protected` **isEditing**(): `boolean`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:89](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/base-field.directive.ts#L89)

Whether the host page is in editing mode. Falls back to `false` when no context is provided.

#### Returns

`boolean`

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`isEditing`](ScLinkDirective.md#isediting)

***

### renderEditingChrome()

> `protected` **renderEditingChrome**(`kind`): `void`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:123](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/base-field.directive.ts#L123)

Inserts a single chrome marker into the structural slot when both editing mode is active
and the field carries metadata. No-ops otherwise.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `kind` | `MetadataKind` | Whether to emit the opening or closing marker. |

#### Returns

`void`

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`renderEditingChrome`](ScLinkDirective.md#rendereditingchrome)

***

### renderEmpty()

> `protected` **renderEmpty**(): `void`

Defined in: [packages/angular/src/components/field-directives/base-field.directive.ts:104](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/base-field.directive.ts#L104)

Renders the empty-field state. In editing mode with field metadata, wraps either the
consumer's `emptyFieldEditingTemplate` or [defaultEmptyComponent](#defaultemptycomponent) in chrome markers
so Sitecore Pages can target the empty slot. Outside editing or without metadata, emits
nothing.

#### Returns

`void`

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`renderEmpty`](ScLinkDirective.md#renderempty)

***

### shouldRender()

> `protected` **shouldRender**(): `boolean`

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:92](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/sc-link.directive.ts#L92)

Returns true when the field has a real value to render. Subclasses can override to add
field-specific rules (e.g. `ScLinkDirective` preserves authored text + href).

#### Returns

`boolean`

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`shouldRender`](ScLinkDirective.md#shouldrender)

***

### updateView()

> `protected` **updateView**(): `void`

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:77](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/components/field-directives/sc-link.directive.ts#L77)

Renders the structural slot based on the current field value and editing state.
Subclasses compose `shouldRender → renderEmpty | (renderOpen → createEmbeddedView →
apply field value → renderClose)`.

#### Returns

`void`

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`updateView`](ScLinkDirective.md#updateview)
