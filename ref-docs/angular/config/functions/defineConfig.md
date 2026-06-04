[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [config](../README.md) / defineConfig

# Function: defineConfig()

> **defineConfig**(`config?`, `clientEnv?`): [`AngularSitecoreConfig`](../interfaces/AngularSitecoreConfig.md)

Defined in: [packages/angular/src/config/define-config.ts:106](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/config/define-config.ts#L106)

Merges `clientEnv` (browser-safe `environment*.ts`) with `process.env` for server-only variables,
then delegates to the base content `defineConfig` and adds the Angular-specific config layer.

- `angular.locales` is the single source of truth for the locale list; `defaultLanguage` is
  added when missing.
- `redirects.locales` is overwritten from `angular.locales` so the redirects proxy stays in sync.

On Node/SSR, load `.env` in the app entry before importing `sitecore.config` (see
`load-env.ts` in the sample).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`AngularSitecoreConfigInput`](../interfaces/AngularSitecoreConfigInput.md) | Base Sitecore configuration input. |
| `clientEnv?` | `Record`\<`string`, `string` \| `undefined`\> | Browser-safe env from `environment*.ts`. |

## Returns

[`AngularSitecoreConfig`](../interfaces/AngularSitecoreConfig.md)

Fully merged Sitecore configuration for Angular.
