[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [config](../README.md) / AngularSitecoreConfig

# Type Alias: AngularSitecoreConfig

> **AngularSitecoreConfig** = `DeepRequired`\<[`AngularSitecoreConfigInput`](../interfaces/AngularSitecoreConfigInput.md)\>

Defined in: [packages/angular/src/config/define-config.ts:78](https://github.com/Sitecore/content-sdk/blob/39e7906136a3f4d536b6cf742452481a0c9b6957/packages/angular/src/config/define-config.ts#L78)

Resolved Sitecore configuration for Angular apps. Extends the fully-resolved
SitecoreConfig; structurally still a `SitecoreConfig`, so existing callers that
type the value as `SitecoreConfig` continue to work. `redirects.locales` is intentionally
omitted at the type level — read the canonical locale list from `angular.locales`.
