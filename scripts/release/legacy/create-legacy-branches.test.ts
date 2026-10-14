/* eslint-disable jsdoc/require-jsdoc */
import path from 'path';
import { describe, it, expect } from 'vitest';
import {
  getMajorPublishedProducts,
  getProductPackages,
  legacyPrunedDirs,
} from './create-legacy-branches';
import { SCAFFOLDER } from '../../constants';

const NEXTJS = '@sitecore-content-sdk/nextjs';
const ANGULAR = '@sitecore-content-sdk/angular';

describe('getMajorPublishedProducts', () => {
  const products = { nextjs: [NEXTJS], angular: [ANGULAR] };
  const majors = (published: { name: string; version: string }[]) =>
    getMajorPublishedProducts(products, published);

  it('picks products whose own package was published as x.0.0', () => {
    expect(
      majors([
        { name: NEXTJS, version: '3.0.0' },
        { name: ANGULAR, version: '1.1.0' },
      ])
    ).toEqual(['nextjs']);
    expect(
      majors([
        { name: NEXTJS, version: '3.0.0' },
        { name: ANGULAR, version: '2.0.0' },
      ])
    ).toEqual(['nextjs', 'angular']);
  });

  it('ignores minors, patches, prereleases, 0.0.0 and non-product packages', () => {
    expect(majors([{ name: NEXTJS, version: '3.1.0' }])).toEqual([]);
    expect(majors([{ name: NEXTJS, version: '3.0.1' }])).toEqual([]);
    expect(majors([{ name: NEXTJS, version: '3.0.0-beta.0' }])).toEqual([]);
    expect(majors([{ name: NEXTJS, version: '0.0.0' }])).toEqual([]);
    expect(majors([{ name: '@sitecore-content-sdk/core', version: '3.0.0' }])).toEqual([]);
  });
});

describe('getProductPackages', () => {
  const products = { nextjs: [NEXTJS, '@sitecore-content-sdk/react'] };

  it("lists the product's packages and the scaffolder", () => {
    expect(getProductPackages(products, 'nextjs')).toEqual([
      NEXTJS,
      '@sitecore-content-sdk/react',
      SCAFFOLDER,
    ]);
  });

  it('throws on a product missing from products.json', () => {
    expect(() => getProductPackages(products, 'vue')).toThrow(/"vue" is not defined/);
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
    pkg(NEXTJS, 'packages', 'nextjs'),
    pkg('@sitecore-content-sdk/react', 'packages', 'react'),
    pkg(ANGULAR, 'packages', 'angular'),
    pkg('@sitecore-content-sdk/nextjs-templates', 'templates', 'nextjs'),
    pkg('@sitecore-content-sdk/angular-templates', 'templates', 'angular'),
    pkg(SCAFFOLDER, 'packages', 'create-content-sdk-app'),
  ];
  const products = {
    nextjs: [NEXTJS, '@sitecore-content-sdk/react', '@sitecore-content-sdk/nextjs-templates'],
    angular: [ANGULAR, '@sitecore-content-sdk/angular-templates'],
  };

  it("keeps the product's packages and the scaffolder, drops everything else", () => {
    expect(legacyPrunedDirs(packages, root, getProductPackages(products, 'nextjs'))).toEqual([
      'packages/core',
      'packages/content',
      'packages/angular',
      'templates/angular',
    ]);
    expect(legacyPrunedDirs(packages, root, getProductPackages(products, 'angular'))).toEqual([
      'packages/core',
      'packages/content',
      'packages/nextjs',
      'packages/react',
      'templates/nextjs',
    ]);
  });
});
