[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / Document

# Interface: Document

Defined in: [content/src/atoms/types.ts:77](https://github.com/Sitecore/content-sdk/blob/eb4a5a9ee099182eed23366c9fea12d5faf5c541/packages/content/src/atoms/types.ts#L77)

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

Defined in: [content/src/atoms/types.ts:79](https://github.com/Sitecore/content-sdk/blob/eb4a5a9ee099182eed23366c9fea12d5faf5c541/packages/content/src/atoms/types.ts#L79)

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
