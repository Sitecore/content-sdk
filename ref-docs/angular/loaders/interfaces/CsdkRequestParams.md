[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / CsdkRequestParams

# Interface: CsdkRequestParams

Defined in: [packages/angular/src/loaders/models.ts:10](https://github.com/Sitecore/content-sdk/blob/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46/packages/angular/src/loaders/models.ts#L10)

Content SDK request params like site name, variant ids

## Properties

### componentVariantIds?

> `optional` **componentVariantIds?**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:16](https://github.com/Sitecore/content-sdk/blob/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46/packages/angular/src/loaders/models.ts#L16)

Component variant IDs

***

### siteName?

> `optional` **siteName?**: `string`

Defined in: [packages/angular/src/loaders/models.ts:12](https://github.com/Sitecore/content-sdk/blob/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46/packages/angular/src/loaders/models.ts#L12)

Site name. Resolved from the request hostname

***

### variantId?

> `optional` **variantId?**: `string`

Defined in: [packages/angular/src/loaders/models.ts:14](https://github.com/Sitecore/content-sdk/blob/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46/packages/angular/src/loaders/models.ts#L14)

Variant id. Either resovled from route or set to default variant id name
