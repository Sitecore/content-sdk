[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderIdMap

# Interface: LoaderIdMap

Defined in: [packages/angular/src/loaders/loader-resolver.ts:49](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/angular/src/loaders/loader-resolver.ts#L49)

Extension point for custom loader IDs. Augment this interface so that
loaderResolver() accepts your loader ids when you add them via provideLoaderRegistry().

## Example

```ts
// In your app (e.g. app.d.ts or a types file):
declare module '@sitecore-content-sdk/angular' {
  interface LoaderIdMap {
    myCustomLoader: void;
  }
}
// Then provideLoaderRegistry({ myCustomLoader: myLoader }) and loaderResolver('myCustomLoader') are typed.
```
