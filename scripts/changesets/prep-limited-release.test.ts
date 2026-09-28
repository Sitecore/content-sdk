/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { parseList, resolveIgnoreList } from './prep-limited-release';

const PUBLISHABLE = [
  '@sitecore-content-sdk/core',
  '@sitecore-content-sdk/nextjs',
  '@sitecore-content-sdk/react',
  'create-content-sdk-app',
];

describe('parseList', () => {
  it('returns an empty array for undefined or blank input', () => {
    expect(parseList(undefined)).toEqual([]);
    expect(parseList('   ')).toEqual([]);
  });

  it('splits on commas, spaces and newlines and trims', () => {
    expect(parseList('a, b\nc   d')).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('resolveIgnoreList', () => {
  it('ignores every publishable package that was not selected, sorted', () => {
    const ignore = resolveIgnoreList(PUBLISHABLE, ['@sitecore-content-sdk/nextjs']);
    expect(ignore).toEqual([
      '@sitecore-content-sdk/core',
      '@sitecore-content-sdk/react',
      'create-content-sdk-app',
    ]);
  });

  it('returns an empty ignore list when every publishable package is selected', () => {
    expect(resolveIgnoreList(PUBLISHABLE, [...PUBLISHABLE])).toEqual([]);
  });

  it('throws when nothing is selected', () => {
    expect(() => resolveIgnoreList(PUBLISHABLE, [])).toThrow(/No packages selected/);
  });

  it('throws and lists the offenders when a selected package is not publishable', () => {
    expect(() => resolveIgnoreList(PUBLISHABLE, ['@sitecore-content-sdk/nope'])).toThrow(
      /not publishable workspace packages: @sitecore-content-sdk\/nope/
    );
  });
});
