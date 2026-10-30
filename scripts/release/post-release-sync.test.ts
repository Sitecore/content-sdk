/* eslint-disable jsdoc/require-jsdoc */
import path from 'path';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { devBranchSync, latestBranchSync, runSteps, syncRelease } from './post-release-sync';
import { RELEASE_LATEST } from '../constants';

const mocks = vi.hoisted(() => ({
  execFileSync: vi.fn(),
  getPackages: vi.fn(),
}));

vi.mock('child_process', () => ({ execFileSync: mocks.execFileSync }));
vi.mock('@manypkg/get-packages', () => ({ getPackages: mocks.getPackages }));

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

  const ghFails = (stderr: string) => {
    const git = mocks.execFileSync.getMockImplementation()!;
    mocks.execFileSync.mockImplementation((cmd: string, args: string[]) => {
      if (cmd === 'gh') throw Object.assign(new Error('gh failed'), { stderr });
      return git(cmd, args);
    });
  };

  it('accepts a conflict PR that is open already (re-run)', async () => {
    stubGit({ pick: 'conflict' });
    ghFails('a pull request for branch "x" into branch "dev" already exists:\nhttps://pr');
    await expect(devBranchSync(ctx)).resolves.toBeUndefined();
  });

  it('fails when the conflict PR cannot be opened', async () => {
    stubGit({ pick: 'conflict' });
    ghFails('HTTP 403: Resource not accessible by integration');
    await expect(devBranchSync(ctx)).rejects.toThrow(/could not be opened.*\n.*HTTP 403/);
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
  const releaseLatestPushes = () =>
    gitCalls().filter(
      ([cmd, ...rest]) => cmd === 'push' && rest.join(' ').includes(RELEASE_LATEST)
    );

  beforeEach(() => {
    stubGit({ devVersion: '2.5.0' }); // dev already has the bump: no cherry-pick
  });

  const stepNames = () =>
    vi
      .mocked(console.log)
      .mock.calls.map(([line]) => String(line))
      .filter((line) => line.startsWith('\n▶ '))
      .map((line) => line.slice(3));

  it('runs the steps of the branch prefix', async () => {
    await syncRelease('dev', SHA, released);
    expect(stepNames()).toEqual(['latestBranchSync']);
    vi.mocked(console.log).mockClear();
    await syncRelease(RELEASE_LATEST, SHA, released);
    expect(stepNames()).toEqual(['devBranchSync']);
    vi.mocked(console.log).mockClear();
    await syncRelease('release/1.x.x', SHA, released);
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
    await syncRelease('release/1.x.x', SHA, released);
    expect(releaseLatestPushes()).toEqual([]);
  });
});
