[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / addThemeUpdateHandler

# Function: addThemeUpdateHandler()

> **addThemeUpdateHandler**(): (() => `void`) \| `undefined`

Defined in: [content/src/editing/theme-preview.ts:55](https://github.com/Sitecore/content-sdk/blob/958b502d1704bb305d7d8f1373f43324336459f6/packages/content/src/editing/theme-preview.ts#L55)

**`Internal`**

Adds the browser-side event handler for the `theme-update` message.
Used to support live preview of themes while in editing mode: the message's
CSS body is injected into a dedicated `<style>` element in `<head>`.

## Returns

(() => `void`) \| `undefined`

an unsubscribe function, or undefined if `window` is unavailable
