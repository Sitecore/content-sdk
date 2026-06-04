[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [lib](../README.md) / SITECORE\_CONFIG\_TOKEN

# Variable: SITECORE\_CONFIG\_TOKEN

> `const` **SITECORE\_CONFIG\_TOKEN**: `InjectionToken`\<[`AngularSitecoreConfig`](../../config/interfaces/AngularSitecoreConfig.md)\>

Defined in: [packages/angular/src/lib/tokens.ts:12](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/lib/tokens.ts#L12)

Injection token for the Sitecore configuration.
Provided by `provideSitecoreAngular({ sitecoreConfig, sitecoreClient })`. Inject this to read config app-wide.
`AngularSitecoreConfig` extends `SitecoreConfig`, so consumers that previously typed the
value as `SitecoreConfig` remain structurally compatible.
