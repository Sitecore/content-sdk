[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / omitJavascriptUrls

# Function: omitJavascriptUrls()

> **omitJavascriptUrls**(`html`): [`OmitJavascriptUrlsResult`](../type-aliases/OmitJavascriptUrlsResult.md)

Defined in: [packages/core/src/tools/omit-javascript-urls.ts:68](https://github.com/Sitecore/content-sdk/blob/47aea23db5c87b62b269d8f5d3e2ee45d9901657/packages/core/src/tools/omit-javascript-urls.ts#L68)

**`Internal`**

Removes javascript: URLs from URL-bearing attributes in an HTML string.
The surrounding markup and text are preserved. The input is not modified.
Logging is left to the caller.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `html` | `string` | HTML from a rich text or unencoded text field |

## Returns

[`OmitJavascriptUrlsResult`](../type-aliases/OmitJavascriptUrlsResult.md)

the cleaned HTML and the URLs that were removed
