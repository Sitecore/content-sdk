[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderDataResult

# Type Alias: LoaderDataResult

> **LoaderDataResult** = \{ `data`: `unknown`; `kind`: `"data"`; \} \| \{ `kind`: `"redirect"`; `redirect`: [`LoaderRedirectResult`](LoaderRedirectResult.md); \} \| \{ `cause?`: `unknown`; `kind`: `"error"`; `message`: `string`; `status`: `number`; \}

Defined in: [packages/angular/src/loaders/models.ts:154](https://github.com/Sitecore/content-sdk/blob/e17d474f9d8e82d1d42d4d085f91ccae5ee8b662/packages/angular/src/loaders/models.ts#L154)

Result returned by loader resolution on the server (SSR and `/_data` endpoint).
Uses the shared cross-boundary loader registry; not a separate server loader set.
