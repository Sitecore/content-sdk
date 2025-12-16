[**@sitecore-content-sdk/__core__**](../../README.md)

***

[@sitecore-content-sdk/__core__](../../README.md) / [internal](../README.md) / pageName

# Function: pageName()

> **pageName**(): `string`

Defined in: [src/infer/infer.ts:17](https://github.com/Sitecore/content-sdk/blob/6eb16655f677d9f2c9f82dbf67e6f8a92dd58ada/packages/__core__/src/infer/infer.ts#L17)

Returns the name of the current page extracted from the URL's pathname.
If it's the home page, it returns `Home Page`.

## Returns

`string`

`Home Page` if root, otherwise the pathname segment.
