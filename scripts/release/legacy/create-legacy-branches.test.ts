/* eslint-disable jsdoc/require-jsdoc */
import path from 'path';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createLegacyBranches,
  getMajorPublishedProducts,
  checkoutLegacySource,
  getProductPackages,
  legacyPrunedDirs,
  refreshLegacyLockfiles,
  trimLegacyBranch,
} from './create-legacy-branches';
import { SCAFFOLDER } from '../../constants';

const mocks = vi.hoisted(() => ({
  execFileSync: vi.fn(),
  getPackages: vi.fn(),
  readProducts: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  rmSync: vi.fn(),
}));

vi.mock('child_process', () => ({ execFileSync: mocks.execFileSync }));
vi.mock('@manypkg/get-packages', () => ({ getPackages: mocks.getPackages }));
vi.mock('../../changesets/utils', () => ({ readProducts: mocks.readProducts }));
vi.mock('fs', () => ({
  readFileSync: mocks.readFileSync,
  writeFileSync: mocks.writeFileSync,
  rmSync: mocks.rmSync,
}));

const NEXTJS = '@sitecore-content-sdk/nextjs';
const ANGULAR = '@sitecore-content-sdk/angular';
const CORE = '@sitecore-content-sdk/core';

describe('getMajorPublishedProducts', () => {
  const products = { nextjs: [NEXTJS], angular: [ANGULAR] };
  const majors = (published: { name: string; version: string }[]) =>
    getMajorPublishedProducts(products, published);

  it('picks products whose own package was published as x.0.0', () => {
    expect(
      majors([
        { name: NEXTJS, version: '3.0.0' },
        { name: ANGULAR, version: '1.1.0' },
      ])
    ).toEqual(['nextjs']);
    expect(
      majors([
        { name: NEXTJS, version: '3.0.0' },
        { name: ANGULAR, version: '2.0.0' },
      ])
    ).toEqual(['nextjs', 'angular']);
  });

  it('ignores minors, patches, prereleases, 0.0.0 and non-product packages', () => {
    expect(majors([{ name: NEXTJS, version: '3.1.0' }])).toEqual([]);
    expect(majors([{ name: NEXTJS, version: '3.0.1' }])).toEqual([]);
    expect(majors([{ name: NEXTJS, version: '3.0.0-beta.0' }])).toEqual([]);
    expect(majors([{ name: NEXTJS, version: '0.0.0' }])).toEqual([]);
    expect(majors([{ name: '@sitecore-content-sdk/core', version: '3.0.0' }])).toEqual([]);
  });
});

describe('getProductPackages', () => {
  const products = { nextjs: [NEXTJS, '@sitecore-content-sdk/react'] };

  it("lists the product's packages and the scaffolder", () => {
    expect(getProductPackages(products, 'nextjs')).toEqual([
      NEXTJS,
      '@sitecore-content-sdk/react',
      SCAFFOLDER,
    ]);
  });

  it('throws on a product missing from products.config.json', () => {
    expect(() => getProductPackages(products, 'vue')).toThrow(/"vue" is not defined/);
  });
});

describe('legacyPrunedDirs', () => {
  const root = path.resolve('/repo');
  const pkg = (name: string, ...dir: string[]) => ({
    dir: path.join(root, ...dir),
    packageJson: { name },
  });
  const packages = [
    pkg('@sitecore-content-sdk/core', 'packages', 'core'),
    pkg('@sitecore-content-sdk/content', 'packages', 'content'),
    pkg(NEXTJS, 'packages', 'nextjs'),
    pkg('@sitecore-content-sdk/react', 'packages', 'react'),
    pkg(ANGULAR, 'packages', 'angular'),
    pkg('@sitecore-content-sdk/nextjs-templates', 'templates', 'nextjs'),
    pkg('@sitecore-content-sdk/angular-templates', 'templates', 'angular'),
    pkg(SCAFFOLDER, 'packages', 'create-content-sdk-app'),
  ];
  const products = {
    nextjs: [NEXTJS, '@sitecore-content-sdk/react', '@sitecore-content-sdk/nextjs-templates'],
    angular: [ANGULAR, '@sitecore-content-sdk/angular-templates'],
  };

  it("keeps the product's packages and the scaffolder, drops everything else", () => {
    expect(legacyPrunedDirs(packages, root, getProductPackages(products, 'nextjs'))).toEqual([
      'packages/core',
      'packages/content',
      'packages/angular',
      'templates/angular',
    ]);
    expect(legacyPrunedDirs(packages, root, getProductPackages(products, 'angular'))).toEqual([
      'packages/core',
      'packages/content',
      'packages/nextjs',
      'packages/react',
      'templates/nextjs',
    ]);
  });
});

