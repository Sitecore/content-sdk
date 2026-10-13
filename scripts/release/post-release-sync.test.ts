/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  cherryPickToDev,
  devHasVersions,
  releasedPackages,
  restoreReleaseTags,
  runSteps,
  syncRelease,
} from './post-release-sync';

const mocks = vi.hoisted(() => ({
  execFileSync: vi.fn(),
  getPackages: vi.fn(),
  createLegacyBranches: vi.fn(),
  syncLatestBranch: vi.fn(),
}));

vi.mock('child_process', () => ({ execFileSync: mocks.execFileSync }));
vi.mock('@manypkg/get-packages', () => ({ getPackages: mocks.getPackages }));
vi.mock('./legacy/create-legacy-branches', () => ({
  createLegacyBranches: mocks.createLegacyBranches,
}));
vi.mock('./sync-latest-branch', () => ({ syncLatestBranch: mocks.syncLatestBranch }));

const NEXTJS = '@sitecore-content-sdk/nextjs';
const CORE = '@sitecore-content-sdk/core';
const SHA = 'abcdef1234567890';
const BRANCH = 'release/limited/nextjs-20261009120000';
const released = [{ name: NEXTJS, version: '2.5.0' }];

const gitCalls = () =>
  mocks.execFileSync.mock.calls.filter(([cmd]) => cmd === 'git').map(([, args]) => args);

/**
 * Stubs git: `devVersion` is nextjs's version on origin/dev, `pick` the cherry-pick outcome,
 * `remoteTags` the tags already on origin.
 */
