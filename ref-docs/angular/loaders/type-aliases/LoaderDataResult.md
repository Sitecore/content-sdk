[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderDataResult

# Type Alias: LoaderDataResult

> **LoaderDataResult** = \{ `data`: `unknown`; `kind`: `"data"`; \} \| \{ `kind`: `"redirect"`; `redirect`: [`LoaderRedirectResult`](LoaderRedirectResult.md); \} \| \{ `cause?`: `unknown`; `kind`: `"error"`; `message`: `string`; `status`: `number`; \}

Defined in: [packages/angular/src/loaders/models.ts:157](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/angular/src/loaders/models.ts#L157)

Result returned by loader resolution on the server (SSR and `/_data` endpoint).
Uses the shared cross-boundary loader registry; not a separate server loader set.
