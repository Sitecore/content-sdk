[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderDataResult

# Type Alias: LoaderDataResult

> **LoaderDataResult** = \{ `data`: `unknown`; `kind`: `"data"`; \} \| \{ `kind`: `"redirect"`; `redirect`: [`LoaderRedirectResult`](LoaderRedirectResult.md); \} \| \{ `cause?`: `unknown`; `kind`: `"error"`; `message`: `string`; `status`: `number`; \}

Defined in: [packages/angular/src/loaders/models.ts:130](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/angular/src/loaders/models.ts#L130)

Result returned by loader resolution on the server (SSR and `/_data` endpoint).
Uses the shared cross-boundary loader registry; not a separate server loader set.
