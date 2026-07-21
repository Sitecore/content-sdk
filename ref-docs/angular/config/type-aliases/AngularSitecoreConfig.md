[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [config](../README.md) / AngularSitecoreConfig

# Type Alias: AngularSitecoreConfig

> **AngularSitecoreConfig** = `DeepRequired`\<[`AngularSitecoreConfigInput`](../interfaces/AngularSitecoreConfigInput.md)\>

Defined in: [packages/angular/src/config/define-config.ts:57](https://github.com/Sitecore/content-sdk/blob/ce897227369d7cdccf3cbb79b621c67585f7aff6/packages/angular/src/config/define-config.ts#L57)

Resolved Sitecore configuration for Angular apps. Extends the fully-resolved
SitecoreConfig; structurally still a `SitecoreConfig`, so existing callers that
type the value as `SitecoreConfig` continue to work. `redirects.locales` is intentionally
omitted at the type level — read the canonical locale list from `angular.locales`.
