[**@sitecore-content-sdk/richtext**](../README.md)

***

[@sitecore-content-sdk/richtext](../README.md) / getRichTextHtml

# Function: getRichTextHtml()

> **getRichTextHtml**(`content`, `extensions`): `string`

Defined in: [parse-tiptap-json.ts:12](https://github.com/Sitecore/xmc-jss-dev/blob/99b79b70ecdd8272d2885ff915ba6fc798d5fd0a/packages/richtext/src/utils/parse-tiptap-json.ts#L12)

Parses JSON formatted for Tiptap into HTML

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `content` | `JSONContent` | `undefined` | Tiptap-formatted JSON content to be parsed |
| `extensions` | `Extensions` | `[]` | Extra Tiptap extensions to process content with, in addition to StarterKit |

## Returns

`string`

Transformed HTML
