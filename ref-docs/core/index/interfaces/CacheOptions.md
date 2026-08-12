[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / CacheOptions

# Interface: CacheOptions

Defined in: [packages/core/src/cache-client.ts:37](https://github.com/Sitecore/content-sdk/blob/5e586300554a131c9488a0b89af8f85d395d0b88/packages/core/src/cache-client.ts#L37)

Minimum configuration options for classes that implement

## See

CacheClient

## Extended by

- [`DictionaryServiceConfig`](../../i18n/interfaces/DictionaryServiceConfig.md)

## Properties

### cacheEnabled?

> `optional` **cacheEnabled**: `boolean`

Defined in: [packages/core/src/cache-client.ts:42](https://github.com/Sitecore/content-sdk/blob/5e586300554a131c9488a0b89af8f85d395d0b88/packages/core/src/cache-client.ts#L42)

Enable/disable caching mechanism

#### Default

```ts
true
```

***

### cacheTimeout?

> `optional` **cacheTimeout**: `number`

Defined in: [packages/core/src/cache-client.ts:47](https://github.com/Sitecore/content-sdk/blob/5e586300554a131c9488a0b89af8f85d395d0b88/packages/core/src/cache-client.ts#L47)

Cache timeout (sec)

#### Default

```ts
60
```
