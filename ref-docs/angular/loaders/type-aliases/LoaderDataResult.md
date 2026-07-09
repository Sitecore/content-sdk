[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderDataResult

# Type Alias: LoaderDataResult

> **LoaderDataResult** = \{ `data`: `unknown`; `kind`: `"data"`; \} \| \{ `kind`: `"redirect"`; `redirect`: [`LoaderRedirectResult`](LoaderRedirectResult.md); \} \| \{ `cause?`: `unknown`; `kind`: `"error"`; `message`: `string`; `status`: `number`; \}

Defined in: [packages/angular/src/loaders/models.ts:154](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/angular/src/loaders/models.ts#L154)

Result returned by loader resolution on the server (SSR and `/_data` endpoint).
Uses the shared cross-boundary loader registry; not a separate server loader set.
