[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / InvalidateInput

# Interface: InvalidateInput

Defined in: [packages/angular/src/loaders/models.ts:265](https://github.com/Sitecore/content-sdk/blob/07c6169d94098a2bc2f491ef61de4d253b52b098/packages/angular/src/loaders/models.ts#L265)

Tag-based invalidation input.
Marks matching entries stale via the tag index; does not delete them (SWR semantics).

## Properties

### tags?

> `optional` **tags?**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:267](https://github.com/Sitecore/content-sdk/blob/07c6169d94098a2bc2f491ef61de4d253b52b098/packages/angular/src/loaders/models.ts#L267)

Non-empty list of OSR tags (for example `sc:item:…`, `sc:site:…`, or a cache key self-tag).
