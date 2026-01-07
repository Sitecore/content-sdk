[**@sitecore-content-sdk/__core__**](../../README.md)

***

[@sitecore-content-sdk/__core__](../../README.md) / [internal](../README.md) / pageName

# Function: pageName()

> **pageName**(): `string`

Defined in: [src/infer/infer.ts:17](https://github.com/Sitecore/content-sdk/blob/a92cd174849c6a63e55e22ffdf4753663b81fab9/packages/__core__/src/infer/infer.ts#L17)

Returns the name of the current page extracted from the URL's pathname.
If it's the home page, it returns `Home Page`.

## Returns

`string`

`Home Page` if root, otherwise the pathname segment.
