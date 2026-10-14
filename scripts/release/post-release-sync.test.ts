/* eslint-disable jsdoc/require-jsdoc */
import path from 'path';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  devBranchSync,
  latestBranchSync,
  latestPackagesSync,
  publishedPackageDirs,
  releasedPackages,
  runSteps,
  syncRelease,
} from './post-release-sync';
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
const BRANCH = 'release/limited/nextjs-20261009120000';
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
// commit's parent count, `staged` the output of `git diff --cached --name-only`.
function stubGit({
  devVersion = '2.4.0',
  latestVersion = '2.4.0',
  pick = 'clean' as 'clean' | 'conflict',
  parents = 1,
  staged = 'packages/nextjs/package.json',
  fetchFails = false,
} = {}) {
  mocks.execFileSync.mockImplementation((cmd: string, args: string[]) => {
    if (cmd !== 'git') return '';
    if (args[0] === 'fetch' && fetchFails) throw new Error("couldn't find remote ref");
    if (args[0] === 'show') {
      const version = args[1].startsWith(`origin/${RELEASE_LATEST}:`) ? latestVersion : devVersion;
      return JSON.stringify({ version });
    }
    if (args[0] === 'rev-list') return [SHA, ...Array(parents).fill('p')].join(' ');
    if (args[0] === 'cherry-pick' && pick === 'conflict') throw new Error('conflict');
    if (args[0] === 'diff') return staged;
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

describe('publishedPackageDirs', () => {
  it('maps published packages to repo-relative, forward-slash directories', () => {
    const published = [
      { name: '@sitecore-content-sdk/nextjs', version: '2.5.0' },
      { name: '@sitecore-content-sdk/nextjs-templates', version: '2.5.0' },
    ];
    expect(publishedPackageDirs(packages, root, published)).toEqual([
      'packages/nextjs',
      'templates/nextjs',
    ]);
  });

  it('throws on a published package that is not in the workspace', () => {
    expect(() =>
      publishedPackageDirs(packages, root, [
        { name: '@sitecore-content-sdk/nope', version: '1.0.0' },
      ])
    ).toThrow(/@sitecore-content-sdk\/nope is not in the workspace/);
  });
});

describe('latestBranchSync', () => {
  it('re-creates release/latest at the release commit', async () => {
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

describe('latestPackagesSync', () => {
  it('overlays the published package directories onto release/latest and commits', async () => {
    await latestPackagesSync(ctx);

    expect(gitCommands()).toEqual([
      ['fetch', 'origin', RELEASE_LATEST],
      ['checkout', '-q', '-B', RELEASE_LATEST, `origin/${RELEASE_LATEST}`],
      ['restore', `--source=${SHA}`, '--staged', '--worktree', '--', 'packages/nextjs'],
      ['add', '--', 'yarn.lock', 'packages/nextjs'],
      ['diff', '--cached', '--name-only'],
      ['commit', '-q', '-m', `[ci] Latest release from ${BRANCH}: ${NEXTJS}@2.5.0`],
      ['push', 'origin', `HEAD:refs/heads/${RELEASE_LATEST}`],
      ['checkout', '-q', '-f', '--detach', SHA],
    ]);
    expect(mocks.execFileSync).toHaveBeenCalledWith(
      'yarn',
      ['install', '--mode=update-lockfile'],
      expect.objectContaining({
        env: expect.objectContaining({ YARN_ENABLE_IMMUTABLE_INSTALLS: 'false' }),
      })
    );
  });

  it('leaves release/latest alone once it holds these versions or newer (re-run)', async () => {
    stubGit({ latestVersion: '2.5.0' });
    await latestPackagesSync(ctx);
    expect(gitCommands()).toEqual([['fetch', 'origin', RELEASE_LATEST]]);
  });

  it('skips the commit when the overlay changes nothing', async () => {
    stubGit({ staged: '' });

    await latestPackagesSync(ctx);

    expect(gitCommands().map((args) => args[0])).not.toContain('commit');
    expect(gitCommands()).not.toContainEqual([
      'push',
      'origin',
      `HEAD:refs/heads/${RELEASE_LATEST}`,
    ]);
  });

  it('fails with a bootstrap hint when release/latest does not exist', async () => {
    stubGit({ fetchFails: true });

    await expect(latestPackagesSync(ctx)).rejects.toThrow(/release\/latest does not exist yet/);
    expect(gitCommands()).toEqual([['fetch', 'origin', RELEASE_LATEST]]);
  });

  it('fails before touching release/latest when a published package is not in the workspace', async () => {
    const nope = [{ name: '@sitecore-content-sdk/nope', version: '1.0.0' }];
    await expect(latestPackagesSync({ ...ctx, published: nope })).rejects.toThrow(
      /not in the workspace/
    );
    expect(gitCommands()).toEqual([['fetch', 'origin', RELEASE_LATEST]]);
  });

  it('returns to the release commit when the sync fails midway', async () => {
    const git = mocks.execFileSync.getMockImplementation()!;
    mocks.execFileSync.mockImplementation((cmd: string, args: string[]) => {
      if (cmd === 'yarn') throw new Error('install failed');
      return git(cmd, args);
    });

    await expect(latestPackagesSync(ctx)).rejects.toThrow('install failed');
    expect(gitCommands().at(-1)).toEqual(['checkout', '-q', '-f', '--detach', SHA]);
    expect(gitCommands().map((args) => args[0])).not.toContain('commit');
  });
});

describe('devBranchSync', () => {
  it('cherry-picks the release onto dev and pushes', async () => {
    expect(await devBranchSync(ctx)).toBe('picked');
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
    expect(await devBranchSync(ctx)).toBe('already-on-dev');
    expect(gitCalls().map(([cmd]) => cmd)).not.toContain('cherry-pick');
  });

  it('opens a PR to dev on conflicts', async () => {
    stubGit({ pick: 'conflict' });
    expect(await devBranchSync(ctx)).toBe('conflict-pr');
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

  it('creates legacy branches before release/latest moves to the release', async () => {
    await syncRelease(BRANCH, SHA, released);
    expect(order).toEqual(['legacy (release/latest pushes so far: 0)']);
    expect(releaseLatestPushes()).toHaveLength(1);
  });

  it('keeps release/latest at the previous release when a legacy branch fails', async () => {
    mocks.createLegacyBranches.mockRejectedValue(new Error('release/latest holds nextjs@3.0.0'));
    await expect(syncRelease(BRANCH, SHA, released)).rejects.toThrow(
      'createLegacyBranchesOnMajor: release/latest holds nextjs@3.0.0'
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
    await syncRelease('release/hotfix/20261013120000', SHA, released);
    expect(stepNames()).toEqual(['latestPackagesSync', 'refreshLegacyLockfiles', 'devBranchSync']);
    vi.mocked(console.log).mockClear();
    await syncRelease('release/legacy/nextjs/v2', SHA, released);
    expect(stepNames()).toEqual(['refreshLegacyLockfiles']);
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
      await syncRelease(BRANCH, SHA, released);
    }
    expect(releaseLatestPushes()).toEqual([]);
  });

  it('never touches release/latest from other branches', async () => {
    await syncRelease('release/legacy/nextjs/v2', SHA, released);
    expect(releaseLatestPushes()).toEqual([]);
  });
});
