/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { unreleasableChangesets } from './legacy-changesets-guard';

const CORE = '@sitecore-content-sdk/core';
const NEXTJS = '@sitecore-content-sdk/nextjs';

describe('unreleasableChangesets', () => {
  const workspace = new Set([NEXTJS, '@sitecore-content-sdk/react', 'create-content-sdk-app']);
  const ignore = ['create-content-sdk-app'];
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
    const [problem] = unreleasableChangesets(
      [cs('b', 'create-content-sdk-app')],
      workspace,
      ignore
    );
    expect(problem).toMatch(/never publishes; the changeset would stay pending/);
  });

  it('reports every problem across changesets', () => {
    const problems = unreleasableChangesets(
      [cs('a', CORE), cs('b', NEXTJS), cs('c', 'create-content-sdk-app')],
      workspace,
      ignore
    );
    expect(problems).toHaveLength(2);
  });
});
