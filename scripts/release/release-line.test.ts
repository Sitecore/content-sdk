/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { releaseLine } from './release-line';

describe('releaseLine', () => {
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
      'canary',
      '[csdk][release] Legacy release (ver1) - release/1.x.x',
    ],
    [
      'release/betas/feature/x',
      'beta',
      'latest',
      'beta.feature-x',
      '[csdk][release] Release - release/betas/feature/x',
    ],
    ['release/other', 'other', 'latest', 'canary', '[csdk][release] Release - release/other'],
  ])('%s is a %s release line', (branch, type, npmTag, canaryPrefix, prTitle) => {
    expect(releaseLine(branch)).toMatchObject({ type, npmTag, canaryPrefix, prTitle });
  });

  it('syncs release/latest from dev, limited and hotfix releases only', () => {
    const syncing = ['dev', 'release/limited/x', 'release/hotfix/x'];
    const others = [
      'release/legacy/nextjs/v2',
      'release/1.x.x',
      'release/betas/x',
      'release/other',
    ];
    syncing.forEach((b) => expect(releaseLine(b).syncsLatest).toBe(true));
    others.forEach((b) => expect(releaseLine(b).syncsLatest).toBe(false));
  });

  it('treats limited and hotfix as side lines only', () => {
    for (const b of ['release/limited/x', 'release/hotfix/x']) {
      expect(releaseLine(b).sideLine).toBe(true);
    }
    for (const b of ['dev', 'release/legacy/nextjs/v2', 'release/1.x.x', 'release/other']) {
      expect(releaseLine(b).sideLine).toBe(false);
    }
  });
});
