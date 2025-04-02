[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / CacheOptions

# Interface: CacheOptions

Defined in: [packages/core/src/cache-client.ts:35](https://github.com/Sitecore/content-sdk/blob/6011964d1f248a508bbfba336ef2d9fbb216116e/packages/core/src/cache-client.ts#L35)

Minimum configuration options for classes that implement

## See

CacheClient

## Extended by

- [`GraphQLDictionaryServiceConfig`](../../i18n/interfaces/GraphQLDictionaryServiceConfig.md)

## Properties

### cacheEnabled?

> `optional` **cacheEnabled**: `boolean`

Defined in: [packages/core/src/cache-client.ts:40](https://github.com/Sitecore/content-sdk/blob/6011964d1f248a508bbfba336ef2d9fbb216116e/packages/core/src/cache-client.ts#L40)

Enable/disable caching mechanism

#### Default

```ts
true
```

***

### cacheTimeout?

> `optional` **cacheTimeout**: `number`

Defined in: [packages/core/src/cache-client.ts:45](https://github.com/Sitecore/content-sdk/blob/6011964d1f248a508bbfba336ef2d9fbb216116e/packages/core/src/cache-client.ts#L45)

Cache timeout (sec)

#### Default

```ts
60
```
