/* eslint-disable jsdoc/require-jsdoc */
import path from 'path';
import { describe, it, expect } from 'vitest';
import {
  legacyBranch,
  planLegacyBranch,
  legacyPrunedDirs,
  withScaffolderIgnored,
} from './create-legacy-branches';

describe('legacyBranch', () => {
  it('builds the release/legacy/<slug>/v<major> path', () => {
    expect(legacyBranch('nextjs', 2)).toBe('release/legacy/nextjs/v2');
  });
});

describe('planLegacyBranch', () => {
  it("creates a branch for release/latest's major on a major bump", () => {
    expect(planLegacyBranch('nextjs', '3.0.0', '2.4.1')).toEqual({
      action: 'create',
      targetBranch: 'release/legacy/nextjs/v2',
      previousMajor: 2,
    });
  });

  it('keeps the major on release/latest when the release skips majors', () => {
    expect(planLegacyBranch('angular', '4.0.0', '2.1.0')).toMatchObject({
      targetBranch: 'release/legacy/angular/v2',
    });
  });

  it('skips when the published version is not a major bump', () => {
    expect(planLegacyBranch('nextjs', '2.5.0', '2.4.0')).toEqual({
      action: 'skip',
      reason: expect.stringContaining('not a major bump'),
    });
    // a re-run after release/latest already moved to the release
    expect(planLegacyBranch('nextjs', '3.0.0', '3.0.0')).toMatchObject({ action: 'skip' });
  });

  it('skips a product not on release/latest yet', () => {
    expect(planLegacyBranch('angular', '1.0.0', undefined)).toEqual({
      action: 'skip',
      reason: expect.stringContaining('no prior release'),
    });
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
    pkg('@sitecore-content-sdk/nextjs', 'packages', 'nextjs'),
    pkg('@sitecore-content-sdk/react', 'packages', 'react'),
    pkg('@sitecore-content-sdk/angular', 'packages', 'angular'),
    pkg('@sitecore-content-sdk/nextjs-templates', 'templates', 'nextjs'),
    pkg('@sitecore-content-sdk/angular-templates', 'templates', 'angular'),
    pkg('create-content-sdk-app', 'packages', 'create-content-sdk-app'),
  ];
  const products = {
    nextjs: [
      '@sitecore-content-sdk/nextjs',
      '@sitecore-content-sdk/react',
      '@sitecore-content-sdk/nextjs-templates',
    ],
    angular: ['@sitecore-content-sdk/angular', '@sitecore-content-sdk/angular-templates'],
  };

  it("keeps the product's packages and the scaffolder, drops everything else", () => {
    expect(legacyPrunedDirs(packages, root, products, 'nextjs')).toEqual([
      'packages/core',
      'packages/content',
      'packages/angular',
      'templates/angular',
    ]);
    expect(legacyPrunedDirs(packages, root, products, 'angular')).toEqual([
      'packages/core',
      'packages/content',
      'packages/nextjs',
      'packages/react',
      'templates/nextjs',
    ]);
  });

  it('throws on a product missing from products.json', () => {
    expect(() => legacyPrunedDirs(packages, root, products, 'vue')).toThrow(/"vue" is not defined/);
  });
});

describe('withScaffolderIgnored', () => {
  it('adds create-content-sdk-app to the ignore list', () => {
    expect(withScaffolderIgnored({ access: 'public', ignore: ['x'] })).toEqual({
      access: 'public',
      ignore: ['x', 'create-content-sdk-app'],
    });
    expect(withScaffolderIgnored({ access: 'public' })).toEqual({
      access: 'public',
      ignore: ['create-content-sdk-app'],
    });
  });

  it('leaves a config that already ignores it unchanged', () => {
    const config = { ignore: ['create-content-sdk-app'] };
    expect(withScaffolderIgnored(config)).toBe(config);
  });
});
