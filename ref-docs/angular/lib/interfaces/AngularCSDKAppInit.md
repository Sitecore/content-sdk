[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [lib](../README.md) / AngularCSDKAppInit

# Interface: AngularCSDKAppInit

Defined in: [packages/angular/src/lib/providers.ts:15](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/angular/src/lib/providers.ts#L15)

Configuration for the Sitecore Angular SDK.

## Properties

### errorRoute?

> `optional` **errorRoute?**: `string`

Defined in: [packages/angular/src/lib/providers.ts:27](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/angular/src/lib/providers.ts#L27)

***

### notFoundRoute?

> `optional` **notFoundRoute?**: `string`

Defined in: [packages/angular/src/lib/providers.ts:26](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/angular/src/lib/providers.ts#L26)

***

### sitecoreClient?

> `optional` **sitecoreClient?**: [`SitecoreClient`](../content/client/classes/SitecoreClient.md)

Defined in: [packages/angular/src/lib/providers.ts:25](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/angular/src/lib/providers.ts#L25)

Application-owned [SitecoreClient](../content/client/classes/SitecoreClient.md) instance (e.g. from a module singleton).
Required when [sitecoreConfig](#sitecoreconfig) is set; registered as [SITECORE\_CLIENT\_TOKEN](../variables/SITECORE_CLIENT_TOKEN.md).

***

### sitecoreConfig?

> `optional` **sitecoreConfig?**: [`AngularSitecoreConfig`](../../config/interfaces/AngularSitecoreConfig.md)

Defined in: [packages/angular/src/lib/providers.ts:20](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/angular/src/lib/providers.ts#L20)

Sitecore configuration (e.g. from sitecore.config.ts).
When provided, [sitecoreClient](#sitecoreclient) must also be set; both are registered for DI.
