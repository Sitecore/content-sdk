/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi } from 'vitest';
import { pendingChangesets, type ReleaseCandidate, versionProblem } from './release-versions-guard';

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
  taggedOnThisLine: false,
  ...overrides,
});

describe('versionProblem', () => {
  it('allows a new version above npm latest', () => {
    expect(versionProblem(candidate({}))).toBeNull();
  });

  it('allows the first publish of a package', () => {
    expect(versionProblem(candidate({ npm: null }))).toBeNull();
  });

  it('flags a version another line already published (silent skip)', () => {
    const problem = versionProblem(
      candidate({ npm: { versions: ['2.4.0', '2.4.1'], latest: '2.4.1' } })
    );
    expect(problem).toMatch(/already on npm.*skip it silently/);
  });

  it('allows a version this line already published (re-run after a partial publish)', () => {
    expect(
      versionProblem(
        candidate({
          npm: { versions: ['2.4.0', '2.4.1'], latest: '2.4.1' },
          taggedOnThisLine: true,
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
