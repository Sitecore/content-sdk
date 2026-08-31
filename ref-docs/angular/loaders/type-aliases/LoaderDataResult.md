[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderDataResult

# Type Alias: LoaderDataResult

> **LoaderDataResult** = \{ `data`: `unknown`; `kind`: `"data"`; \} \| \{ `kind`: `"redirect"`; `redirect`: [`LoaderRedirectResult`](LoaderRedirectResult.md); \} \| \{ `cause?`: `unknown`; `kind`: `"error"`; `message`: `string`; `status`: `number`; \}

Defined in: [packages/angular/src/loaders/models.ts:157](https://github.com/Sitecore/content-sdk/blob/6320ef720fd2c837d6aad938ce6e7c5806cb2aa6/packages/angular/src/loaders/models.ts#L157)

Result returned by loader resolution on the server (SSR and `/_data` endpoint).
Uses the shared cross-boundary loader registry; not a separate server loader set.
