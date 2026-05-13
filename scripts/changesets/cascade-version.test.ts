import { appendFileSync } from 'fs';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Packages } from '@manypkg/get-packages';
import type { NewChangesetWithCommit } from '@changesets/types';
import { getChangesetsWithCommits, getTransitiveDependents } from './cascade-version';

const mocks = vi.hoisted(() => {
  const emptyPackages = {
    rootDir: '/repo',
    packages: [] as { dir: string; packageJson: { name: string; version: string } }[],
  };
  const defaultReadConfig = {
    commit: true,
    changelog: true,
    snapshot: { prereleaseTemplate: undefined as string | undefined },
  };
  return {
    getCommitsThatAddFiles: vi.fn().mockResolvedValue([]),
    getCurrentCommitId: vi.fn().mockResolvedValue('fullcommitid1234567890abcdef1234567890ab'),
    readChangesets: vi.fn().mockResolvedValue([]),
    readConfig: vi.fn().mockResolvedValue(defaultReadConfig),
    readPreState: vi.fn().mockResolvedValue(undefined),
    getPackages: vi.fn().mockResolvedValue(emptyPackages),
    getDependentsGraph: vi.fn().mockReturnValue(new Map()),
    assembleReleasePlan: vi.fn(() => ({
      releases: [] as {
        name: string;
        type: string;
        oldVersion: string;
        newVersion: string;
      }[],
    })),
    applyReleasePlan: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock('fs', () => ({
  appendFileSync: vi.fn(),
}));

vi.mock('@changesets/git', () => ({
  getCommitsThatAddFiles: mocks.getCommitsThatAddFiles,
  getCurrentCommitId: mocks.getCurrentCommitId,
}));

vi.mock('@changesets/read', () => ({
  default: mocks.readChangesets,
}));

vi.mock('@changesets/config', () => ({
  read: mocks.readConfig,
}));

vi.mock('@changesets/pre', () => ({
  readPreState: mocks.readPreState,
}));

vi.mock('@manypkg/get-packages', () => ({
  getPackages: mocks.getPackages,
}));

vi.mock('@changesets/get-dependents-graph', () => ({
  getDependentsGraph: mocks.getDependentsGraph,
}));

vi.mock('@changesets/assemble-release-plan', () => ({
  default: mocks.assembleReleasePlan,
}));

vi.mock('@changesets/apply-release-plan', () => ({
  default: mocks.applyReleasePlan,
}));

function mkPackages(names: string[]) {
  return {
    rootDir: '/repo',
    packages: names.map((name) => ({
      dir: `/repo/${name.replace(/\//g, '-')}`,
      packageJson: { name, version: '1.0.0' },
    })),
  };
}

function baseConfig(overrides: Record<string, unknown> = {}) {
  return {
    commit: true,
    changelog: true,
    snapshot: { prereleaseTemplate: undefined as string | undefined },
    ...overrides,
  };
}

async function waitFor(predicate: () => boolean, timeout = 5000): Promise<void> {
  const start = Date.now();
  while (!predicate()) {
    if (Date.now() - start > timeout) {
      throw new Error('timeout waiting for cascade main()');
    }
    await new Promise<void>((resolve) => setImmediate(resolve));
  }
}

async function importCascade(): Promise<void> {
  await import('./cascade-version');
}

describe('cascade-version', () => {
  let exitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    delete process.env.GITHUB_OUTPUT;
    process.argv = ['node', 'tsx', 'scripts/changesets/cascade-version.ts'];
    mocks.getPackages.mockResolvedValue(mkPackages([]));
    mocks.readConfig.mockResolvedValue(baseConfig());
    mocks.readPreState.mockResolvedValue(undefined);
    mocks.readChangesets.mockResolvedValue([]);
    mocks.getCommitsThatAddFiles.mockResolvedValue([]);
    mocks.getDependentsGraph.mockReturnValue(new Map());
    mocks.getCurrentCommitId.mockResolvedValue('fullcommitid1234567890abcdef1234567890ab');
    mocks.assembleReleasePlan.mockReturnValue({
      releases: [
        {
          name: '@sitecore-content-sdk/core',
          type: 'patch',
          oldVersion: '1.0.0',
          newVersion: '1.0.1',
        },
      ],
    });
    mocks.applyReleasePlan.mockResolvedValue(undefined);
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee');
  });

  afterEach(async () => {
    // Let main().catch (process.exit) finish before restoring process.exit; otherwise Vitest's
    // process.exit guard throws an unhandled rejection after the spy is removed.
    await new Promise<void>((resolve) => {
      setImmediate(() => setImmediate(() => resolve()));
    });
    vi.restoreAllMocks();
  });

  describe('non-snapshot mode (full release)', () => {
    it('should not apply release plan when --dry-run is passed', async () => {
      const cfg = baseConfig({ commit: true });
      mocks.readConfig.mockResolvedValue(cfg);
      process.argv.push('--dry-run');
      mocks.readChangesets.mockResolvedValue([
        {
          id: 'real-1',
          summary: 'Bump',
          releases: [{ name: '@sitecore-content-sdk/search', type: 'major' }],
        },
      ]);
      mocks.getPackages.mockResolvedValue(
        mkPackages(['@sitecore-content-sdk/search', '@sitecore-content-sdk/react'])
      );
      mocks.getCommitsThatAddFiles.mockResolvedValue(['aaa']);
      mocks.getDependentsGraph.mockReturnValue(
        new Map<string, string[]>([
          ['@sitecore-content-sdk/search', ['@sitecore-content-sdk/react']],
          ['@sitecore-content-sdk/react', []],
        ])
      );

      await importCascade();
      await waitFor(() => mocks.assembleReleasePlan.mock.calls.length > 0);
      expect(cfg.commit).toBe(false);
      expect(mocks.applyReleasePlan).not.toHaveBeenCalled();
    });

    it('should skip execution when there are no pending changesets', async () => {
      mocks.readChangesets.mockResolvedValue([]);
      mocks.getCommitsThatAddFiles.mockResolvedValue([]);

      await importCascade();
      await waitFor(
        () =>
          mocks.readChangesets.mock.calls.length > 0 &&
          mocks.getCommitsThatAddFiles.mock.calls.length > 0
      );
      for (let i = 0; i < 25; i++) await new Promise<void>((r) => setImmediate(r));
      expect(mocks.assembleReleasePlan).not.toHaveBeenCalled();
      expect(mocks.applyReleasePlan).not.toHaveBeenCalled();
    });

    it('should not emit synthetic cascade changesets for patch-only source bumps when not in snapshot mode', async () => {
      mocks.readChangesets.mockResolvedValue([
        {
          id: 'r1',
          summary: 'Patch only',
          releases: [{ name: '@sitecore-content-sdk/search', type: 'patch' }],
        },
      ]);
      mocks.getCommitsThatAddFiles.mockResolvedValue(['abc']);
      mocks.getPackages.mockResolvedValue(
        mkPackages(['@sitecore-content-sdk/search', '@sitecore-content-sdk/react'])
      );
      mocks.getDependentsGraph.mockReturnValue(
        new Map([
          ['@sitecore-content-sdk/search', ['@sitecore-content-sdk/react']],
          ['@sitecore-content-sdk/react', []],
        ])
      );

      await importCascade();
      await waitFor(() => mocks.assembleReleasePlan.mock.calls.length > 0);
      const finalCs = mocks.assembleReleasePlan.mock.calls[0]?.[0] as NewChangesetWithCommit[];
      expect(finalCs?.filter((c) => c.id.startsWith('cascade-changeset-')).length).toBe(0);
      expect(finalCs?.length).toBe(1);
    });

    it('should generate casacade changesets for dependent packages when major or minor changesets present', async () => {
      mocks.readChangesets.mockResolvedValue([
        {
          id: 'r1',
          summary: 'Major search',
          releases: [{ name: '@sitecore-content-sdk/search', type: 'major' }],
        },
      ]);
      mocks.getCommitsThatAddFiles.mockResolvedValue(['1111111']);
      mocks.getPackages.mockResolvedValue(
        mkPackages([
          '@sitecore-content-sdk/search',
          '@sitecore-content-sdk/react',
          'create-content-sdk-app',
        ])
      );
      mocks.getDependentsGraph.mockReturnValue(
        new Map([
          ['@sitecore-content-sdk/search', ['@sitecore-content-sdk/react']],
          ['@sitecore-content-sdk/react', ['create-content-sdk-app']],
          ['create-content-sdk-app', []],
        ])
      );

      await importCascade();
      await waitFor(() => mocks.assembleReleasePlan.mock.calls.length > 0);
      const finalCs = mocks.assembleReleasePlan.mock.calls[0]?.[0] as Array<{
        id: string;
        releases: { name: string; type: string }[];
      }>;
      const synthetic = finalCs?.filter((c) => c.id.startsWith('cascade-changeset-')) ?? [];
      const forSdk = synthetic.find((c) =>
        c.releases.some((r) => r.name === 'create-content-sdk-app')
      );
      const forReact = synthetic.find((c) =>
        c.releases.some((r) => r.name === '@sitecore-content-sdk/react')
      );
      expect(forSdk?.releases[0]?.type).toBe('patch');
      expect(forReact?.releases[0]?.type).toBe('major');
    });

    it('should generate synthetic cascade changesets for every transitive downstream dependent when the source changeset qualifies for cascade', async () => {
      mocks.readChangesets.mockResolvedValue([
        {
          id: 'r1',
          summary: 'Minor',
          releases: [{ name: '@sitecore-content-sdk/search', type: 'minor' }],
        },
      ]);
      mocks.getCommitsThatAddFiles.mockResolvedValue(['2222222']);
      mocks.getPackages.mockResolvedValue(
        mkPackages([
          '@sitecore-content-sdk/search',
          '@sitecore-content-sdk/react',
          '@sitecore-content-sdk/nextjs',
          'create-content-sdk-app',
        ])
      );
      mocks.getDependentsGraph.mockReturnValue(
        new Map([
          ['@sitecore-content-sdk/search', ['@sitecore-content-sdk/react']],
          ['@sitecore-content-sdk/react', ['@sitecore-content-sdk/nextjs']],
          ['@sitecore-content-sdk/nextjs', ['create-content-sdk-app']],
          ['create-content-sdk-app', []],
        ])
      );

      await importCascade();
      await waitFor(() => mocks.assembleReleasePlan.mock.calls.length > 0);
      const finalCs = mocks.assembleReleasePlan.mock.calls[0]?.[0] as {
        id: string;
      }[];
      const allReleases = finalCs?.flatMap(
        (c: { releases?: { name: string }[] }) => c.releases ?? []
      );
      const bumped = new Set(allReleases?.map((r) => r.name) ?? []);
      expect(bumped.has('@sitecore-content-sdk/react')).toBe(true);
      expect(bumped.has('@sitecore-content-sdk/nextjs')).toBe(true);
      expect(bumped.has('create-content-sdk-app')).toBe(true);
    });

    it('should pass finalChangesets that contain original+synthetic changesets when assembling the release plan', async () => {
      mocks.readChangesets.mockResolvedValue([
        {
          id: 'orig',
          summary: 'A',
          releases: [{ name: '@sitecore-content-sdk/core', type: 'major' }],
        },
      ]);
      mocks.getCommitsThatAddFiles.mockResolvedValue(['4444444']);
      mocks.getPackages.mockResolvedValue(
        mkPackages([
          '@sitecore-content-sdk/core',
          '@sitecore-content-sdk/react',
          '@sitecore-content-sdk/cli',
        ])
      );
      mocks.getDependentsGraph.mockReturnValue(
        new Map([
          ['@sitecore-content-sdk/core', ['@sitecore-content-sdk/react']],
          ['@sitecore-content-sdk/react', []],
          ['@sitecore-content-sdk/cli', []],
        ])
      );

      await importCascade();
      await waitFor(() => mocks.assembleReleasePlan.mock.calls.length > 0);
      const finalCs = mocks.assembleReleasePlan.mock.calls[0]?.[0] as {
        id: string;
      }[];
      expect(finalCs?.some((c) => c.id === 'orig')).toBe(true);
      expect(finalCs?.some((c) => c.id.startsWith('cascade-changeset-'))).toBe(true);
      const syntheticTargets = finalCs
        ?.filter((c) => c.id.startsWith('cascade-changeset-'))
        .flatMap((c: { releases?: { name: string }[] }) => c.releases?.map((r) => r.name) ?? []);
      expect(syntheticTargets).toContain('@sitecore-content-sdk/react');
      expect(syntheticTargets).not.toContain('@sitecore-content-sdk/cli');
    });

    it('should compute transitive dependents without infinite recursion when the dependents graph contains cycles', async () => {
      mocks.readChangesets.mockResolvedValue([
        {
          id: 'c1',
          summary: 'X',
          releases: [{ name: '@sitecore-content-sdk/core', type: 'major' }],
        },
      ]);
      mocks.getCommitsThatAddFiles.mockResolvedValue(['5555555']);
      mocks.getPackages.mockResolvedValue(
        mkPackages(['@sitecore-content-sdk/core', '@sitecore-content-sdk/react'])
      );
      mocks.getDependentsGraph.mockReturnValue(
        new Map([
          ['@sitecore-content-sdk/core', ['@sitecore-content-sdk/react']],
          ['@sitecore-content-sdk/react', ['@sitecore-content-sdk/core']],
        ])
      );

      await importCascade();
      await waitFor(() => mocks.assembleReleasePlan.mock.calls.length > 0);
      const finalCs = mocks.assembleReleasePlan.mock.calls[0]?.[0] as {
        id: string;
      }[];
      expect(finalCs?.length).toBeGreaterThan(0);
    });

    it('should attach the correct per-package release type to cascade changesets when one changeset releases multiple packages', async () => {
      mocks.readChangesets.mockResolvedValue([
        {
          id: 'multi',
          summary: 'Both',
          releases: [
            { name: '@sitecore-content-sdk/core', type: 'major' },
            { name: '@sitecore-content-sdk/content', type: 'minor' },
          ],
        },
      ]);
      mocks.getCommitsThatAddFiles.mockResolvedValue(['6666666']);
      mocks.getPackages.mockResolvedValue(
        mkPackages([
          '@sitecore-content-sdk/core',
          '@sitecore-content-sdk/content',
          '@sitecore-content-sdk/nextjs',
        ])
      );
      mocks.getDependentsGraph.mockReturnValue(
        new Map([
          ['@sitecore-content-sdk/core', ['@sitecore-content-sdk/nextjs']],
          ['@sitecore-content-sdk/content', ['@sitecore-content-sdk/nextjs']],
          ['@sitecore-content-sdk/nextjs', []],
        ])
      );

      await importCascade();
      await waitFor(() => mocks.assembleReleasePlan.mock.calls.length > 0);
      const finalCs = mocks.assembleReleasePlan.mock.calls[0]?.[0] as {
        id: string;
        summary: string;
        releases: { type: string }[];
      }[];
      const majorSynth = finalCs?.find(
        (c) =>
          c.id.startsWith('cascade-changeset-') &&
          c.summary.includes('major `@sitecore-content-sdk/core`')
      );
      const minorSynth = finalCs?.find(
        (c) =>
          c.id.startsWith('cascade-changeset-') &&
          c.summary.includes('minor `@sitecore-content-sdk/content`')
      );
      expect(majorSynth?.releases[0]?.type).toBe('major');
      expect(minorSynth?.releases[0]?.type).toBe('minor');
    });

    it('should merge readChangesets output with getCommitsThatAddFiles results in .changeset path order when building changesets-with-commits', async () => {
      mocks.readChangesets.mockResolvedValue([
        {
          id: 'first',
          summary: 'A',
          releases: [{ name: '@sitecore-content-sdk/core', type: 'patch' }],
        },
        {
          id: 'second',
          summary: 'B',
          releases: [{ name: '@sitecore-content-sdk/core', type: 'patch' }],
        },
      ]);
      mocks.getCommitsThatAddFiles.mockImplementation(async (_paths: string[]) => {
        expect(_paths).toEqual(['.changeset/first.md', '.changeset/second.md']);
        return ['commit-first', 'commit-second'];
      });
      mocks.getPackages.mockResolvedValue(mkPackages(['@sitecore-content-sdk/core']));
      mocks.getDependentsGraph.mockReturnValue(new Map([['@sitecore-content-sdk/core', []]]));

      await importCascade();
      await waitFor(() => mocks.assembleReleasePlan.mock.calls.length > 0);
      const finalCs = mocks.assembleReleasePlan.mock.calls[0]?.[0] as NewChangesetWithCommit[];
      expect(finalCs?.[0]?.commit).toBe('commit-first');
      expect(finalCs?.[1]?.commit).toBe('commit-second');
    });

    it('should assign synthetic changeset ids matching cascade-changeset-<uuid> format when generating synthetic cascade changesets', async () => {
      mocks.readChangesets.mockResolvedValue([
        {
          id: 'src',
          summary: 'S',
          releases: [{ name: '@sitecore-content-sdk/core', type: 'major' }],
        },
      ]);
      mocks.getCommitsThatAddFiles.mockResolvedValue(['7777777']);
      mocks.getPackages.mockResolvedValue(
        mkPackages(['@sitecore-content-sdk/core', '@sitecore-content-sdk/react'])
      );
      mocks.getDependentsGraph.mockReturnValue(
        new Map([['@sitecore-content-sdk/core', ['@sitecore-content-sdk/react']]])
      );

      await importCascade();
      await waitFor(() => mocks.assembleReleasePlan.mock.calls.length > 0);
      const finalCs = mocks.assembleReleasePlan.mock.calls[0]?.[0] as {
        id: string;
      }[];
      const id = finalCs?.find((c) => c.id.startsWith('cascade-changeset-'))?.id;
      expect(id).toBe('cascade-changeset-aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee');
    });

    it('should include same commit short link in synthetic summary lines as the source changeset when the source changeset has a commit', async () => {
      mocks.readChangesets.mockResolvedValue([
        {
          id: 'src',
          summary: 'Line',
          releases: [{ name: '@sitecore-content-sdk/core', type: 'major' }],
        },
      ]);
      const commitFull = 'mock-commit-SHA';
      mocks.getCommitsThatAddFiles.mockResolvedValue([commitFull]);
      mocks.getPackages.mockResolvedValue(
        mkPackages(['@sitecore-content-sdk/core', '@sitecore-content-sdk/react'])
      );
      mocks.getDependentsGraph.mockReturnValue(
        new Map([['@sitecore-content-sdk/core', ['@sitecore-content-sdk/react']]])
      );

      await importCascade();
      await waitFor(() => mocks.assembleReleasePlan.mock.calls.length > 0);
      const finalCs = mocks.assembleReleasePlan.mock.calls[0]?.[0] as {
        id: string;
        summary: string;
      }[];
      const synth = finalCs?.find((c) => c.id.startsWith('cascade-changeset-'));
      const shortSha = commitFull.substring(0, 7);
      expect(synth?.summary).toContain(`[${shortSha}]`);
      expect(synth?.summary).toContain(
        `https://github.com/sitecore/content-sdk/commit/${commitFull}`
      );
    });

    it('should not use commit links in synthetic summary lines when the source changeset has no commit', async () => {
      mocks.readChangesets.mockResolvedValue([
        {
          id: 'src',
          summary: 'No commit',
          releases: [{ name: '@sitecore-content-sdk/core', type: 'major' }],
        },
      ]);
      mocks.getCommitsThatAddFiles.mockResolvedValue([undefined]);
      mocks.getPackages.mockResolvedValue(
        mkPackages(['@sitecore-content-sdk/core', '@sitecore-content-sdk/react'])
      );
      mocks.getDependentsGraph.mockReturnValue(
        new Map([['@sitecore-content-sdk/core', ['@sitecore-content-sdk/react']]])
      );

      await importCascade();
      await waitFor(() => mocks.assembleReleasePlan.mock.calls.length > 0);
      const finalCs = mocks.assembleReleasePlan.mock.calls[0]?.[0] as {
        summary: string;
      }[];
      const synth = finalCs?.find((c) => c.id.startsWith('cascade-changeset-'));
      expect(synth?.summary).not.toContain('github.com');
    });
  });

  describe('snapshot mode', () => {
    it('should exit with error when --snapshot is passed but changesets is in "pre" mode', async () => {
      process.argv.push('--snapshot');
      mocks.readPreState.mockResolvedValue({ mode: 'pre' as const, tag: 'x' });

      await importCascade();
      await waitFor(() => exitSpy.mock.calls.length > 0);
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('should write snapshot_publish=true to GITHUB_OUTPUT when snapshot mode finishes with pending changesets', async () => {
      process.argv.push('--snapshot');
      process.env.GITHUB_OUTPUT = '/tmp/github-output-mock';
      mocks.readConfig.mockResolvedValue(
        baseConfig({ snapshot: { prereleaseTemplate: '0.0.0-{tag}' } })
      );
      mocks.readChangesets.mockResolvedValue([
        {
          id: 'r1',
          summary: 'S',
          releases: [{ name: '@sitecore-content-sdk/core', type: 'patch' }],
        },
      ]);
      mocks.getCommitsThatAddFiles.mockResolvedValue([undefined]);
      mocks.getPackages.mockResolvedValue(mkPackages(['@sitecore-content-sdk/core']));
      mocks.getDependentsGraph.mockReturnValue(new Map([['@sitecore-content-sdk/core', []]]));

      await importCascade();
      await waitFor(() => mocks.applyReleasePlan.mock.calls.length > 0);
      await waitFor(() =>
        (vi.mocked(appendFileSync) as ReturnType<typeof vi.fn>).mock.calls.some((c: string[]) =>
          String(c[1]).includes('snapshot_publish=true')
        )
      );
      expect(appendFileSync).toHaveBeenCalledWith(
        '/tmp/github-output-mock',
        'snapshot_publish=true\n'
      );
    });

    it('should not write GH output when GITHUB_OUTPUT env is not set', async () => {
      process.argv.push('--snapshot');
      mocks.readChangesets.mockResolvedValue([]);
      mocks.getCommitsThatAddFiles.mockResolvedValue([]);

      await importCascade();
      await waitFor(
        () =>
          mocks.readChangesets.mock.calls.length > 0 &&
          mocks.getCommitsThatAddFiles.mock.calls.length > 0
      );
      expect(appendFileSync).not.toHaveBeenCalled();
    });

    it('should pass commit SHA within snapshotParams to changeset assembleReleasePlan, when changeset snapshot config requires it', async () => {
      const commitSha = 'fullcommitid1234567890abcdef1234567890ab';
      const scenarios = [
        {
          prereleaseTemplate: '0.0.0-canary.{tag}',
          configRequiresCommitSha: false,
          expectedSnapshotParams: { tag: 'canary' as const },
        },
        {
          prereleaseTemplate: '{tag}.{commit}',
          configRequiresCommitSha: true,
          expectedSnapshotParams: { tag: 'canary' as const, commit: commitSha },
        },
      ] as const;

      for (const scenario of scenarios) {
        vi.resetModules();
        vi.clearAllMocks();
        process.argv = ['node', 'tsx', 'scripts/changesets/cascade-version.ts', '--snapshot'];
        mocks.getPackages.mockResolvedValue(mkPackages(['@sitecore-content-sdk/core']));
        mocks.readConfig.mockResolvedValue(
          baseConfig({
            snapshot: { prereleaseTemplate: scenario.prereleaseTemplate },
          })
        );
        mocks.readPreState.mockResolvedValue(undefined);
        mocks.readChangesets.mockResolvedValue([
          {
            id: 'r1',
            summary: 'S',
            releases: [{ name: '@sitecore-content-sdk/core', type: 'patch' }],
          },
        ]);
        mocks.getCommitsThatAddFiles.mockResolvedValue([undefined]);
        mocks.getDependentsGraph.mockReturnValue(new Map([['@sitecore-content-sdk/core', []]]));
        mocks.getCurrentCommitId.mockResolvedValue(commitSha);
        mocks.assembleReleasePlan.mockReturnValue({
          releases: [
            {
              name: '@sitecore-content-sdk/core',
              type: 'patch',
              oldVersion: '1.0.0',
              newVersion: '1.0.1',
            },
          ],
        });
        mocks.applyReleasePlan.mockResolvedValue(undefined);

        await importCascade();
        await waitFor(() => mocks.assembleReleasePlan.mock.calls.length > 0);
        if (scenario.configRequiresCommitSha) {
          expect(mocks.getCurrentCommitId).toHaveBeenCalled();
        } else {
          expect(mocks.getCurrentCommitId).not.toHaveBeenCalled();
        }
        const assembleArgs = mocks.assembleReleasePlan.mock.calls[0] as unknown as [
          unknown,
          unknown,
          unknown,
          unknown,
          { tag: 'canary'; commit?: string }
        ];
        expect(assembleArgs[4]).toEqual(scenario.expectedSnapshotParams);
      }
    });

    it('should call applyReleasePlan with changelog disabled and the canary tag when snapshot mode is on', async () => {
      process.argv.push('--snapshot');
      const cfg = baseConfig({
        snapshot: { prereleaseTemplate: '0.0.0-{tag}' },
      });
      mocks.readConfig.mockResolvedValue(cfg);
      mocks.readChangesets.mockResolvedValue([
        {
          id: 'r1',
          summary: 'S',
          releases: [{ name: '@sitecore-content-sdk/core', type: 'patch' }],
        },
      ]);
      mocks.getCommitsThatAddFiles.mockResolvedValue([undefined]);
      mocks.getPackages.mockResolvedValue(mkPackages(['@sitecore-content-sdk/core']));
      mocks.getDependentsGraph.mockReturnValue(new Map([['@sitecore-content-sdk/core', []]]));

      await importCascade();
      await waitFor(() => mocks.applyReleasePlan.mock.calls.length > 0);
      expect(mocks.applyReleasePlan).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ changelog: false }),
        'canary'
      );
    });

    it('should apply the same cascade release type to create-content-sdk-app as to other dependents when in snapshot mode', async () => {
      process.argv.push('--snapshot');
      mocks.readConfig.mockResolvedValue(
        baseConfig({ snapshot: { prereleaseTemplate: '0.0.0-{tag}' } })
      );
      mocks.readChangesets.mockResolvedValue([
        {
          id: 'r1',
          summary: 'Major',
          releases: [{ name: '@sitecore-content-sdk/search', type: 'major' }],
        },
      ]);
      mocks.getCommitsThatAddFiles.mockResolvedValue(['3333333']);
      mocks.getPackages.mockResolvedValue(
        mkPackages([
          '@sitecore-content-sdk/search',
          '@sitecore-content-sdk/react',
          'create-content-sdk-app',
        ])
      );
      mocks.getDependentsGraph.mockReturnValue(
        new Map([
          [
            '@sitecore-content-sdk/search',
            ['@sitecore-content-sdk/react', 'create-content-sdk-app'],
          ],
          ['@sitecore-content-sdk/react', []],
          ['create-content-sdk-app', []],
        ])
      );

      await importCascade();
      await waitFor(() => mocks.assembleReleasePlan.mock.calls.length > 0);
      const finalCs = mocks.assembleReleasePlan.mock.calls[0]?.[0] as Array<{
        id: string;
        releases: { name: string; type: string }[];
      }>;
      const synthMajor = finalCs?.filter(
        (c) => c.id.startsWith('cascade-changeset-') && c.releases.some((r) => r.type === 'major')
      );
      expect(
        synthMajor?.some((c) => c.releases.some((r) => r.name === '@sitecore-content-sdk/react'))
      ).toBe(true);
      expect(
        synthMajor?.some((c) => c.releases.some((r) => r.name === 'create-content-sdk-app'))
      ).toBe(true);
    });
  });
});

