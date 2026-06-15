[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [lib](../README.md) / SITECORE\_CONFIG\_TOKEN

# Variable: SITECORE\_CONFIG\_TOKEN

> `const` **SITECORE\_CONFIG\_TOKEN**: `InjectionToken`\<[`AngularSitecoreConfig`](../../config/interfaces/AngularSitecoreConfig.md)\>

Defined in: [packages/angular/src/lib/tokens.ts:12](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/lib/tokens.ts#L12)

Injection token for the Sitecore configuration.
Provided by `provideSitecoreAngular({ sitecoreConfig, sitecoreClient })`. Inject this to read config app-wide.
`AngularSitecoreConfig` extends `SitecoreConfig`, so consumers that previously typed the
value as `SitecoreConfig` remain structurally compatible.
