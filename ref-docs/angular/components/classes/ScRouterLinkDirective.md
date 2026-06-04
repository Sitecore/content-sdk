[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [components](../README.md) / ScRouterLinkDirective

# Class: ScRouterLinkDirective

Defined in: [packages/angular/src/components/field-directives/sc-router-link.directive.ts:21](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/components/field-directives/sc-router-link.directive.ts#L21)

Renders a Sitecore link field onto a host `<a>` and calls `Router.navigateByUrl` on click
for in-app paths only. Clicks are left to the browser when `href` is missing/empty, when
`target="_blank"`, or when `href` uses http(s), mailto, tel, sms, javascript, data, ftp,
or protocol-relative (`//`) URLs.

Usage:
```html
<a [scRouterLink]="fields.Link">Optional child content</a>
```

## Extends

- [`ScLinkDirective`](ScLinkDirective.md)

## Constructors

### Constructor

> **new ScRouterLinkDirective**(): `ScRouterLinkDirective`

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:72](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/components/field-directives/sc-link.directive.ts#L72)

#### Returns

`ScRouterLinkDirective`

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`constructor`](ScLinkDirective.md#constructor)

## Properties

### el

> `protected` `readonly` **el**: `ElementRef`\<`any`\>

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:62](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/components/field-directives/sc-link.directive.ts#L62)

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`el`](ScLinkDirective.md#el)

***

### preferTextFromField

> `readonly` **preferTextFromField**: `InputSignal`\<`boolean`\>

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:60](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/components/field-directives/sc-link.directive.ts#L60)

Whether to show link text alongside existing child content.

#### Inherited from

[`ScLinkDirective`](ScLinkDirective.md).[`preferTextFromField`](ScLinkDirective.md#prefertextfromfield)

***

### scLink

> `readonly` **scLink**: `InputSignal`\<`LinkField` \| `LinkFieldValue`\>

Defined in: [packages/angular/src/components/field-directives/sc-router-link.directive.ts:25](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/components/field-directives/sc-router-link.directive.ts#L25)

Sitecore link field; host attribute `[scRouterLink]` maps to the base [ScLinkDirective.scLink](ScLinkDirective.md#sclink) input.

#### Overrides

[`ScLinkDirective`](ScLinkDirective.md).[`scLink`](ScLinkDirective.md#sclink)

## Methods

### onClick()

> **onClick**(`event`): `void`

Defined in: [packages/angular/src/components/field-directives/sc-router-link.directive.ts:30](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/components/field-directives/sc-router-link.directive.ts#L30)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `MouseEvent` |

#### Returns

`void`
