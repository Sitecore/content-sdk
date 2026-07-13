[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderRegistry

# Type Alias: LoaderRegistry

> **LoaderRegistry** = `Record`\<`string`, [`LoaderFn`](LoaderFn.md)\>

Defined in: [packages/angular/src/loaders/loader-registry.token.ts:19](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/loader-registry.token.ts#L19)

Cross-boundary loader registry — maps loader IDs to loader functions.
The same registry is used for SSR, CSR (`/_data`), and route resolvers.
There is no separate server vs client loader set.
