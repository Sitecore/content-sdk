/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import type { Route } from '@angular/router';
import { getLoaderId, collectLoaderIds, mergeRouteParams } from './route-loader-utils';
import { LOADER_ID } from './loader-registry.token';

function makeResolverWithLoaderId(loaderId: string): (() => void) & { [LOADER_ID]: string } {
  const fn = () => {};
  (fn as unknown as Record<symbol, string>)[LOADER_ID] = loaderId;
  return fn as (() => void) & { [LOADER_ID]: string };
}

describe('getLoaderId', () => {
  it('returns the loader id for a tagged resolver', () => {
    expect(getLoaderId(makeResolverWithLoaderId('page'))).toBe('page');
  });

  it('returns undefined for a plain resolver function', () => {
    expect(getLoaderId(() => {})).toBeUndefined();
  });

  it('returns undefined for non-function values', () => {
    expect(getLoaderId(undefined)).toBeUndefined();
    expect(getLoaderId('not-a-function')).toBeUndefined();
  });
});

describe('collectLoaderIds', () => {
  it('collects loader ids across multiple route levels, in order', () => {
    const resolveConfigs: (Route['resolve'] | undefined)[] = [
      { layout: makeResolverWithLoaderId('layout') },
      { page: makeResolverWithLoaderId('page'), dictionary: makeResolverWithLoaderId('dictionary') },
    ];

    expect(collectLoaderIds(resolveConfigs)).toEqual(['layout', 'page', 'dictionary']);
  });

  it('ignores non-loader resolvers and undefined resolve maps', () => {
    const resolveConfigs: (Route['resolve'] | undefined)[] = [
      undefined,
      { plain: () => {} },
      { page: makeResolverWithLoaderId('page') },
    ];

    expect(collectLoaderIds(resolveConfigs)).toEqual(['page']);
  });

  it('returns an empty array when no loaders are present', () => {
    expect(collectLoaderIds([undefined, {}])).toEqual([]);
  });
});

describe('mergeRouteParams', () => {
  it('merges params across the chain, child overriding parent on key collision', () => {
    const result = mergeRouteParams([{ locale: 'en' }, { id: '123' }, { locale: 'fr' }]);
    expect(result).toEqual({ locale: 'fr', id: '123' });
  });

  it('defaults locale from defaultLanguage when no level contributed one', () => {
    const result = mergeRouteParams([{ id: '123' }], 'en');
    expect(result).toEqual({ id: '123', locale: 'en' });
  });

  it('does not override an explicit locale with defaultLanguage', () => {
    const result = mergeRouteParams([{ locale: 'fr' }], 'en');
    expect(result).toEqual({ locale: 'fr' });
  });

  it('leaves locale absent when no defaultLanguage is given', () => {
    const result = mergeRouteParams([{ id: '123' }]);
    expect(result).toEqual({ id: '123' });
  });
});
