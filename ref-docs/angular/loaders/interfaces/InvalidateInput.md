[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / InvalidateInput

# Interface: InvalidateInput

Defined in: [packages/angular/src/loaders/models.ts:268](https://github.com/Sitecore/content-sdk/blob/afdfd1979b6ab6fba690d64bcf17ea29b4d851bb/packages/angular/src/loaders/models.ts#L268)

Tag-based invalidation input.
Marks matching entries stale via the tag index; does not delete them (SWR semantics).

## Properties

### tags?

> `optional` **tags?**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:270](https://github.com/Sitecore/content-sdk/blob/afdfd1979b6ab6fba690d64bcf17ea29b4d851bb/packages/angular/src/loaders/models.ts#L270)

Non-empty list of OSR tags (for example `sc:item:…`, `sc:site:…`, or a cache key self-tag).