// git side effects: execFileSync is stubbed, calls are checked as argument arrays

const TAG_SHA = '1111111aaaaaaa';
const LEGACY_SHA = '2222222bbbbbbb';
const LEGACY_NEXTJS = 'release/legacy/nextjs';
const LEGACY_ANGULAR = 'release/legacy/angular';
const root = path.resolve('/repo');
const workspace = [
  [CORE, 'core'],
  [NEXTJS, 'nextjs'],
  [ANGULAR, 'angular'],
  [SCAFFOLDER, 'create-content-sdk-app'],
].map(([name, dir]) => ({ dir: path.join(root, 'packages', dir), packageJson: { name } }));

const gitCalls = () =>
  mocks.execFileSync.mock.calls.filter(([cmd]) => cmd === 'git').map(([, args]) => args);
const gitCommands = (name: string) => gitCalls().filter(([cmd]) => cmd === name);
const yarnCalls = () =>
  mocks.execFileSync.mock.calls.filter(([cmd]) => cmd === 'yarn').map(([, args]) => args);
const fail = (message: string, status = 1): never => {
  throw Object.assign(new Error(message), { status });
};

// Stubs git and yarn. `tag`: origin has the `latest` tag; `legacyBranch`: origin has the nextjs
// legacy branch at LEGACY_SHA, `holds`: which already contains the tag; `lsRemoteFails`: looking
// the branch up fails (network, auth); `remoteLegacy`: the legacy branches on origin, `unchanged`:
// those whose yarn.lock the refresh leaves as is; `tagVersion`: the product package version at the
// tag, `tagProducts`: its products.config.json (null: none, predates it).
function stubGit({
  tag = true,
  legacyBranch = false,
  lsRemoteFails = false,
  holds = false,
  remoteLegacy = [] as string[],
  unchanged = [] as string[],
  tagVersion = '2.5.0',
  tagProducts = null as Record<string, string[]> | null,
} = {}) {
  let checkedOut = '';
  mocks.execFileSync.mockImplementation((cmd: string, args: string[]) => {
    if (cmd === 'yarn') return '';
    const [sub, ...rest] = args;
    switch (sub) {
      case 'fetch':
        if (rest.some((arg) => arg.startsWith('refs/tags/')) && !tag) fail('no such ref');
        if (rest.includes(LEGACY_NEXTJS) && !legacyBranch) fail("couldn't find remote ref");
        return '';
      case 'ls-remote':
        if (lsRemoteFails) fail('could not read from remote repository', 128);
        return legacyBranch ? '' : fail('', 2);
      case 'merge-base':
        return holds ? '' : fail('not an ancestor');
      case 'show':
        if (rest[0].endsWith('products.config.json')) {
          return tagProducts ? JSON.stringify(tagProducts) : fail('path does not exist');
        }
        return JSON.stringify({ version: tagVersion });
      case 'rev-parse':
        return rest[0] === `origin/${LEGACY_NEXTJS}` ? LEGACY_SHA : TAG_SHA;
      case 'branch':
        return remoteLegacy.map((branch) => `origin/${branch}`).join('\n');
      case 'checkout':
        checkedOut = rest[rest.length - 1];
        return '';
      case 'commit':
        return unchanged.some((branch) => checkedOut === `origin/${branch}`)
          ? fail('nothing to commit')
          : '';
      default:
        return '';
    }
  });
}

