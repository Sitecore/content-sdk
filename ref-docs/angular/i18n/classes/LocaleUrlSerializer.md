[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [i18n](../README.md) / LocaleUrlSerializer

# Class: LocaleUrlSerializer

Defined in: [packages/angular/src/i18n/locale-url-serializer.ts:28](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/angular/src/i18n/locale-url-serializer.ts#L28)

Locale-aware UrlSerializer replacement. Extends [DefaultUrlSerializer](https://angular.dev/api/router/DefaultUrlSerializer) and
prepends the current URL locale (from the request pathname) to every serialized
URL. Angular's built-in `[routerLink]` computes hrefs via `router.serializeUrl()`, which
delegates to the DI-injected `UrlSerializer.serialize()` — so replacing the binding makes
every routerLink href locale-aware with no directive changes.

Behavior:
- When `currentLocale` is `null` (URL has no configured locale prefix), serialization is
  unchanged.
- When the serialized URL already starts with a configured locale segment, serialization
  is unchanged (mirrors ScLinkDirective idempotency under repeated cycles).
- Otherwise the locale segment is prepended to the serialized URL.

Parsing is inherited from the default — this serializer does **not** strip locale on
parse. The locale matcher (`scLocaleMatcher`) consumes the locale segment from the
route tree instead.

## Extends

- [`DefaultUrlSerializer`](https://angular.dev/api/router/DefaultUrlSerializer)

## Constructors

### Constructor

> **new LocaleUrlSerializer**(): `LocaleUrlSerializer`

#### Returns

`LocaleUrlSerializer`

#### Inherited from

`DefaultUrlSerializer.constructor`

## Methods

### parse()

> **parse**(`url`): `UrlTree`

Defined in: node\_modules/@angular/router/types/\_router\_module-chunk.d.ts:1697

Parses a url into a `UrlTree`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |

#### Returns

`UrlTree`

#### Inherited from

`DefaultUrlSerializer.parse`

***

### serialize()

> **serialize**(`tree`): `string`

Defined in: [packages/angular/src/i18n/locale-url-serializer.ts:34](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/angular/src/i18n/locale-url-serializer.ts#L34)

Converts a `UrlTree` into a url

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `tree` | `UrlTree` |

#### Returns

`string`

#### Overrides

`DefaultUrlSerializer.serialize`
