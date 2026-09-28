[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderIdMap

# Interface: LoaderIdMap

Defined in: [packages/angular/src/loaders/loader-resolver.ts:50](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/angular/src/loaders/loader-resolver.ts#L50)

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
