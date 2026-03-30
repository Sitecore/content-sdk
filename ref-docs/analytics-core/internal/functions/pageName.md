[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / pageName

# Function: pageName()

> **pageName**(): `string`

Defined in: [analytics-core/src/infer/infer.ts:19](https://github.com/Sitecore/content-sdk/blob/f7008cbcc73e6353a120cb1ae2a37404f22abe9f/packages/analytics-core/src/infer/infer.ts#L19)

**`Internal`**

Returns the name of the current page extracted from the URL's pathname.
If it's the home page, it returns `Home Page`.

## Returns

`string`

`Home Page` if root, otherwise the pathname segment.
