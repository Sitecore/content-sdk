[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [lib](../README.md) / provideSitecoreAngular

# Function: provideSitecoreAngular()

> **provideSitecoreAngular**(`init`): `EnvironmentProviders`

Defined in: [packages/angular/src/lib/providers.ts:60](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/angular/src/lib/providers.ts#L60)

Provides Sitecore Angular SDK services to the application.
Call this in your `app.config.ts` `providers` array.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `init` | [`AngularCSDKAppInit`](../interfaces/AngularCSDKAppInit.md) | SDK configuration |

## Returns

`EnvironmentProviders`

Angular environment providers

## Example

```ts
// app.config.ts
import scConfig from '../sitecore.config';
import { getClient } from '../content-sdk/client/sitecore-client';
export const appConfig: ApplicationConfig = {
  providers: [
    provideSitecoreAngular({ sitecoreConfig: scConfig, sitecoreClient: getClient() }),
  ],
};
@public
```
