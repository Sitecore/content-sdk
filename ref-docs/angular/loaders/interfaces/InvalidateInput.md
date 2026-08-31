[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / InvalidateInput

# Interface: InvalidateInput

Defined in: [packages/angular/src/loaders/models.ts:268](https://github.com/Sitecore/content-sdk/blob/6320ef720fd2c837d6aad938ce6e7c5806cb2aa6/packages/angular/src/loaders/models.ts#L268)

Tag-based invalidation input.
Marks matching entries stale via the tag index; does not delete them (SWR semantics).

## Properties

### tags?

> `optional` **tags?**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:270](https://github.com/Sitecore/content-sdk/blob/6320ef720fd2c837d6aad938ce6e7c5806cb2aa6/packages/angular/src/loaders/models.ts#L270)

Non-empty list of OSR tags (for example `sc:item:…`, `sc:site:…`, or a cache key self-tag).
