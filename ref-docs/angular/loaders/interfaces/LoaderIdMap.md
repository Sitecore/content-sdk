[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderIdMap

# Interface: LoaderIdMap

Defined in: [packages/angular/src/loaders/loader-resolver.ts:48](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/loaders/loader-resolver.ts#L48)

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
