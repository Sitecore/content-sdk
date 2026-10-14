/* eslint-disable jsdoc/require-jsdoc */
import path from 'path';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { devBranchSync, latestBranchSync, runSteps, syncRelease } from './post-release-sync';
import { RELEASE_LATEST } from '../constants';

const mocks = vi.hoisted(() => ({
  execFileSync: vi.fn(),
  getPackages: vi.fn(),
  createLegacyBranches: vi.fn(),
  // steps are logged and reported by function name
  refreshLegacyLockfiles: Object.defineProperty(vi.fn(), 'name', {
    value: 'refreshLegacyLockfiles',
  }),
}));

vi.mock('child_process', () => ({ execFileSync: mocks.execFileSync }));
vi.mock('@manypkg/get-packages', () => ({ getPackages: mocks.getPackages }));
vi.mock('./legacy/create-legacy-branches', () => ({
  createLegacyBranches: mocks.createLegacyBranches,
  refreshLegacyLockfiles: mocks.refreshLegacyLockfiles,
}));

const NEXTJS = '@sitecore-content-sdk/nextjs';
const CORE = '@sitecore-content-sdk/core';
const SHA = 'abcdef1234567890';
const BRANCH = RELEASE_LATEST;
const released = [{ name: NEXTJS, version: '2.5.0' }];
const ctx = { branch: BRANCH, releaseSha: SHA, published: released };

const root = path.resolve('/repo');
const pkg = (name: string, ...dir: string[]) => ({
  dir: path.join(root, ...dir),
  packageJson: { name },
});
const packages = [
  pkg(CORE, 'packages', 'core'),
  pkg(NEXTJS, 'packages', 'nextjs'),
  pkg('@sitecore-content-sdk/nextjs-templates', 'templates', 'nextjs'),
];

// git calls in order, as argument arrays
const gitCalls = () =>
  mocks.execFileSync.mock.calls.filter(([cmd]) => cmd === 'git').map(([, args]) => args);
// the same without the package.json reads (`git show`) of the version checks
const gitCommands = () => gitCalls().filter(([cmd]) => cmd !== 'show');

