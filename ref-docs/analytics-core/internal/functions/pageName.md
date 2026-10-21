[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / pageName

# Function: pageName()

> **pageName**(): `string`

Defined in: [analytics-core/src/infer/infer.ts:19](https://github.com/Sitecore/content-sdk/blob/f0d8e2f2a4d2702c275ba74dc0030e61bf69fd01/packages/analytics-core/src/infer/infer.ts#L19)

**`Internal`**

Returns the name of the current page extracted from the URL's pathname.
If it's the home page, it returns `Home Page`.

## Returns

`string`

`Home Page` if root, otherwise the pathname segment.