describe('getTransitiveDependents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should build upon changesets getDependentsGraph result', () => {
    const packages = mkPackages([
      '@sitecore-content-sdk/core',
      '@sitecore-content-sdk/react',
      '@sitecore-content-sdk/nextjs',
    ]) as unknown as Packages;
    mocks.getDependentsGraph.mockReturnValue(
      new Map<string, string[]>([
        ['@sitecore-content-sdk/core', ['@sitecore-content-sdk/react']],
        ['@sitecore-content-sdk/react', ['@sitecore-content-sdk/nextjs']],
        ['@sitecore-content-sdk/nextjs', []],
      ])
    );

    const result = getTransitiveDependents(packages);

    expect(mocks.getDependentsGraph).toHaveBeenCalledWith(packages);
    expect(result.get('@sitecore-content-sdk/core')?.sort()).toEqual([
      '@sitecore-content-sdk/nextjs',
      '@sitecore-content-sdk/react',
    ]);
    expect(result.get('@sitecore-content-sdk/react')).toEqual(['@sitecore-content-sdk/nextjs']);
    expect(result.get('@sitecore-content-sdk/nextjs')).toEqual([]);
  });

  it('should not crash when circular dependencies present', () => {
    mocks.getDependentsGraph.mockReturnValue(
      new Map<string, string[]>([
        ['@sitecore-content-sdk/core', ['@sitecore-content-sdk/react']],
        ['@sitecore-content-sdk/react', ['@sitecore-content-sdk/core']],
      ])
    );
    const packages = mkPackages([
      '@sitecore-content-sdk/core',
      '@sitecore-content-sdk/react',
    ]) as unknown as Packages;

    expect(() => getTransitiveDependents(packages)).not.toThrow();
    const result = getTransitiveDependents(packages);
    // Walking the cycle reaches the other package and, when re-entering the source, adds it to the set.
    expect(result.get('@sitecore-content-sdk/core')?.sort()).toEqual([
      '@sitecore-content-sdk/core',
      '@sitecore-content-sdk/react',
    ]);
    expect(result.get('@sitecore-content-sdk/react')?.sort()).toEqual([
      '@sitecore-content-sdk/core',
      '@sitecore-content-sdk/react',
    ]);
  });
});

describe('getChangesetsWithCommits', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should only return changeset files that were added via commit', async () => {
    mocks.readChangesets.mockResolvedValue([
      {
        id: 'alpha',
        summary: 'A',
        releases: [{ name: '@sitecore-content-sdk/core', type: 'patch' }],
      },
      {
        id: 'beta',
        summary: 'B',
        releases: [{ name: '@sitecore-content-sdk/react', type: 'patch' }],
      },
    ]);
    mocks.getCommitsThatAddFiles.mockResolvedValue([
      'commit111111111111111111111111111111111111',
      undefined,
    ]);

    const out = await getChangesetsWithCommits('/repo');

    expect(mocks.getCommitsThatAddFiles).toHaveBeenCalledWith(
      ['.changeset/alpha.md', '.changeset/beta.md'],
      { cwd: '/repo' }
    );
    expect(out).toHaveLength(2);
    expect(out[0]?.id).toBe('alpha');
    expect(out[0]?.commit).toBe('commit111111111111111111111111111111111111');
    expect(out[1]?.id).toBe('beta');
    expect(out[1]?.commit).toBeUndefined();
  });
});
