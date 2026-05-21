/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { UrlSegment } from '@angular/router';
import { extractLocaleFromPath, prependLocale, createLocaleMatcher } from './locale-utils';

const LOCALES = ['en', 'de'];

function seg(path: string): UrlSegment {
  return new UrlSegment(path, {});
}

describe('extractLocaleFromPath', () => {
  it('should detect a configured locale at the start of the path', () => {
    expect(extractLocaleFromPath('/en/about', LOCALES)).toEqual({
      locale: 'en',
      rest: '/about',
    });
  });

  it('should detect a configured locale when the locale is the only segment', () => {
    expect(extractLocaleFromPath('/en', LOCALES)).toEqual({ locale: 'en', rest: '/' });
  });

  it('should return null locale when the first segment is not configured', () => {
    expect(extractLocaleFromPath('/about', LOCALES)).toEqual({
      locale: null,
      rest: '/about',
    });
  });

  it('should return null locale at the root', () => {
    expect(extractLocaleFromPath('/', LOCALES)).toEqual({ locale: null, rest: '/' });
  });

  it('should not treat an unconfigured locale-shaped segment as a locale', () => {
    expect(extractLocaleFromPath('/fr/about', LOCALES)).toEqual({
      locale: null,
      rest: '/fr/about',
    });
  });

  it('should preserve query and fragment in the rest of the path', () => {
    expect(extractLocaleFromPath('/en/about?x=1#hash', LOCALES)).toEqual({
      locale: 'en',
      rest: '/about?x=1#hash',
    });
  });

  it('should accept a pathname without leading slash', () => {
    expect(extractLocaleFromPath('en/about', LOCALES)).toEqual({
      locale: 'en',
      rest: '/about',
    });
  });
});

describe('prependLocale', () => {
  it('should prepend the locale segment when a locale is provided', () => {
    expect(prependLocale('/about', 'en')).toBe('/en/about');
  });

  it('should leave the path unchanged when locale is null', () => {
    expect(prependLocale('/about', null)).toBe('/about');
  });

  it('should leave the path unchanged when locale is empty', () => {
    expect(prependLocale('/about', '')).toBe('/about');
  });

  it('should produce /<locale> when the path is the root', () => {
    expect(prependLocale('/', 'en')).toBe('/en');
  });
});

describe('createLocaleMatcher', () => {
  it('should consume a configured locale segment and expose it as posParam locale', () => {
    const matcher = createLocaleMatcher(LOCALES);
    const segments = [seg('en'), seg('about')];

    const result = matcher(segments, {} as never, {} as never);

    expect(result?.consumed).toHaveLength(1);
    expect(result?.consumed[0].path).toBe('en');
    expect((result?.posParams?.locale as UrlSegment).path).toBe('en');
  });

  it('should not consume any segments when the first segment is not a configured locale', () => {
    const matcher = createLocaleMatcher(LOCALES);
    const segments = [seg('about')];

    const result = matcher(segments, {} as never, {} as never);

    expect(result?.consumed).toEqual([]);
    expect(result?.posParams).toBeUndefined();
  });

  it('should match the root path with zero consumed segments', () => {
    const matcher = createLocaleMatcher(LOCALES);

    const result = matcher([], {} as never, {} as never);

    expect(result?.consumed).toEqual([]);
  });

  it('should consume a locale-only path', () => {
    const matcher = createLocaleMatcher(LOCALES);
    const segments = [seg('en')];

    const result = matcher(segments, {} as never, {} as never);

    expect(result?.consumed).toHaveLength(1);
    expect(result?.consumed[0].path).toBe('en');
  });

  it('should not consume when the first segment matches an unconfigured locale', () => {
    const matcher = createLocaleMatcher(LOCALES);
    const segments = [seg('fr'), seg('about')];

    const result = matcher(segments, {} as never, {} as never);

    expect(result?.consumed).toEqual([]);
  });
});
