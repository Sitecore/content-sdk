/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { defaultConfig } from '@changesets/config';
import type { Packages } from '@manypkg/get-packages';
import type { NewChangeset, VersionType } from '@changesets/types';
import { getCascadeReleasePlan } from '../changesets/cascade-version';
import {
  excludedChangesets,
  limitedReleases,
  productExclusions,
  releasePlanProblems,
} from './prep-limited-release';
import { readProducts } from '../changesets/utils';
import { SCAFFOLDER } from '../constants';

const cs = (id: string, name: string, type: VersionType = 'minor'): NewChangeset => ({
  id,
  summary: id,
  releases: [{ name, type }],
});

const CCA = SCAFFOLDER;
const PRODUCTS = {
  nextjs: ['nextjs', 'react', 'nextjs-templates', CCA],
  angular: ['angular', 'angular-templates', CCA],
};

// the templates-split structure: create-content-sdk-app depends on both templates packages at
// runtime; each templates package depends on its product (and cli) only as a devDependency
const pkg = (
  name: string,
  deps: Record<string, string> = {},
  devDeps: Record<string, string> = {},
  peerDeps: Record<string, string> = {}
) => ({
  dir: `/repo/${name}`,
  packageJson: {
    name,
    version: '1.0.0',
    dependencies: deps,
    devDependencies: devDeps,
    peerDependencies: peerDeps,
  },
});
const packages = {
  rootDir: '/repo',
  rootPackage: { dir: '/repo', packageJson: { name: 'root', version: '0.0.0' } },
  packages: [
    pkg('core'),
    pkg('react', { core: '^1.0.0' }),
    pkg('nextjs', { core: '^1.0.0', react: '^1.0.0' }),
    pkg('angular', { core: '^1.0.0' }),
    pkg('cli'),
    pkg('nextjs-templates', {}, { nextjs: '^1.0.0', cli: '^1.0.0' }, { cli: '^1.0.0' }),
    pkg('angular-templates', {}, { angular: '^1.0.0', cli: '^1.0.0' }, { cli: '^1.0.0' }),
    pkg(
      CCA,
      { 'nextjs-templates': '^1.0.0', 'angular-templates': '^1.0.0' },
      {},
      { cli: '^1.0.0' }
    ),
  ],
} as unknown as Packages;

describe('.changeset/products.config.json', () => {
  it('defines the nextjs and angular products', () => {
    expect(Object.keys(readProducts(process.cwd())).sort()).toEqual(['angular', 'nextjs']);
  });
});

describe('productExclusions', () => {
  it("leaves out the other products' packages, except those the product lists too", () => {
    expect(productExclusions(PRODUCTS, 'nextjs')).toEqual(['angular', 'angular-templates']);
    expect(productExclusions(PRODUCTS, 'angular')).toEqual(['nextjs', 'react', 'nextjs-templates']);
  });
});

describe('excludedChangesets', () => {
  it('selects changesets naming a left-out package', () => {
    const changesets = [
      cs('a', 'angular'),
      cs('b', 'angular-templates'),
      cs('c', 'nextjs'),
      cs('d', CCA),
    ];
    expect(
      excludedChangesets(changesets, ['angular', 'angular-templates']).map((c) => c.id)
    ).toEqual(['a', 'b']);
  });
});

describe('release plan guards (nextjs release)', () => {
  const excluded = ['angular', 'angular-templates'];
  const plan = (changesets: NewChangeset[]) =>
    getCascadeReleasePlan(changesets, packages, defaultConfig, undefined);
  const names = (releases: { name: string; type: string }[]) =>
    releases.map((r) => `${r.name} ${r.type}`).sort();

  it('ships a product major with its templates and create-content-sdk-app (P24)', () => {
    const releasePlan = plan([cs('a', 'nextjs', 'major')]);
    expect(releasePlanProblems(releasePlan, excluded)).toEqual([]);
    // create-content-sdk-app is released, so changesets moves its nextjs-templates range
    expect(names(limitedReleases(releasePlan, excluded))).toEqual([
      `${CCA} patch`,
      'nextjs major',
      'nextjs-templates major',
    ]);
  });

  it('fails a shared major that reaches the other product and its templates', () => {
    expect(releasePlanProblems(plan([cs('a', 'core', 'major')]), excluded)).toEqual([
      expect.stringMatching(/^angular gets a major .* unreleased code/),
      expect.stringMatching(/^angular-templates gets a major .* unreleased code/),
    ]);
  });

  it("fails a cli major: it cascades into the other product's templates", () => {
    expect(releasePlanProblems(plan([cs('a', 'cli', 'major')]), excluded)).toEqual([
      expect.stringMatching(/^angular-templates gets a major/),
    ]);
  });

  it('allows shared minor and patch bumps: in range, the other product is not bumped', () => {
    const releasePlan = plan([cs('a', 'core', 'minor'), cs('b', 'core', 'patch')]);
    expect(releasePlanProblems(releasePlan, excluded)).toEqual([]);
    expect(names(limitedReleases(releasePlan, excluded))).toEqual(['core minor']);
  });

  it('finds nothing to release when only left-out packages change', () => {
    expect(limitedReleases(plan([]), excluded)).toEqual([]);
  });
});
