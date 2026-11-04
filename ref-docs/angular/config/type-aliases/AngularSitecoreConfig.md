[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [config](../README.md) / AngularSitecoreConfig

# Type Alias: AngularSitecoreConfig

> **AngularSitecoreConfig** = `DeepRequired`\<[`AngularSitecoreConfigInput`](../interfaces/AngularSitecoreConfigInput.md)\>

Defined in: [packages/angular/src/config/define-config.ts:78](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/angular/src/config/define-config.ts#L78)

Resolved Sitecore configuration for Angular apps. Extends the fully-resolved
SitecoreConfig; structurally still a `SitecoreConfig`, so existing callers that
type the value as `SitecoreConfig` continue to work. `redirects.locales` is intentionally
omitted at the type level — read the canonical locale list from `angular.locales`.
