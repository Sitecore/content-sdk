[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [components](../README.md) / ScRichTextDirective

# Class: ScRichTextDirective

Defined in: [packages/angular/src/components/field-directives/sc-rich-text.directive.ts:26](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/components/field-directives/sc-rich-text.directive.ts#L26)

Renders a Sitecore rich text field value as innerHTML of the host element.
Content is marked trusted for Angular sanitization (typical for CMS-authored HTML).

Usage:
```html
<div [scRichText]="fields.Content"></div>
```

## Constructors

### Constructor

> **new ScRichTextDirective**(): `ScRichTextDirective`

Defined in: [packages/angular/src/components/field-directives/sc-rich-text.directive.ts:34](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/components/field-directives/sc-rich-text.directive.ts#L34)

#### Returns

`ScRichTextDirective`

## Properties

### scRichText

> `readonly` **scRichText**: `InputSignal`\<`TextField`\>

Defined in: [packages/angular/src/components/field-directives/sc-rich-text.directive.ts:28](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/components/field-directives/sc-rich-text.directive.ts#L28)

The Sitecore rich text field.