function stubGit({
  devVersion = '2.4.0',
  pick = 'clean' as 'clean' | 'conflict',
  parents = 1,
  remoteTags = [] as string[],
} = {}) {
  mocks.execFileSync.mockImplementation((cmd: string, args: string[]) => {
    if (cmd !== 'git') return '';
    if (args[0] === 'show') return JSON.stringify({ version: devVersion });
    if (args[0] === 'rev-list') return [SHA, ...Array(parents).fill('p')].join(' ');
    if (args[0] === 'cherry-pick' && pick === 'conflict') throw new Error('conflict');
    if (args[0] === 'ls-remote') {
      const tag = args[3].replace('refs/tags/', '');
      return remoteTags.includes(tag) ? `sha\trefs/tags/${tag}` : '';
    }
    return '';
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  mocks.getPackages.mockResolvedValue({
    rootDir: '/repo',
    packages: [{ dir: '/repo/packages/nextjs', packageJson: { name: NEXTJS } }],
  });
  stubGit();
});

describe('releasedPackages', () => {
  it("keeps the release's packages that are on npm", () => {
    const lookup = (name: string) =>
      name === NEXTJS ? { versions: ['2.4.0', '2.5.0'] } : { versions: ['2.1.4'] };
    const changed = [...released, { name: CORE, version: '2.1.5' }];
    expect(releasedPackages(changed, lookup)).toEqual(released);
  });

  it("counts changesets/action's reported packages even while npm metadata still lags", () => {
    const staleNpm = () => ({ versions: ['2.4.0'] }); // published moments ago, not visible yet
    expect(releasedPackages(released, staleNpm, released)).toEqual(released);
  });

  it('adds earlier-attempt packages found on npm to the reported ones, without duplicates', () => {
    const lookup = (name: string) =>
      name === CORE ? { versions: ['2.1.5'] } : { versions: ['2.4.0', '2.5.0'] };
    const changed = [...released, { name: CORE, version: '2.1.5' }];
    expect(releasedPackages(changed, lookup, released)).toEqual([
      ...released,
      { name: CORE, version: '2.1.5' },
    ]);
  });
});

describe('devHasVersions', () => {
  it('is true when dev holds every released version or a newer one', () => {
    expect(devHasVersions(released, new Map([[NEXTJS, '2.5.0']]))).toBe(true);
    expect(devHasVersions(released, new Map([[NEXTJS, '2.6.0']]))).toBe(true);
    expect(devHasVersions(released, new Map([[NEXTJS, '2.4.0']]))).toBe(false);
    expect(devHasVersions(released, new Map())).toBe(false);
  });
});

describe('restoreReleaseTags', () => {
  it('creates and pushes only the missing tags, at the release commit', () => {
    stubGit({ remoteTags: [`${CORE}@2.1.5`] });
    restoreReleaseTags([...released, { name: CORE, version: '2.1.5' }], SHA);
    const writes = gitCalls().filter(([cmd]) => cmd === 'tag' || cmd === 'push');
    expect(writes).toEqual([
      ['tag', '-f', '-a', `${NEXTJS}@2.5.0`, '-m', `${NEXTJS}@2.5.0`, SHA],
      ['push', 'origin', `refs/tags/${NEXTJS}@2.5.0`],
    ]);
  });
});

describe('cherryPickToDev', () => {
  it('cherry-picks the release onto dev and pushes', async () => {
    expect(await cherryPickToDev(BRANCH, SHA, released)).toBe('picked');
    expect(gitCalls()).toContainEqual(['cherry-pick', SHA]);
    expect(gitCalls()).toContainEqual(['push', 'origin', 'HEAD:dev']);
  });

  it('uses the first parent as mainline for a merge-commit release', async () => {
    stubGit({ parents: 2 });
    await cherryPickToDev(BRANCH, SHA, released);
    expect(gitCalls()).toContainEqual(['cherry-pick', '-m', '1', SHA]);
  });

  it('does nothing when dev already has the versions (re-run)', async () => {
    stubGit({ devVersion: '2.5.0' });
    expect(await cherryPickToDev(BRANCH, SHA, released)).toBe('already-on-dev');
    expect(gitCalls().map(([cmd]) => cmd)).not.toContain('cherry-pick');
  });

  it('opens a PR to dev on conflicts', async () => {
    stubGit({ pick: 'conflict' });
    expect(await cherryPickToDev(BRANCH, SHA, released)).toBe('conflict-pr');
    const syncBranch = 'chore/sync-release-limited-nextjs-20261009120000-to-dev';
    expect(gitCalls()).toContainEqual(['push', '-f', 'origin', `HEAD:refs/heads/${syncBranch}`]);
    expect(gitCalls()).not.toContainEqual(['push', 'origin', 'HEAD:dev']);
    expect(mocks.execFileSync).toHaveBeenCalledWith(
      'gh',
      expect.arrayContaining(['pr', 'create', '--head', syncBranch]),
      expect.anything()
    );
  });
});

describe('runSteps', () => {
  it('runs every step and reports the failed ones', async () => {
    const order: string[] = [];
    const failures = await runSteps([
      ['a', () => order.push('a')],
      [
        'b',
        () => {
          throw new Error('boom');
        },
      ],
      ['c', async () => order.push('c')],
    ]);
    expect(order).toEqual(['a', 'c']);
    expect(failures).toEqual(['b: boom']);
  });
});

describe('syncRelease', () => {
  const order: string[] = [];

  beforeEach(() => {
    order.length = 0;
    stubGit({ devVersion: '2.5.0' }); // dev already has the bump: no cherry-pick git calls
    mocks.createLegacyBranches.mockImplementation(async () => {
      order.push('legacy');
    });
    mocks.syncLatestBranch.mockImplementation(async () => {
      order.push('sync');
    });
  });

  it('creates legacy branches before release/latest moves to the release', async () => {
    expect(await syncRelease(BRANCH, SHA, released)).toEqual([]);
    expect(order).toEqual(['legacy', 'sync']);
  });

  it('keeps release/latest at the previous release when a legacy branch fails', async () => {
    mocks.createLegacyBranches.mockRejectedValue(new Error('release/latest holds nextjs@3.0.0'));
    const failures = await syncRelease(BRANCH, SHA, released);
    expect(mocks.syncLatestBranch).not.toHaveBeenCalled();
    expect(failures).toEqual([
      'Create legacy branches: release/latest holds nextjs@3.0.0',
      expect.stringMatching(/^Sync release\/latest: skipped/),
    ]);
  });
});
