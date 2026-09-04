[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [components](../README.md) / ScFormComponent

# Class: ScFormComponent

Defined in: [packages/angular/src/components/sc-form.component.ts:35](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/angular/src/components/sc-form.component.ts#L35)

Angular wrapper for Sitecore Forms.
Loads form HTML from Edge using the page language, exposes that language on the
host element, executes embedded scripts, and subscribes to form events.

Usage: register in the component map with the rendering name "Form".

## Constructors

### Constructor

> **new ScFormComponent**(): `ScFormComponent`

Defined in: [packages/angular/src/components/sc-form.component.ts:54](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/angular/src/components/sc-form.component.ts#L54)

#### Returns

`ScFormComponent`

## Properties

### params

> `readonly` **params**: `InputSignal`\<\{\[`key`: `string`\]: `string`; \}\>

Defined in: [packages/angular/src/components/sc-form.component.ts:40](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/angular/src/components/sc-form.component.ts#L40)

***

### rendering

> `readonly` **rendering**: `InputSignal`\<`ComponentRendering`\<`ComponentFields`\> \| `undefined`\>

Defined in: [packages/angular/src/components/sc-form.component.ts:39](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/angular/src/components/sc-form.component.ts#L39)

## Methods

### language()

> `readonly` **language**(): `string`

Defined in: [packages/angular/src/components/sc-form.component.ts:113](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/angular/src/components/sc-form.component.ts#L113)

#### Returns

`string`

***

### renderingId()

> `readonly` **renderingId**(): `string` \| `undefined`

Defined in: [packages/angular/src/components/sc-form.component.ts:109](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/angular/src/components/sc-form.component.ts#L109)

#### Returns

`string` \| `undefined`

***

### styles()

> `readonly` **styles**(): `string`

Defined in: [packages/angular/src/components/sc-form.component.ts:104](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/angular/src/components/sc-form.component.ts#L104)

#### Returns

`string`
