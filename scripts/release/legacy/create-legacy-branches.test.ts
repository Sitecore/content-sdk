/* eslint-disable jsdoc/require-jsdoc */
import path from 'path';
import { describe, it, expect } from 'vitest';
import {
  latestLegacyBranches,
  npmResolvedSdkDeps,
  legacyBranch,
  planLegacyBranches,
  legacyPrunedDirs,
} from './create-legacy-branches';
import { SCAFFOLDER } from '../../constants';

describe('legacyBranch', () => {
  it('builds the release/legacy/<slug>/v<major> path', () => {
    expect(legacyBranch('nextjs', 2)).toBe('release/legacy/nextjs/v2');
  });
});

describe('planLegacyBranches', () => {
  const products = {
    nextjs: ['@sitecore-content-sdk/nextjs'],
    angular: ['@sitecore-content-sdk/angular'],
  };
  const NEXTJS = '@sitecore-content-sdk/nextjs';
  const ANGULAR = '@sitecore-content-sdk/angular';
  const onLatest = new Map([
    [NEXTJS, '2.4.1'],
    [ANGULAR, '1.0.1'],
  ]);
  const needs = (published: { name: string; version: string }[], latest = onLatest) =>
    planLegacyBranches(products, published, latest);

  it("picks a product published with a major above release/latest's, keeping that major", () => {
    expect(needs([{ name: NEXTJS, version: '3.0.0' }])).toEqual([
      { slug: 'nextjs', branch: 'release/legacy/nextjs/v2', versionOnLatest: '2.4.1' },
    ]);
    // a release that skips majors still keeps the one on release/latest
    expect(needs([{ name: ANGULAR, version: '3.0.0' }])).toMatchObject([
      { branch: 'release/legacy/angular/v1' },
    ]);
  });

  it('returns nothing without a product major', () => {
    expect(needs([{ name: NEXTJS, version: '2.5.0' }])).toEqual([]);
    expect(needs([{ name: '@sitecore-content-sdk/core', version: '3.0.0' }])).toEqual([]);
    // a re-run after release/latest already moved to the release
    expect(needs([{ name: NEXTJS, version: '3.0.0' }], new Map([[NEXTJS, '3.0.0']]))).toEqual([]);
  });

  it('returns nothing for a product not on release/latest yet', () => {
    expect(needs([{ name: NEXTJS, version: '3.0.0' }], new Map())).toEqual([]);
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
    pkg(SCAFFOLDER, 'packages', 'create-content-sdk-app'),
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

describe('refresh helpers', () => {
  const NEXTJS = '@sitecore-content-sdk/nextjs';
  const REACT = '@sitecore-content-sdk/react';

  describe('npmResolvedSdkDeps', () => {
    it('lists Content SDK dependencies that are not workspace packages', () => {
      const packages = [
        {
          packageJson: {
            name: NEXTJS,
            dependencies: {
              '@sitecore-content-sdk/core': '^2.1.4',
              [REACT]: '^2.4.0',
              debug: '^4.4.0',
            },
            devDependencies: { '@sitecore-content-sdk/personalize': '^2.1.0' },
            peerDependencies: { '@sitecore-content-sdk/events': '^2.1.2' },
          },
        },
        {
          packageJson: {
            name: REACT,
            dependencies: {
              '@sitecore-content-sdk/core': '^2.1.4',
              '@sitecore-content-sdk/search': '^0.5.0',
            },
          },
        },
        { packageJson: { name: 'create-content-sdk-app', dependencies: { [NEXTJS]: '^2.4.0' } } },
      ];
      expect(npmResolvedSdkDeps(packages)).toEqual([
        '@sitecore-content-sdk/core',
        '@sitecore-content-sdk/events',
        '@sitecore-content-sdk/personalize',
        '@sitecore-content-sdk/search',
      ]);
    });

    it('returns nothing when every Content SDK dependency is in the workspace', () => {
      expect(
        npmResolvedSdkDeps([
          { packageJson: { name: NEXTJS, dependencies: { [REACT]: '^2.4.0' } } },
          { packageJson: { name: REACT } },
        ])
      ).toEqual([]);
    });
  });

  describe('latestLegacyBranches', () => {
    it("keeps each product's highest v<N> branch", () => {
      expect(
        latestLegacyBranches([
          'release/legacy/nextjs/v2',
          'release/legacy/nextjs/v10',
          'release/legacy/angular/v1',
          'release/legacy/nextjs/v9',
          'release/legacy/nextjs/notes',
        ])
      ).toEqual(['release/legacy/angular/v1', 'release/legacy/nextjs/v10']);
    });

    it('returns nothing without legacy branches', () => {
      expect(latestLegacyBranches([])).toEqual([]);
    });
  });
});
