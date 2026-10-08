/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import {
  parseSemver,
  compareSemver,
  parseStableVersions,
  legacyBranch,
  planLegacyBranch,
} from './create-legacy-branches';

describe('parseSemver', () => {
  it('parses stable versions and rejects prereleases and junk', () => {
    expect(parseSemver('2.4.0')).toEqual([2, 4, 0]);
    expect(parseSemver('2.1.0-canary.6')).toBeNull();
    expect(parseSemver('latest')).toBeNull();
  });
});

describe('compareSemver', () => {
  it('orders by major, then minor, then patch', () => {
    expect(compareSemver('1.0.0', '2.0.0')).toBeLessThan(0);
    expect(compareSemver('2.3.0', '2.2.9')).toBeGreaterThan(0);
    expect(compareSemver('2.4.0', '2.4.0')).toBe(0);
    expect([...['1.2.0', '1.10.0', '1.1.0']].sort(compareSemver)).toEqual([
      '1.1.0',
      '1.2.0',
      '1.10.0',
    ]);
  });
});

describe('parseStableVersions', () => {
  const pkg = '@sitecore-content-sdk/nextjs';

  it('extracts stable versions from tag output and drops prereleases', () => {
    const raw = [`${pkg}@2.2.0`, `${pkg}@2.4.0`, `${pkg}@2.1.1-canary.0`].join('\n');
    expect(parseStableVersions(pkg, raw)).toEqual(['2.2.0', '2.4.0']);
  });

  it('returns an empty array for empty output', () => {
    expect(parseStableVersions(pkg, '')).toEqual([]);
  });
});

describe('legacyBranch', () => {
  it('builds the release/legacy/<slug>/v<major> path', () => {
    expect(legacyBranch('nextjs', 2)).toBe('release/legacy/nextjs/v2');
  });
});

describe('planLegacyBranch', () => {
  it('creates a branch from the latest prior-major release on a major bump', () => {
    const plan = planLegacyBranch('nextjs', '3.0.0', ['2.2.0', '2.4.0', '1.9.0']);
    expect(plan).toEqual({
      action: 'create',
      targetBranch: 'release/legacy/nextjs/v2',
      sourceVersion: '2.4.0',
      previousMajor: 2,
    });
  });

  it('skips when the published version is not a major bump', () => {
    const plan = planLegacyBranch('nextjs', '2.5.0', ['2.2.0', '2.4.0']);
    expect(plan).toEqual({ action: 'skip', reason: expect.stringContaining('not a major bump') });
  });

  it('skips when there is no prior stable release', () => {
    expect(planLegacyBranch('angular', '1.0.0', [])).toEqual({
      action: 'skip',
      reason: 'no prior stable release',
    });
  });

  it('skips when the published version is not a stable semver', () => {
    expect(planLegacyBranch('nextjs', '3.0.0-canary.1', ['2.4.0'])).toEqual({
      action: 'skip',
      reason: expect.stringContaining('not a stable semver'),
    });
  });

  it('picks the highest prior major when several exist', () => {
    const plan = planLegacyBranch('angular', '3.0.0', ['1.0.0', '2.0.0', '2.1.0']);
    expect(plan).toMatchObject({ action: 'create', targetBranch: 'release/legacy/angular/v2', sourceVersion: '2.1.0' });
  });
});
