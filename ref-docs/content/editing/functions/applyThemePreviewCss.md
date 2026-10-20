[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / applyThemePreviewCss

# Function: applyThemePreviewCss()

> **applyThemePreviewCss**(`css`): `void`

Defined in: [content/src/editing/theme-preview.ts:36](https://github.com/Sitecore/content-sdk/blob/3e573fc42ab394415c9745258970d127cda84bbd/packages/content/src/editing/theme-preview.ts#L36)

**`Internal`**

Finds the theme preview `<style>` element (creating it if needed) and replaces its
content with the given CSS. Always (re)appended as the last child of `<head>` so it
takes precedence over the page-level theme `<link>` (same specificity, later source
order wins). Passing an empty string removes the style element without adding a new one.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `css` | `string` | raw CSS to inject into the style element |

## Returns

`void`