// Stubs git. Package versions (`git show <ref>:<path>`): `latestVersion` on release/latest,
// `devVersion` elsewhere (origin/dev). `pick` is the cherry-pick outcome, `parents` the release
// commit's parent count.
function stubGit({
  devVersion = '2.4.0',
  latestVersion = '2.4.0',
  pick = 'clean' as 'clean' | 'conflict',
  parents = 1,
  fetchFails = false,
} = {}) {
  mocks.execFileSync.mockImplementation((cmd: string, args: string[]) => {
    if (cmd !== 'git') return '';
    if (args[0] === 'fetch' && fetchFails) throw new Error("couldn't find remote ref");
    if (args[0] === 'show') {
      const ref = args[1].split(':')[0];
      const version = ref === `origin/${RELEASE_LATEST}` ? latestVersion : devVersion;
      return JSON.stringify({ version });
    }
    if (args[0] === 'rev-list') return [SHA, ...Array(parents).fill('p')].join(' ');
    if (args[0] === 'cherry-pick' && pick === 'conflict') throw new Error('conflict');
    return '';
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  mocks.getPackages.mockResolvedValue({ packages, rootDir: root });
  stubGit();
});

describe('latestBranchSync', () => {
  it('re-creates release/latest at the release commit', async () => {
    await latestBranchSync({ ...ctx, branch: 'dev' });
    expect(gitCommands()).toEqual([
      ['fetch', 'origin', RELEASE_LATEST],
      ['push', '-f', 'origin', `${SHA}:refs/heads/${RELEASE_LATEST}`],
    ]);
  });

  it('creates release/latest when it does not exist yet', async () => {
    stubGit({ fetchFails: true });
    await latestBranchSync({ ...ctx, branch: 'dev' });
    expect(gitCommands()).toEqual([
      ['fetch', 'origin', RELEASE_LATEST],
      ['push', '-f', 'origin', `${SHA}:refs/heads/${RELEASE_LATEST}`],
    ]);
  });

  it('leaves release/latest alone once it holds these versions or newer (re-run)', async () => {
    stubGit({ latestVersion: '2.6.0' });
    await latestBranchSync({ ...ctx, branch: 'dev' });
    expect(gitCommands()).toEqual([['fetch', 'origin', RELEASE_LATEST]]);
  });
});

describe('devBranchSync', () => {
  it('cherry-picks the release onto dev and pushes', async () => {
    await devBranchSync(ctx);
    expect(gitCalls()).toContainEqual(['cherry-pick', SHA]);
    expect(gitCalls()).toContainEqual(['push', 'origin', 'HEAD:dev']);
  });

  it('uses the first parent as mainline for a merge-commit release', async () => {
    stubGit({ parents: 2 });
    await devBranchSync(ctx);
    expect(gitCalls()).toContainEqual(['cherry-pick', '-m', '1', SHA]);
  });

  it('does nothing when dev already has the versions (re-run)', async () => {
    stubGit({ devVersion: '2.5.0' });
    await devBranchSync(ctx);
    expect(gitCalls().map(([cmd]) => cmd)).not.toContain('cherry-pick');
  });

  it('opens a PR to dev on conflicts', async () => {
    stubGit({ pick: 'conflict' });
    await devBranchSync(ctx);
    const syncBranch = 'chore/sync-release-latest-abcdef1-to-dev';
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
  it('runs the steps in order and stops at the first failure, named by its step', async () => {
    const order: string[] = [];
    const a = () => order.push('a');
    const b = () => {
      throw new Error('boom');
    };
    const c = async () => order.push('c');
    await expect(runSteps([a, b, c], ctx)).rejects.toThrow('b: boom');
    expect(order).toEqual(['a']);
  });
});

describe('syncRelease', () => {
  const order: string[] = [];
  const releaseLatestPushes = () =>
    gitCalls().filter(
      ([cmd, ...rest]) => cmd === 'push' && rest.join(' ').includes(RELEASE_LATEST)
    );

  beforeEach(() => {
    order.length = 0;
    stubGit({ devVersion: '2.5.0' }); // dev already has the bump: no cherry-pick
    mocks.createLegacyBranches.mockImplementation(async () => {
      order.push(`legacy (release/latest pushes so far: ${releaseLatestPushes().length})`);
    });
  });

  it('creates legacy branches from the release, before release/latest moves to it', async () => {
    await syncRelease('dev', SHA, released);
    expect(mocks.createLegacyBranches).toHaveBeenCalledWith(released);
    expect(order).toEqual(['legacy (release/latest pushes so far: 0)']);
    expect(releaseLatestPushes()).toHaveLength(1);
  });

  it('stops at the first failing step: release/latest keeps the previous release', async () => {
    mocks.createLegacyBranches.mockRejectedValue(new Error('no tag for nextjs@2.4.0'));
    await expect(syncRelease('dev', SHA, released)).rejects.toThrow(
      'createLegacyBranchesOnMajor: no tag for nextjs@2.4.0'
    );
    expect(releaseLatestPushes()).toEqual([]);
  });

  const stepNames = () =>
    vi
      .mocked(console.log)
      .mock.calls.map(([line]) => String(line))
      .filter((line) => line.startsWith('\n▶ '))
      .map((line) => line.slice(3));

  it('runs the steps of the branch prefix', async () => {
    await syncRelease('dev', SHA, released);
    expect(stepNames()).toEqual([
      'createLegacyBranchesOnMajor',
      'latestBranchSync',
      'refreshLegacyLockfiles',
    ]);
    vi.mocked(console.log).mockClear();
    await syncRelease(RELEASE_LATEST, SHA, released);
    expect(stepNames()).toEqual([
      'createLegacyBranchesOnMajor',
      'refreshLegacyLockfiles',
      'devBranchSync',
    ]);
    vi.mocked(console.log).mockClear();
    await syncRelease('release/legacy/nextjs/v2', SHA, released);
    expect(stepNames()).toEqual([]);
  });

  it('re-creates release/latest for a dev release it does not hold yet', async () => {
    await syncRelease('dev', SHA, released);
    expect(releaseLatestPushes()).toEqual([
      ['push', '-f', 'origin', `${SHA}:refs/heads/${RELEASE_LATEST}`],
    ]);
  });

  it('does not roll release/latest back once it holds these versions or newer (re-run)', async () => {
    for (const latestVersion of ['2.5.0', '2.6.0']) {
      stubGit({ devVersion: '2.5.0', latestVersion });
      await syncRelease('dev', SHA, released);
    }
    expect(releaseLatestPushes()).toEqual([]);
  });

  it('never pushes release/latest from other branches, release/latest included', async () => {
    await syncRelease(RELEASE_LATEST, SHA, released);
    await syncRelease('release/legacy/nextjs/v2', SHA, released);
    expect(releaseLatestPushes()).toEqual([]);
  });
});
