[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / addThemeUpdateHandler

# Function: addThemeUpdateHandler()

> **addThemeUpdateHandler**(): (() => `void`) \| `undefined`

Defined in: [content/src/editing/theme-preview.ts:55](https://github.com/Sitecore/content-sdk/blob/d5ea81c08b96d9a7a94e6b7a230773c14fa1940d/packages/content/src/editing/theme-preview.ts#L55)

**`Internal`**

Adds the browser-side event handler for the `theme-update` message.
Used to support live preview of themes while in editing mode: the message's
CSS body is injected into a dedicated `<style>` element in `<head>`.

## Returns

(() => `void`) \| `undefined`

an unsubscribe function, or undefined if `window` is unavailable
