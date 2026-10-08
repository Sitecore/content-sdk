/* eslint-disable jsdoc/require-jsdoc */
import path from 'path';
import { describe, it, expect } from 'vitest';
import { describePublished, publishedPackageDirs } from './sync-latest-branch';

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
      publishedPackageDirs(packages, root, [{ name: '@sitecore-content-sdk/nope', version: '1.0.0' }])
    ).toThrow(/@sitecore-content-sdk\/nope is not in the workspace/);
  });
});

describe('describePublished', () => {
  it('lists name@version pairs', () => {
    expect(
      describePublished([
        { name: '@sitecore-content-sdk/core', version: '2.1.5' },
        { name: '@sitecore-content-sdk/nextjs', version: '2.5.0' },
      ])
    ).toBe('@sitecore-content-sdk/core@2.1.5, @sitecore-content-sdk/nextjs@2.5.0');
  });
});
