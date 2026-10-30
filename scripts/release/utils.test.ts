/* eslint-disable jsdoc/require-jsdoc */
import path from 'path';
import { describe, it, expect } from 'vitest';
import { branchPrefix, packageDirs } from './utils';

const NEXTJS = '@sitecore-content-sdk/nextjs';
describe('branchPrefix', () => {
  it('takes release/<name> from release branches and the whole name otherwise', () => {
    expect(branchPrefix('release/latest')).toBe('release/latest');
    expect(branchPrefix('release/legacy/nextjs/v2')).toBe('release/legacy');
    expect(branchPrefix('release/1.x.x')).toBe('release/1.x.x');
    expect(branchPrefix('dev')).toBe('dev');
    expect(branchPrefix('feature/x')).toBe('feature/x');
  });
});

describe('packageDirs', () => {
  const root = path.resolve('/repo');
  const packages = [
    { dir: path.join(root, 'packages', 'nextjs'), packageJson: { name: NEXTJS } },
    {
      dir: path.join(root, 'templates', 'nextjs'),
      packageJson: { name: '@sitecore-content-sdk/nextjs-templates' },
    },
  ];

  it('maps packages to repo-relative, forward-slash directories', () => {
    expect(packageDirs(packages, root, [NEXTJS, '@sitecore-content-sdk/nextjs-templates'])).toEqual(
      ['packages/nextjs', 'templates/nextjs']
    );
  });

  it('throws on a package that is not in the workspace', () => {
    expect(() => packageDirs(packages, root, ['@sitecore-content-sdk/nope'])).toThrow(
      /@sitecore-content-sdk\/nope is not in the workspace/
    );
  });
});
