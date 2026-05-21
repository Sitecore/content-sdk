/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { UrlSegment } from '@angular/router';
import { splitLocaleFromPath, scLocaleMatcher } from './locale-utils';

const LOCALES = ['en', 'de'];

function seg(path: string): UrlSegment {
  return new UrlSegment(path, {});
}

describe('splitLocaleFromPath', () => {
  it('should return locale and the nonLocalePath when first path segment matches locales', () => {
    expect(splitLocaleFromPath('/en/about', LOCALES)).toEqual({
      locale: 'en',
      nonLocalePath: '/about',
    });
  });

  it('should return locale and the nonLocalePath without a query string when first path segment matches locales and input pathname has query string', () => {
    expect(splitLocaleFromPath('/en/about?x=1', LOCALES)).toEqual({
      locale: 'en',
      nonLocalePath: '/about',
    });
  });

  it('should return locale and the nonLocalePath without a fragment when first path segment matches locales and input pathname has fragment', () => {
    expect(splitLocaleFromPath('/en/about#section', LOCALES)).toEqual({
      locale: 'en',
      nonLocalePath: '/about',
    });
  });

  it('should return the nonLocalePath only when first path segment does not match locales', () => {
    expect(splitLocaleFromPath('/about', LOCALES)).toEqual({
      locale: null,
      nonLocalePath: '/about',
    });
    expect(splitLocaleFromPath('/fr/about', LOCALES)).toEqual({
      locale: null,
      nonLocalePath: '/fr/about',
    });
  });

  it('should return the nonLocalePath only without query string when first path segment does not match locales and input pathname has query string', () => {
    expect(splitLocaleFromPath('/about?x=1', LOCALES)).toEqual({
      locale: null,
      nonLocalePath: '/about',
    });
    expect(splitLocaleFromPath('/fr/about?x=1', LOCALES)).toEqual({
      locale: null,
      nonLocalePath: '/fr/about',
    });
  });

  it('should return the nonLocalePath only without fragment when first path segment does not match locales and input pathname has fragment', () => {
    expect(splitLocaleFromPath('/about#section', LOCALES)).toEqual({
      locale: null,
      nonLocalePath: '/about',
    });
    expect(splitLocaleFromPath('/fr/about#section', LOCALES)).toEqual({
      locale: null,
      nonLocalePath: '/fr/about',
    });
  });

  it('should return "/" only for home page pathname without locale', () => {
    expect(splitLocaleFromPath('/', LOCALES)).toEqual({
      locale: null,
      nonLocalePath: '/',
    });
  });

  it('should return "/" only for home page pathname without locale, when query string or fragment is present', () => {
    expect(splitLocaleFromPath('/?x=1', LOCALES)).toEqual({
      locale: null,
      nonLocalePath: '/',
    });
    expect(splitLocaleFromPath('/#section', LOCALES)).toEqual({
      locale: null,
      nonLocalePath: '/',
    });
  });
});

describe('scLocaleMatcher', () => {
  it('should consume a configured locale segment and expose it as posParam locale', () => {
    const matcher = scLocaleMatcher(LOCALES);
    const segments = [seg('en'), seg('about')];

    const result = matcher(segments, {} as never, {} as never);

    expect(result?.consumed).toHaveLength(1);
    expect(result?.consumed[0].path).toBe('en');
    expect((result?.posParams?.locale as UrlSegment).path).toBe('en');
  });

  it('should not consume any segments when the first segment is not a configured locale', () => {
    const matcher = scLocaleMatcher(LOCALES);
    const segments = [seg('about')];

    const result = matcher(segments, {} as never, {} as never);

    expect(result?.consumed).toEqual([]);
    expect(result?.posParams).toBeUndefined();
  });

  it('should match the root path with zero consumed segments', () => {
    const matcher = scLocaleMatcher(LOCALES);

    const result = matcher([], {} as never, {} as never);

    expect(result?.consumed).toEqual([]);
  });

  it('should consume a locale-only path', () => {
    const matcher = scLocaleMatcher(LOCALES);
    const segments = [seg('en')];

    const result = matcher(segments, {} as never, {} as never);

    expect(result?.consumed).toHaveLength(1);
    expect(result?.consumed[0].path).toBe('en');
  });

  it('should not consume when the first segment matches an unconfigured locale', () => {
    const matcher = scLocaleMatcher(LOCALES);
    const segments = [seg('fr'), seg('about')];

    const result = matcher(segments, {} as never, {} as never);

    expect(result?.consumed).toEqual([]);
  });
});
