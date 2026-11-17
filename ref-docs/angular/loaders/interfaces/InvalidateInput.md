[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / InvalidateInput

# Interface: InvalidateInput

Defined in: [packages/angular/src/loaders/models.ts:265](https://github.com/Sitecore/content-sdk/blob/462e9bc1b890973f790c4ba0d500ff0712ebc051/packages/angular/src/loaders/models.ts#L265)

Tag-based invalidation input.
Marks matching entries stale via the tag index; does not delete them (SWR semantics).

## Properties

### tags?

> `optional` **tags?**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:267](https://github.com/Sitecore/content-sdk/blob/462e9bc1b890973f790c4ba0d500ff0712ebc051/packages/angular/src/loaders/models.ts#L267)

Non-empty list of OSR tags (for example `sc:item:…`, `sc:site:…`, or a cache key self-tag).
