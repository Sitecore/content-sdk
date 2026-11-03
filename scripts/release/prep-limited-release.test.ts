/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { defaultConfig } from '@changesets/config';
import type { Packages } from '@manypkg/get-packages';
import type { NewChangeset, VersionType } from '@changesets/types';
import { getCascadeReleasePlan } from '../changesets/cascade-version';
import { productExclusions } from './prep-limited-release';
import { readProducts } from '../changesets/utils';
import { SCAFFOLDER } from '../constants';

const cs = (id: string, name: string, type: VersionType = 'minor'): NewChangeset => ({
  id,
  summary: id,
  releases: [{ name, type }],
});

const CCA = SCAFFOLDER;
// as `.changeset/products.config.json`: create-content-sdk-app is in no product (shared)
const PRODUCTS = {
  nextjs: ['nextjs', 'react', 'nextjs-templates'],
  angular: ['angular', 'angular-templates'],
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
    const shared = { nextjs: [...PRODUCTS.nextjs, CCA], angular: [...PRODUCTS.angular, CCA] };
    expect(productExclusions(shared, 'nextjs')).toEqual(['angular', 'angular-templates']);
  });
});

describe('release plan guards (nextjs release)', () => {
  const excluded = ['angular', 'angular-templates'];
  // as prep-limited-release.ts: the plan's releases, and those bumping a left-out package
  const plan = (changesets: NewChangeset[]) => {
    const { releases } = getCascadeReleasePlan(changesets, packages, defaultConfig, undefined);
    const released = releases.filter((r) => r.type !== 'none');
    return {
      releases: released.map((r) => `${r.name} ${r.type}`).sort(),
      problems: released.filter((r) => excluded.includes(r.name)).map((r) => `${r.name} ${r.type}`),
    };
  };

  it('ships a product major with its templates and create-content-sdk-app', () => {
    const { releases, problems } = plan([cs('a', 'nextjs', 'major')]);
    expect(problems).toEqual([]);
    // create-content-sdk-app is released, so changesets moves its nextjs-templates range
    expect(releases).toEqual([`${CCA} patch`, 'nextjs major', 'nextjs-templates major']);
  });

  it('fails a shared major that reaches the other product and its templates', () => {
    expect(plan([cs('a', 'core', 'major')]).problems).toEqual([
      'angular major',
      'angular-templates major',
    ]);
  });

  it("fails a cli major: it cascades into the other product's templates", () => {
    expect(plan([cs('a', 'cli', 'major')]).problems).toEqual(['angular-templates major']);
  });

  it('allows shared minor and patch bumps: in range, the other product is not bumped', () => {
    const { releases, problems } = plan([cs('a', 'core', 'minor'), cs('b', 'core', 'patch')]);
    expect(problems).toEqual([]);
    expect(releases).toEqual(['core minor']);
  });

  it('finds nothing to release without changesets', () => {
    expect(plan([]).releases).toEqual([]);
  });
});
