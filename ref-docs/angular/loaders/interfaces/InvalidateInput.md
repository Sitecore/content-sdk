[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / InvalidateInput

# Interface: InvalidateInput

Defined in: [packages/angular/src/loaders/models.ts:268](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/angular/src/loaders/models.ts#L268)

Tag-based invalidation input.
Marks matching entries stale via the tag index; does not delete them (SWR semantics).

## Properties

### tags?

> `optional` **tags?**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:270](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/angular/src/loaders/models.ts#L270)

Non-empty list of OSR tags (for example `sc:item:…`, `sc:site:…`, or a cache key self-tag).
