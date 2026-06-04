[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [components](../README.md) / ScLinkDirective

# Class: ScLinkDirective

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:55](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/components/field-directives/sc-link.directive.ts#L55)

Renders a Sitecore link field onto a host `<a>` element.
Sets `href`, `title`, `target`, `class`, and text content from the field data.

Locale-awareness: when a configured locale list is provided via `sitecore.config`,
internal hrefs are prefixed with the current URL locale (read from
[SitecoreContextService](../../lib/classes/SitecoreContextService.md)). Hrefs that already contain a configured-locale segment
are written as-is, which respects author-intent cross-locale links and keeps the
directive idempotent under repeated change detection.

Usage:
```html
<a [scLink]="fields.Link">Optional child content</a>
```

## Extended by

- [`ScRouterLinkDirective`](ScRouterLinkDirective.md)

## Constructors

### Constructor

> **new ScLinkDirective**(): `ScLinkDirective`

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:72](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/components/field-directives/sc-link.directive.ts#L72)

#### Returns

`ScLinkDirective`

## Properties

### el

> `protected` `readonly` **el**: `ElementRef`\<`any`\>

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:62](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/components/field-directives/sc-link.directive.ts#L62)

***

### preferTextFromField

> `readonly` **preferTextFromField**: `InputSignal`\<`boolean`\>

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:60](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/components/field-directives/sc-link.directive.ts#L60)

Whether to show link text alongside existing child content.

***

### scLink

> `readonly` **scLink**: `InputSignal`\<`LinkField` \| `LinkFieldValue`\>

Defined in: [packages/angular/src/components/field-directives/sc-link.directive.ts:57](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/components/field-directives/sc-link.directive.ts#L57)

The Sitecore link field.
