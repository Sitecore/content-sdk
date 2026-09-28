/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { findMultiPackageChangesets, splitChangeset, type ChangesetLike } from './split-changesets';

const cs = (id: string, releases: { name: string; type: string }[]): ChangesetLike => ({
  id,
  summary: `summary for ${id}`,
  releases,
});

describe('findMultiPackageChangesets', () => {
  it('returns only changesets that release more than one package', () => {
    const single = cs('single', [{ name: '@x/a', type: 'patch' }]);
    const multi = cs('multi', [
      { name: '@x/a', type: 'minor' },
      { name: '@x/b', type: 'patch' },
    ]);
    const none = cs('none', []);

    expect(findMultiPackageChangesets([single, multi, none])).toEqual([multi]);
  });

  it('returns an empty array when all changesets are single-package', () => {
    expect(findMultiPackageChangesets([cs('a', [{ name: '@x/a', type: 'patch' }])])).toEqual([]);
  });
});

describe('splitChangeset', () => {
  it('produces one single-package changeset per release, preserving summary and bump type', () => {
    const source = cs('multi', [
      { name: '@x/a', type: 'minor' },
      { name: '@x/b', type: 'patch' },
    ]);

    expect(splitChangeset(source)).toEqual([
      { summary: 'summary for multi', releases: [{ name: '@x/a', type: 'minor' }] },
      { summary: 'summary for multi', releases: [{ name: '@x/b', type: 'patch' }] },
    ]);
  });

  it('keeps a single-package changeset as one file', () => {
    const source = cs('one', [{ name: '@x/a', type: 'major' }]);
    expect(splitChangeset(source)).toEqual([
      { summary: 'summary for one', releases: [{ name: '@x/a', type: 'major' }] },
    ]);
  });
});
