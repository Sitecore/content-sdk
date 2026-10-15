[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / Document

# Interface: Document

Defined in: [content/src/atoms/types.ts:100](https://github.com/Sitecore/content-sdk/blob/2ebaba6454c3e55795d63c8d38a7bfd15c6ab5ac/packages/content/src/atoms/types.ts#L100)

**`Internal`**

A document is a JSON object that conforms to the JSON Schema specification.

## Extends

- `Spec`

## Properties

### elements

> **elements**: `Record`\<`string`, `UIElement`\>

Defined in: content/node\_modules/@json-render/core/dist/store-utils-CGwRAVOR.d.ts:408

Flat map of elements by key

#### Inherited from

`Spec.elements`

***

### name

> **name**: `string`

Defined in: [content/src/atoms/types.ts:102](https://github.com/Sitecore/content-sdk/blob/2ebaba6454c3e55795d63c8d38a7bfd15c6ab5ac/packages/content/src/atoms/types.ts#L102)

Human-readable identifier of the document.

***

### root

> **root**: `string`

Defined in: content/node\_modules/@json-render/core/dist/store-utils-CGwRAVOR.d.ts:406

Root element key

#### Inherited from

`Spec.root`

***

### state?

> `optional` **state?**: `Record`\<`string`, `unknown`\>

Defined in: content/node\_modules/@json-render/core/dist/store-utils-CGwRAVOR.d.ts:411

Optional initial state to seed the state model.
 Components using statePath will read from / write to this state.

#### Inherited from

`Spec.state`