describe('legacy branch git side effects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    mocks.getPackages.mockResolvedValue({ packages: workspace, rootDir: root });
    mocks.readProducts.mockReturnValue({ nextjs: [NEXTJS], angular: [ANGULAR] });
    mocks.readFileSync.mockReturnValue(JSON.stringify({ baseBranch: 'dev', ignore: [] }));
    stubGit();
  });

  describe('checkoutLegacySource', () => {
    it('checks out the latest tag (detached) when the legacy branch does not exist yet', () => {
      expect(checkoutLegacySource('nextjs', 3)).toEqual({
        slug: 'nextjs',
        branch: LEGACY_NEXTJS,
        source: TAG_SHA,
        remoteSha: null,
      });
      expect(gitCommands('ls-remote')).toEqual([
        ['ls-remote', '--exit-code', '--heads', 'origin', LEGACY_NEXTJS],
      ]);
      expect(gitCommands('checkout')).toEqual([['checkout', '-q', '-f', '--detach', TAG_SHA]]);
    });

    it("replaces a previous major's branch, which does not hold the tag", () => {
      stubGit({ legacyBranch: true });
      expect(checkoutLegacySource('nextjs', 3)).toMatchObject({
        source: TAG_SHA,
        remoteSha: LEGACY_SHA,
      });
      expect(gitCommands('merge-base')).toEqual([
        ['merge-base', '--is-ancestor', TAG_SHA, LEGACY_SHA],
      ]);
      expect(gitCommands('checkout')).toHaveLength(1);
    });

    it('throws, without checking out, when the branch cannot be looked up (network, auth)', () => {
      stubGit({ lsRemoteFails: true });
      expect(() => checkoutLegacySource('nextjs', 3)).toThrow(
        'could not read from remote repository'
      );
      expect(gitCommands('checkout')).toEqual([]);
    });

    it('skips, without checking out, when the branch already holds the tag (re-run)', () => {
      stubGit({ legacyBranch: true, holds: true });
      expect(checkoutLegacySource('nextjs', 3)).toBeNull();
      expect(gitCommands('checkout')).toEqual([]);
    });

    it('reads the product package version at the tag', () => {
      checkoutLegacySource('nextjs', 3);
      expect(gitCommands('show')).toEqual([['show', `${TAG_SHA}:packages/nextjs/package.json`]]);
    });

    it('throws, without checking out, when the tag is not on an older major (moved already)', () => {
      for (const tagVersion of ['3.0.0', '3.1.0', '4.0.0']) {
        stubGit({ legacyBranch: true, holds: true, tagVersion });
        expect(() => checkoutLegacySource('nextjs', 3)).toThrow(
          'Cannot create legacy branch. latest tag points to the fresh release instead of the ' +
            'previous major. If tag was moved, point it at the previous release and re-run.'
        );
      }
      expect(gitCommands('checkout')).toEqual([]);
    });
  });

  describe('trimLegacyBranch', () => {
    const legacy = { slug: 'nextjs', branch: LEGACY_NEXTJS, source: TAG_SHA, remoteSha: null };
    const writtenConfig = () => JSON.parse(mocks.writeFileSync.mock.calls[0][1]);

    it('deletes the other packages, ignores the scaffolder, refreshes yarn.lock, pushes', async () => {
      await trimLegacyBranch(legacy, [NEXTJS, SCAFFOLDER]);

      expect(mocks.rmSync.mock.calls).toEqual([
        [path.join(root, 'packages/core'), { recursive: true, force: true }],
        [path.join(root, 'packages/angular'), { recursive: true, force: true }],
      ]);
      expect(writtenConfig()).toEqual({ baseBranch: 'dev', ignore: [SCAFFOLDER] });
      expect(yarnCalls()).toEqual([['install', '--mode=update-lockfile']]);
      expect(gitCalls().map(([cmd]) => cmd)).toEqual(['add', 'commit', 'push']);
      expect(gitCommands('add')).toEqual([['add', '-u']]);
      expect(gitCommands('commit')[0]).toContain(
        `[ci] Legacy nextjs branch from ${TAG_SHA.slice(0, 7)}: product packages only [skip ci]`
      );
      expect(gitCommands('push')).toEqual([
        [
          'push',
          `--force-with-lease=refs/heads/${LEGACY_NEXTJS}:`,
          'origin',
          `HEAD:refs/heads/${LEGACY_NEXTJS}`,
        ],
      ]);
    });

    it('replaces only the branch commit it saw (lease)', async () => {
      await trimLegacyBranch({ ...legacy, remoteSha: LEGACY_SHA }, [NEXTJS, SCAFFOLDER]);
      expect(gitCommands('push')[0][1]).toBe(
        `--force-with-lease=refs/heads/${LEGACY_NEXTJS}:${LEGACY_SHA}`
      );
    });

    it('keeps the existing ignore entries and lists the scaffolder once', async () => {
      mocks.readFileSync.mockReturnValue(JSON.stringify({ ignore: ['some-pkg', SCAFFOLDER] }));
      await trimLegacyBranch(legacy, [NEXTJS, SCAFFOLDER]);
      expect(writtenConfig().ignore).toEqual(['some-pkg', SCAFFOLDER]);
    });
  });

  describe('createLegacyBranches', () => {
    const nextjsMajor = [{ name: NEXTJS, version: '3.0.0' }];

    it('does nothing without a product major', async () => {
      await createLegacyBranches([{ name: NEXTJS, version: '2.5.0' }]);
      expect(gitCalls()).toEqual([]);
    });

    it('does nothing when origin has no latest tag yet (bootstrap)', async () => {
      stubGit({ tag: false });
      await createLegacyBranches(nextjsMajor);
      expect(gitCalls()).toEqual([
        ['fetch', '-q', '-f', 'origin', 'refs/tags/latest:refs/tags/latest'],
      ]);
    });

    it('creates the branch at the tag', async () => {
      await createLegacyBranches(nextjsMajor);
      expect(gitCommands('checkout')).toEqual([['checkout', '-q', '-f', '--detach', TAG_SHA]]);
      expect(gitCommands('push')).toEqual([
        [
          'push',
          `--force-with-lease=refs/heads/${LEGACY_NEXTJS}:`,
          'origin',
          `HEAD:refs/heads/${LEGACY_NEXTJS}`,
        ],
      ]);
    });

    it("replaces a previous major's branch with a lease on its commit", async () => {
      stubGit({ legacyBranch: true });
      await createLegacyBranches(nextjsMajor);
      expect(gitCommands('push')[0][1]).toBe(
        `--force-with-lease=refs/heads/${LEGACY_NEXTJS}:${LEGACY_SHA}`
      );
    });

    const deleted = () => mocks.rmSync.mock.calls.map(([dir]) => dir);

    it("trims to the previous major's products: keeps a package the new release moved out", async () => {
      // the new release dropped core from nextjs; the previous major shipped it
      stubGit({ tagProducts: { nextjs: [NEXTJS, CORE], angular: [ANGULAR] } });
      await createLegacyBranches(nextjsMajor);
      expect(gitCommands('show')).toContainEqual([
        'show',
        `${TAG_SHA}:.changeset/products.config.json`,
      ]);
      expect(deleted()).toEqual([path.join(root, 'packages/angular')]);
    });

    it('uses the new products when the tag predates products.config.json', async () => {
      await createLegacyBranches(nextjsMajor);
      expect(deleted()).toEqual([
        path.join(root, 'packages/core'),
        path.join(root, 'packages/angular'),
      ]);
    });

    it('pushes nothing when the branch already holds the tag (re-run)', async () => {
      stubGit({ legacyBranch: true, holds: true });
      await createLegacyBranches(nextjsMajor);
      expect(gitCommands('commit')).toEqual([]);
      expect(gitCommands('push')).toEqual([]);
    });
  });

  describe('refreshLegacyLockfiles', () => {
    it('refreshes every legacy branch and pushes only the changed lockfiles', async () => {
      stubGit({ remoteLegacy: [LEGACY_NEXTJS, LEGACY_ANGULAR], unchanged: [LEGACY_ANGULAR] });
      await refreshLegacyLockfiles();

      expect(yarnCalls()).toEqual([
        ['up', '-R', '@sitecore-content-sdk/*', '--mode=update-lockfile'],
        ['up', '-R', '@sitecore-content-sdk/*', '--mode=update-lockfile'],
      ]);
      expect(gitCommands('commit')).toHaveLength(2);
      expect(gitCommands('push')).toEqual([['push', 'origin', `HEAD:refs/heads/${LEGACY_NEXTJS}`]]);
    });

    it('does nothing without legacy branches', async () => {
      await refreshLegacyLockfiles();
      expect(yarnCalls()).toEqual([]);
      expect(gitCommands('push')).toEqual([]);
    });
  });
});
