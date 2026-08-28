[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / Document

# Interface: Document

Defined in: [content/src/atoms/types.ts:69](https://github.com/Sitecore/content-sdk/blob/2db997286d1a49ba2de622f5535feed2205c999a/packages/content/src/atoms/types.ts#L69)

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

Defined in: [content/src/atoms/types.ts:71](https://github.com/Sitecore/content-sdk/blob/2db997286d1a49ba2de622f5535feed2205c999a/packages/content/src/atoms/types.ts#L71)

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
