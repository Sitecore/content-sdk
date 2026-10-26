/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import {
  selectChangesets,
  splitChangeset,
  splitChangesetId,
  type ChangesetLike,
} from './split-changesets';

const cs = (id: string, releases: { name: string; type: string }[]): ChangesetLike => ({
  id,
  summary: `summary for ${id}`,
  releases,
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

describe('selectChangesets', () => {
  const all = [cs('a', []), cs('b', []), cs('c', [])];

  it('keeps every changeset when no files are given', () => {
    expect(selectChangesets(all, [])).toEqual(all);
  });

  it('keeps only the changesets whose files are listed', () => {
    expect(selectChangesets(all, ['.changeset/a.md', '.changeset/c.md'])).toEqual([all[0], all[2]]);
  });
});

describe('splitChangesetId', () => {
  it('appends the package name without its scope', () => {
    expect(splitChangesetId('brave-cats-run', '@sitecore-content-sdk/core')).toBe(
      'brave-cats-run-core'
    );
  });

  it('appends an unscoped package name as is', () => {
    expect(splitChangesetId('brave-cats-run', 'create-content-sdk-app')).toBe(
      'brave-cats-run-create-content-sdk-app'
    );
  });
});
