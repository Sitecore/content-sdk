/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi } from 'vitest';
import {
  guardsFor,
  pendingChangesets,
  type ReleaseCandidate,
  unreleasableChangesets,
  versionProblem,
} from './release-branch-guards';
import { SCAFFOLDER } from '../constants';

const mocks = vi.hoisted(() => ({
  readChangesets: vi.fn(),
  readPreState: vi.fn(),
}));

vi.mock('@changesets/read', () => ({ readChangesets: mocks.readChangesets }));
vi.mock('@changesets/pre', () => ({ readPreState: mocks.readPreState }));

const NEXTJS = '@sitecore-content-sdk/nextjs';
const candidate = (overrides: Partial<ReleaseCandidate>): ReleaseCandidate => ({
  name: NEXTJS,
  version: '2.4.1',
  npm: { versions: ['2.4.0'], latest: '2.4.0' },
  taggedOnThisBranch: false,
  ...overrides,
});

describe('versionProblem', () => {
  it('allows a new version above npm latest', () => {
    expect(versionProblem(candidate({}))).toBeNull();
  });

  it('allows the first publish of a package', () => {
    expect(versionProblem(candidate({ npm: null }))).toBeNull();
  });

  it('flags a version another release branch already published (silent skip)', () => {
    const problem = versionProblem(
      candidate({ npm: { versions: ['2.4.0', '2.4.1'], latest: '2.4.1' } })
    );
    expect(problem).toMatch(/already on npm.*skip it silently/);
  });

  it('allows a version this branch already published (re-run after a partial publish)', () => {
    expect(
      versionProblem(
        candidate({
          npm: { versions: ['2.4.0', '2.4.1'], latest: '2.4.1' },
          taggedOnThisBranch: true,
        })
      )
    ).toBeNull();
  });

  it('flags a version lower than npm latest (would move latest back)', () => {
    const problem = versionProblem(
      candidate({ npm: { versions: ['2.4.0', '2.5.0'], latest: '2.5.0' } })
    );
    expect(problem).toMatch(/lower than npm latest 2\.5\.0.*move latest back/);
  });

  it('checks the collision before the regression', () => {
    const problem = versionProblem(
      candidate({ npm: { versions: ['2.4.1', '2.5.0'], latest: '2.5.0' } })
    );
    expect(problem).toMatch(/already on npm/);
  });
});

describe('pendingChangesets', () => {
  const changesets = [{ id: 'a' }, { id: 'b' }];
  const pre = (mode: 'pre' | 'exit') => ({
    mode,
    tag: 'beta',
    initialVersions: {},
    changesets: ['a'],
  });

  it('lists every changeset outside pre mode', async () => {
    mocks.readChangesets.mockResolvedValue(changesets);
    mocks.readPreState.mockResolvedValue(undefined);
    expect(await pendingChangesets('/repo')).toEqual(['a', 'b']);
  });

  it('is empty once the release PR consumed the changesets', async () => {
    mocks.readChangesets.mockResolvedValue([]);
    mocks.readPreState.mockResolvedValue(undefined);
    expect(await pendingChangesets('/repo')).toEqual([]);
  });

  it('skips changesets already versioned in pre mode, as changesets/action does', async () => {
    mocks.readChangesets.mockResolvedValue(changesets);
    mocks.readPreState.mockResolvedValue(pre('pre'));
    expect(await pendingChangesets('/repo')).toEqual(['b']);
  });

  it('counts every changeset when exiting pre mode', async () => {
    mocks.readChangesets.mockResolvedValue(changesets);
    mocks.readPreState.mockResolvedValue(pre('exit'));
    expect(await pendingChangesets('/repo')).toEqual(['a', 'b']);
  });
});

const CORE = '@sitecore-content-sdk/core';

describe('unreleasableChangesets', () => {
  const workspace = new Set([NEXTJS, '@sitecore-content-sdk/react', SCAFFOLDER]);
  const ignore = [SCAFFOLDER];
  const cs = (id: string, name: string) => ({ id, releases: [{ name, type: 'patch' }] });

  it("allows changesets for the product's packages", () => {
    expect(unreleasableChangesets([cs('a', NEXTJS)], workspace, ignore)).toEqual([]);
  });

  it('rejects a changeset for a package that resolves from npm', () => {
    const [problem] = unreleasableChangesets([cs('a', CORE)], workspace, ignore);
    expect(problem).toMatch(
      /\.changeset\/a\.md names @sitecore-content-sdk\/core, which is not on this legacy branch/
    );
  });

  it('rejects a changeset for the ignored scaffolder', () => {
    const [problem] = unreleasableChangesets([cs('b', SCAFFOLDER)], workspace, ignore);
    expect(problem).toMatch(/never publishes; the changeset would stay pending/);
  });

  it('reports every problem across changesets', () => {
    const problems = unreleasableChangesets(
      [cs('a', CORE), cs('b', NEXTJS), cs('c', SCAFFOLDER)],
      workspace,
      ignore
    );
    expect(problems).toHaveLength(2);
  });
});

describe('guardsFor', () => {
  const names = (branch: string) => guardsFor(branch).map((guard) => guard.name);

  it('runs the release versions guard on limited and hotfix branches', () => {
    expect(names('release/limited/nextjs-20261013120000')).toEqual(['releaseVersionsGuard']);
    expect(names('release/hotfix/20261013120000')).toEqual(['releaseVersionsGuard']);
  });

  it('runs the legacy changesets guard on legacy branches', () => {
    expect(names('release/legacy/nextjs/v2')).toEqual(['legacyChangesetsGuard']);
  });

  it('runs nothing for the full and the other release types', () => {
    for (const branch of ['dev', 'release/1.x.x', 'release/betas/x', 'release/other']) {
      expect(names(branch)).toEqual([]);
    }
  });
});
