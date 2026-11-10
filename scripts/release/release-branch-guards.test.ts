/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  publishVersionsGuard,
  releaseVersionsGuard,
  unreleasableChangesets,
} from './release-branch-guards';
import { SCAFFOLDER } from '../constants';

const mocks = vi.hoisted(() => ({
  getReleasePlan: vi.fn(),
  getPackages: vi.fn(),
  npmView: vi.fn(),
}));

vi.mock('../changesets/cascade-version.ts', () => ({ getReleasePlan: mocks.getReleasePlan }));
vi.mock('@manypkg/get-packages', () => ({ getPackages: mocks.getPackages }));
vi.mock('./utils.ts', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  npmView: mocks.npmView,
}));

const NEXTJS = '@sitecore-content-sdk/nextjs';
const REACT = '@sitecore-content-sdk/react';
const NEW = '@sitecore-content-sdk/new';

describe('releaseVersionsGuard', () => {
  // the release plan of the pending changesets
  const plan = (...releases: { name: string; newVersion: string; type?: string }[]) =>
    mocks.getReleasePlan.mockResolvedValue({
      releases: releases.map((r) => ({ type: 'patch', ...r })),
    });
  // npm latest by package; missing: never published
  const npmLatest = (latest: Record<string, string | undefined>) =>
    mocks.npmView.mockImplementation((name: string) => latest[name]);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    npmLatest({ [NEXTJS]: '2.4.0', [REACT]: '2.4.0' });
  });

  it('passes without pending changesets, without asking npm', async () => {
    plan();
    await expect(releaseVersionsGuard()).resolves.toBeUndefined();
    expect(mocks.npmView).not.toHaveBeenCalled();
  });

  it('passes when every planned version is above npm latest', async () => {
    plan({ name: NEXTJS, newVersion: '2.4.1' }, { name: REACT, newVersion: '2.5.0' });
    await expect(releaseVersionsGuard()).resolves.toBeUndefined();
  });

  it('passes the first publish of a package, and a package without a latest tag', async () => {
    npmLatest({ [REACT]: undefined });
    plan({ name: NEW, newVersion: '0.1.0' }, { name: REACT, newVersion: '1.0.0' });
    await expect(releaseVersionsGuard()).resolves.toBeUndefined();
  });

  it('fails on a version equal to npm latest (dev published it; publish would skip it)', async () => {
    plan({ name: NEXTJS, newVersion: '2.4.0' });
    await expect(releaseVersionsGuard()).rejects.toThrow(
      /Unsafe release versions:\n {2}- Planned @sitecore-content-sdk\/nextjs@2\.4\.0 version bump is lower or equal/
    );
  });

  it('fails on a version lower than npm latest (publish would move latest back)', async () => {
    npmLatest({ [NEXTJS]: '2.5.0' });
    plan({ name: NEXTJS, newVersion: '2.4.1' });
    await expect(releaseVersionsGuard()).rejects.toThrow(/nextjs@2\.4\.1 version bump is lower/);
  });

  it('lists every unsafe version, and only those, with the redo hint', async () => {
    plan(
      { name: NEXTJS, newVersion: '2.4.0' },
      { name: REACT, newVersion: '2.3.9' },
      { name: NEW, newVersion: '0.1.0' }
    );
    const error = await releaseVersionsGuard().catch((e: Error) => e);
    expect(error).toBeInstanceOf(Error);
    const { message } = error as Error;
    expect(message.match(/^ {2}- /gm)).toHaveLength(2);
    expect(message).toContain('nextjs@2.4.0');
    expect(message).toContain('react@2.3.9');
    expect(message).not.toContain('new@0.1.0');
    expect(message).toMatch(/Redo this release on top of release\/latest/);
  });

  it('compares prereleases (pre mode) as semver does', async () => {
    // a next-major prerelease is above latest
    plan({ name: NEXTJS, newVersion: '3.0.0-beta.0' });
    await expect(releaseVersionsGuard()).resolves.toBeUndefined();
    // a prerelease of the latest version sorts below it
    plan({ name: NEXTJS, newVersion: '2.4.0-beta.0' });
    await expect(releaseVersionsGuard()).rejects.toThrow(/nextjs@2\.4\.0-beta\.0/);
  });

  it("ignores releases of type 'none'", async () => {
    plan({ name: NEXTJS, newVersion: '2.4.0', type: 'none' });
    await expect(releaseVersionsGuard()).resolves.toBeUndefined();
    expect(mocks.npmView).not.toHaveBeenCalled();
  });
});

describe('publishVersionsGuard', () => {
  // workspace packages: [name, version, private?]
  const workspace = (...packages: [string, string, boolean?][]) =>
    mocks.getPackages.mockResolvedValue({
      packages: packages.map(([name, version, isPrivate]) => ({
        packageJson: { name, version, private: isPrivate },
      })),
    });
  // npm state: latest by package, and the versions it has
  const npm = (latest: Record<string, string>, published: string[] = []) =>
    mocks.npmView.mockImplementation((spec: string, field: string) =>
      field === 'dist-tags.latest' ? latest[spec] : published.includes(spec) ? '1' : undefined
    );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  it('passes versions above npm latest, and first publishes', async () => {
    workspace([NEXTJS, '2.5.0'], [NEW, '0.1.0']);
    npm({ [NEXTJS]: '2.4.0' });
    await expect(publishVersionsGuard()).resolves.toBeUndefined();
  });

  it('passes versions on npm already: latest itself (a re-run) or an older release', async () => {
    workspace([NEXTJS, '2.4.0'], [REACT, '2.3.0']);
    npm({ [NEXTJS]: '2.4.0', [REACT]: '2.4.0' }, [`${REACT}@2.3.0`]);
    await expect(publishVersionsGuard()).resolves.toBeUndefined();
  });

  it('fails on an unpublished version below npm latest (would move latest back)', async () => {
    workspace([NEXTJS, '2.4.1'], [REACT, '2.6.0']);
    npm({ [NEXTJS]: '2.5.0', [REACT]: '2.5.0' });
    const error = await publishVersionsGuard().catch((e: Error) => e);
    expect(error).toBeInstanceOf(Error);
    const { message } = error as Error;
    expect(message).toMatch(/^Publishing would move npm latest back:\n {2}- /);
    expect(message).toContain(`${NEXTJS}@2.4.1 is below npm latest (2.5.0)`);
    expect(message).not.toContain(REACT);
  });

  it('skips private packages', async () => {
    workspace([NEXTJS, '2.4.1', true]);
    npm({ [NEXTJS]: '2.5.0' });
    await expect(publishVersionsGuard()).resolves.toBeUndefined();
    expect(mocks.npmView).not.toHaveBeenCalled();
  });
});

const CORE = '@sitecore-content-sdk/core';

describe('unreleasableChangesets', () => {
  const workspace = new Set([NEXTJS, REACT, SCAFFOLDER]);
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
