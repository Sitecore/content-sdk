[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [components](../README.md) / ScTextDirective

# Class: ScTextDirective

Defined in: [packages/angular/src/components/field-directives/sc-text.directive.ts:18](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/components/field-directives/sc-text.directive.ts#L18)

Renders a Sitecore text field value into the host element's text content.
For simple string/number fields in published mode.

Usage:
```html
<h1 [scText]="fields.Title"></h1>
<span [scText]="fields.Subtitle" scTextEncode="false"></span>
```

## Constructors

### Constructor

> **new ScTextDirective**(): `ScTextDirective`

Defined in: [packages/angular/src/components/field-directives/sc-text.directive.ts:28](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/components/field-directives/sc-text.directive.ts#L28)

#### Returns

`ScTextDirective`

## Properties

### scText

> `readonly` **scText**: `InputSignal`\<`TextField`\>

Defined in: [packages/angular/src/components/field-directives/sc-text.directive.ts:20](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/components/field-directives/sc-text.directive.ts#L20)

The Sitecore text field.

***

### scTextEncode

> `readonly` **scTextEncode**: `InputSignal`\<`boolean`\>

Defined in: [packages/angular/src/components/field-directives/sc-text.directive.ts:23](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/components/field-directives/sc-text.directive.ts#L23)

Whether to HTML-encode the value (default: true). When false, uses innerHTML.
