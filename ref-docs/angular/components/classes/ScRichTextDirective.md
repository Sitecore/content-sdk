[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [components](../README.md) / ScRichTextDirective

# Class: ScRichTextDirective

Defined in: [packages/angular/src/components/field-directives/sc-rich-text.directive.ts:26](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/angular/src/components/field-directives/sc-rich-text.directive.ts#L26)

Renders a Sitecore rich text field value as innerHTML of the host element.
Content is marked trusted for Angular sanitization (typical for CMS-authored HTML).

Usage:
```html
<div [scRichText]="fields.Content"></div>
```

## Constructors

### Constructor

> **new ScRichTextDirective**(): `ScRichTextDirective`

Defined in: [packages/angular/src/components/field-directives/sc-rich-text.directive.ts:34](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/angular/src/components/field-directives/sc-rich-text.directive.ts#L34)

#### Returns

`ScRichTextDirective`

## Properties

### scRichText

> `readonly` **scRichText**: `InputSignal`\<`TextField`\>

Defined in: [packages/angular/src/components/field-directives/sc-rich-text.directive.ts:28](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/angular/src/components/field-directives/sc-rich-text.directive.ts#L28)

The Sitecore rich text field.
