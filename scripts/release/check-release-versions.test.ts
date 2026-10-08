/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { type ReleaseCandidate, versionProblem } from './check-release-versions';

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
        candidate({ npm: { versions: ['2.4.0', '2.4.1'], latest: '2.4.1' }, taggedOnThisLine: true })
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
