[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / OmitJavascriptUrlsResult

# Type Alias: OmitJavascriptUrlsResult

> **OmitJavascriptUrlsResult** = `object`

Defined in: [packages/core/src/tools/omit-javascript-urls.ts:17](https://github.com/Sitecore/content-sdk/blob/70cc3e22e6077307faa68bfeead5defb753a25b8/packages/core/src/tools/omit-javascript-urls.ts#L17)

**`Internal`**

Result of removing javascript: URLs from an HTML string.

## Properties

### html

> **html**: `string`

Defined in: [packages/core/src/tools/omit-javascript-urls.ts:19](https://github.com/Sitecore/content-sdk/blob/70cc3e22e6077307faa68bfeead5defb753a25b8/packages/core/src/tools/omit-javascript-urls.ts#L19)

HTML with the javascript: URL attributes removed.

***

### omittedUrls

> **omittedUrls**: `string`[]

Defined in: [packages/core/src/tools/omit-javascript-urls.ts:21](https://github.com/Sitecore/content-sdk/blob/70cc3e22e6077307faa68bfeead5defb753a25b8/packages/core/src/tools/omit-javascript-urls.ts#L21)

The decoded URLs that were removed, in document order.
