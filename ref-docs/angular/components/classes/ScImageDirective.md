[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [components](../README.md) / ScImageDirective

# Class: ScImageDirective

Defined in: [packages/angular/src/components/field-directives/sc-image.directive.ts:38](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/angular/src/components/field-directives/sc-image.directive.ts#L38)

Renders a Sitecore image field onto a host `<img>` element.
Sets `src`, `alt`, and other attributes from the field data.

Usage:
```html
<img [scImage]="fields.Image" />
```

## Constructors

### Constructor

> **new ScImageDirective**(): `ScImageDirective`

Defined in: [packages/angular/src/components/field-directives/sc-image.directive.ts:51](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/angular/src/components/field-directives/sc-image.directive.ts#L51)

#### Returns

`ScImageDirective`

## Properties

### imageParams

> `readonly` **imageParams**: `InputSignal`\<\{\[`paramName`: `string`\]: `string` \| `number`; \} \| `undefined`\>

Defined in: [packages/angular/src/components/field-directives/sc-image.directive.ts:43](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/angular/src/components/field-directives/sc-image.directive.ts#L43)

Optional image params for media URL transformation.

***

### mediaUrlPrefix

> `readonly` **mediaUrlPrefix**: `InputSignal`\<`RegExp` \| `undefined`\>

Defined in: [packages/angular/src/components/field-directives/sc-image.directive.ts:46](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/angular/src/components/field-directives/sc-image.directive.ts#L46)

Optional media URL prefix regexp.

***

### scImage

> `readonly` **scImage**: `InputSignal`\<[`ImageFieldValue`](../field-directives/interfaces/ImageFieldValue.md) \| [`ImageField`](../field-directives/interfaces/ImageField.md) \| `undefined`\>

Defined in: [packages/angular/src/components/field-directives/sc-image.directive.ts:40](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/angular/src/components/field-directives/sc-image.directive.ts#L40)

The Sitecore image field.
