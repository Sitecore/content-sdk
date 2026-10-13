/* eslint-disable jsdoc/require-jsdoc */
import path from 'path';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  copyDevToLatest,
  copyLimitedToLatest,
  publishedPackageDirs,
  RELEASE_LATEST,
} from './sync-latest-branch';

const mocks = vi.hoisted(() => ({
  execFileSync: vi.fn(),
  getPackages: vi.fn(),
}));

vi.mock('child_process', () => ({ execFileSync: mocks.execFileSync }));
vi.mock('@manypkg/get-packages', () => ({ getPackages: mocks.getPackages }));

const root = path.resolve('/repo');
const pkg = (name: string, ...dir: string[]) => ({
  dir: path.join(root, ...dir),
  packageJson: { name },
});

const packages = [
  pkg('@sitecore-content-sdk/core', 'packages', 'core'),
  pkg('@sitecore-content-sdk/nextjs', 'packages', 'nextjs'),
  pkg('@sitecore-content-sdk/nextjs-templates', 'templates', 'nextjs'),
];

const SHA = 'abcdef1234567890';
const MESSAGE = 'Latest release from release/limited/nextjs-1: @sitecore-content-sdk/nextjs@2.5.0';
const published = [{ name: '@sitecore-content-sdk/nextjs', version: '2.5.0' }];

// git calls in order, as argument arrays
const gitCalls = () =>
  mocks.execFileSync.mock.calls.filter(([cmd]) => cmd === 'git').map(([, args]) => args);

// stubs git; `staged` is the output of `git diff --cached --name-only`
function stubGit({ staged = 'packages/nextjs/package.json', fetchFails = false } = {}) {
  mocks.execFileSync.mockImplementation((cmd: string, args: string[]) => {
    if (cmd !== 'git') return '';
    if (args[0] === 'fetch' && fetchFails) throw new Error("couldn't find remote ref");
    if (args[0] === 'diff') return staged;
    return '';
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
  mocks.getPackages.mockResolvedValue({ packages, rootDir: root });
  stubGit();
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

describe('copyDevToLatest', () => {
  it('re-creates release/latest at the published commit', () => {
    copyDevToLatest(SHA);

    expect(gitCalls()).toEqual([['push', '-f', 'origin', `${SHA}:refs/heads/${RELEASE_LATEST}`]]);
  });
});

describe('copyLimitedToLatest', () => {
  it('overlays the published package directories onto release/latest and commits', async () => {
    await copyLimitedToLatest(SHA, MESSAGE, published);

    expect(gitCalls()).toEqual([
      ['fetch', 'origin', RELEASE_LATEST],
      ['checkout', '-q', '-B', RELEASE_LATEST, `origin/${RELEASE_LATEST}`],
      ['restore', `--source=${SHA}`, '--staged', '--worktree', '--', 'packages/nextjs'],
      ['add', '--', 'yarn.lock', 'packages/nextjs'],
      ['diff', '--cached', '--name-only'],
      ['commit', '-q', '-m', `[ci] ${MESSAGE}`],
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

  it('skips the commit when release/latest already holds the packages', async () => {
    stubGit({ staged: '' });

    await copyLimitedToLatest(SHA, MESSAGE, published);

    const commands = gitCalls().map((args) => args[0]);
    expect(commands).not.toContain('commit');
    expect(gitCalls()).not.toContainEqual(['push', 'origin', `HEAD:refs/heads/${RELEASE_LATEST}`]);
  });

  it('fails with a bootstrap hint when release/latest does not exist', async () => {
    stubGit({ fetchFails: true });

    await expect(copyLimitedToLatest(SHA, MESSAGE, published)).rejects.toThrow(
      /release\/latest does not exist yet/
    );
    expect(gitCalls()).toEqual([['fetch', 'origin', RELEASE_LATEST]]);
  });

  it('fails before touching release/latest when a published package is not in the workspace', async () => {
    await expect(
      copyLimitedToLatest(SHA, MESSAGE, [{ name: '@sitecore-content-sdk/nope', version: '1.0.0' }])
    ).rejects.toThrow(/not in the workspace/);
    expect(gitCalls()).toEqual([['fetch', 'origin', RELEASE_LATEST]]);
  });

  it('returns to the published commit when the sync fails midway', async () => {
    mocks.execFileSync.mockImplementation((cmd: string) => {
      if (cmd === 'yarn') throw new Error('install failed');
      return '';
    });

    await expect(copyLimitedToLatest(SHA, MESSAGE, published)).rejects.toThrow('install failed');
    expect(gitCalls().at(-1)).toEqual(['checkout', '-q', '-f', '--detach', SHA]);
    expect(gitCalls().map((args) => args[0])).not.toContain('commit');
  });
});
