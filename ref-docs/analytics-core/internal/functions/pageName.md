[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / pageName

# Function: pageName()

> **pageName**(): `string`

Defined in: [src/infer/infer.ts:17](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/analytics-core/src/infer/infer.ts#L17)

Returns the name of the current page extracted from the URL's pathname.
If it's the home page, it returns `Home Page`.

## Returns

`string`

`Home Page` if root, otherwise the pathname segment.
