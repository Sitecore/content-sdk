/* eslint-disable jsdoc/require-jsdoc */
import { readFileSync } from 'fs';
import { describe, it, expect } from 'vitest';
import { defaultConfig, validateConfig } from '@changesets/config';
import { getPackages, Packages } from '@manypkg/get-packages';
import type { NewChangeset, VersionType } from '@changesets/types';
import { getCascadeReleasePlan } from '../changesets/cascade-version';
import {
  excludedChangesets,
  limitedReleases,
  productExclusions,
  releasePlanProblems,
  splitExclusions,
} from './prep-limited-release';
import { readProducts } from '../changesets/utils';

const cs = (id: string, name: string, type: VersionType = 'minor'): NewChangeset => ({
  id,
  summary: id,
  releases: [{ name, type }],
});

const CCA = 'create-content-sdk-app';
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

describe('.changeset/products.json', () => {
  const products = readProducts(process.cwd());

  it('defines the nextjs and angular products', () => {
    expect(Object.keys(products).sort()).toEqual(['angular', 'nextjs']);
  });

  it.each(Object.keys(products))(
    'gives a %s ignore list that passes changesets config validation for the real workspace',
    async (product) => {
      const workspace = await getPackages(process.cwd());
      const config = JSON.parse(readFileSync('.changeset/config.json', 'utf8'));
      const { ignore } = splitExclusions(productExclusions(products, product), workspace);
      const { errors } = validateConfig({ ...config, ignore }, workspace);
      expect(errors).toBeUndefined();
    }
  );
});

describe('productExclusions', () => {
  it("leaves out the other products' packages, except those the product lists too", () => {
    expect(productExclusions(PRODUCTS, 'nextjs')).toEqual(['angular', 'angular-templates']);
    expect(productExclusions(PRODUCTS, 'angular')).toEqual(['nextjs', 'react', 'nextjs-templates']);
  });
});

describe('splitExclusions', () => {
  it('holds back what a released package depends on at runtime and ignores the rest', () => {
    expect(splitExclusions(['angular', 'angular-templates'], packages)).toEqual({
      ignore: ['angular'],
      heldBack: ['angular-templates'],
    });
    // nextjs depends on react, but nextjs is left out too
    expect(splitExclusions(['nextjs', 'react', 'nextjs-templates'], packages)).toEqual({
      ignore: ['nextjs', 'react'],
      heldBack: ['nextjs-templates'],
    });
  });

  it('gives an ignore list changesets accepts, while ignoring the held-back package would not', () => {
    const { ignore } = splitExclusions(['angular', 'angular-templates'], packages);
    expect(validateConfig({ ...defaultConfig, ignore }, packages).errors).toBeUndefined();
    expect(
      validateConfig({ ...defaultConfig, ignore: ['angular', 'angular-templates'] }, packages)
        .errors
    ).toEqual([
      expect.stringContaining(`"${CCA}" depends on the skipped package "angular-templates"`),
    ]);
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
  const ignore = ['angular'];
  const heldBack = ['angular-templates'];
  const excluded = [...ignore, ...heldBack];
  const plan = (changesets: NewChangeset[]) =>
    getCascadeReleasePlan(changesets, packages, { ...defaultConfig, ignore: [] }, undefined);
  const names = (releases: { name: string; type: string }[]) =>
    releases.map((r) => `${r.name} ${r.type}`).sort();

  it('ships a product major with its templates and create-content-sdk-app (P24)', () => {
    const releasePlan = plan([cs('a', 'nextjs', 'major')]);
    expect(releasePlanProblems(releasePlan, ignore, heldBack)).toEqual([]);
    // create-content-sdk-app is released, so changesets moves its nextjs-templates range
    expect(names(limitedReleases(releasePlan, excluded))).toEqual([
      `${CCA} patch`,
      'nextjs major',
      'nextjs-templates major',
    ]);
  });

  it('fails a shared major that reaches the ignored product and the held-back templates', () => {
    const problems = releasePlanProblems(plan([cs('a', 'core', 'major')]), ignore, heldBack);
    expect(problems).toEqual([
      expect.stringMatching(/^angular gets a major .* the ignore list would drop/),
      expect.stringMatching(/^angular-templates gets a major .* unreleased code/),
    ]);
  });

  it('fails a cli major: it cascades into the held-back templates', () => {
    const problems = releasePlanProblems(plan([cs('a', 'cli', 'major')]), ignore, heldBack);
    expect(problems).toEqual([expect.stringMatching(/^angular-templates gets a major/)]);
  });

  it('allows shared minor and patch bumps and leaves the other product out', () => {
    const releasePlan = plan([cs('a', 'core', 'minor'), cs('b', 'core', 'patch')]);
    expect(releasePlanProblems(releasePlan, ignore, heldBack)).toEqual([]);
    expect(names(limitedReleases(releasePlan, excluded))).toEqual(['core minor']);
  });

  it('finds nothing to release when only left-out packages change', () => {
    expect(limitedReleases(plan([]), excluded)).toEqual([]);
  });
});
