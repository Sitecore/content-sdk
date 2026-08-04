[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [config](../README.md) / AngularSitecoreConfig

# Type Alias: AngularSitecoreConfig

> **AngularSitecoreConfig** = `DeepRequired`\<[`AngularSitecoreConfigInput`](../interfaces/AngularSitecoreConfigInput.md)\>

Defined in: [packages/angular/src/config/define-config.ts:57](https://github.com/Sitecore/content-sdk/blob/f3401a8f88338ab1fd34e5ea98096e167973633a/packages/angular/src/config/define-config.ts#L57)

Resolved Sitecore configuration for Angular apps. Extends the fully-resolved
SitecoreConfig; structurally still a `SitecoreConfig`, so existing callers that
type the value as `SitecoreConfig` continue to work. `redirects.locales` is intentionally
omitted at the type level — read the canonical locale list from `angular.locales`.
