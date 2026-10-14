/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { getReleaseInfo } from './release-info';

describe('getReleaseInfo', () => {
  it.each([
    // branch, type, npm tag, canary prefix, release PR title
    ['dev', 'full', 'latest', 'canary', '[csdk][release] Full release'],
    [
      'release/limited/nextjs-20261009120000',
      'limited',
      'latest',
      'canary-prerelease',
      '[csdk][release] Limited release - release/limited/nextjs-20261009120000',
    ],
    [
      'release/hotfix/20261009120000',
      'hotfix',
      'latest',
      'canary-hotfix',
      '[csdk][release] Hotfix / feature release - release/hotfix/20261009120000',
    ],
    [
      'release/legacy/nextjs/v2',
      'legacy',
      'legacy',
      'canary-legacy',
      '[csdk][release] Legacy release - release/legacy/nextjs/v2',
    ],
    [
      'release/1.x.x',
      'ver1',
      'ver1',
      'ver1-canary',
      '[csdk][release] Legacy release (ver1) - release/1.x.x',
    ],
    [
      'release/betas/feature/x',
      'beta',
      'latest',
      'beta.feature-x',
      '[csdk][release] Release - release/betas/feature/x',
    ],
  ])('%s has %s release info', (branch, type, npmTag, canaryPrefix, prTitle) => {
    expect(getReleaseInfo(branch)).toMatchObject({ type, npmTag, canaryPrefix, prTitle });
  });

  it('resolves the release info from the branch prefix only', () => {
    expect(getReleaseInfo('release/limited')).toMatchObject({ type: 'limited' });
    expect(getReleaseInfo('release/legacy/angular/v1')).toMatchObject({ type: 'legacy' });
  });

  it('rejects unlisted branches: they publish nothing', () => {
    for (const branch of ['release/latest', 'release/2.x.x', 'release/other', 'feature/x']) {
      expect(() => getReleaseInfo(branch)).toThrow(/is not a release branch/);
    }
  });
});
