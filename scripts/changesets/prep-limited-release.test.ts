/* eslint-disable jsdoc/require-jsdoc */
import { readFileSync } from 'fs';
import { describe, it, expect } from 'vitest';
import { validateConfig } from '@changesets/config';
import { getPackages } from '@manypkg/get-packages';
import {
  ignoredChangesets,
  productIgnore,
  propagatingMajors,
  readProducts,
} from './prep-limited-release';

const cs = (id: string, name: string, type = 'minor') => ({ id, releases: [{ name, type }] });

const PRODUCTS = {
  nextjs: ['@sitecore-content-sdk/nextjs', '@sitecore-content-sdk/react'],
  angular: ['@sitecore-content-sdk/angular'],
};

describe('.changeset/products.json', () => {
  const products = readProducts(process.cwd());

  it('defines the nextjs and angular products', () => {
    expect(Object.keys(products).sort()).toEqual(['angular', 'nextjs']);
  });

  it.each(Object.keys(products))(
    'gives a %s ignore list that passes changesets config validation for the real workspace',
    async (product) => {
      const packages = await getPackages(process.cwd());
      const config = JSON.parse(readFileSync('.changeset/config.json', 'utf8'));
      const { errors } = validateConfig(
        { ...config, ignore: productIgnore(products, product) },
        packages
      );
      expect(errors).toBeUndefined();
    }
  );
});

describe('productIgnore', () => {
  it("ignores every other product's packages", () => {
    expect(productIgnore(PRODUCTS, 'nextjs')).toEqual(['@sitecore-content-sdk/angular']);
    expect(productIgnore(PRODUCTS, 'angular')).toEqual([
      '@sitecore-content-sdk/nextjs',
      '@sitecore-content-sdk/react',
    ]);
  });
});

describe('propagatingMajors', () => {
  const dependents = new Map<string, string[]>([
    ['core', ['content', 'nextjs', 'angular']],
    ['react', ['nextjs']],
    ['nextjs', []],
    ['cli', []],
  ]);
  const nextjsPackages = ['nextjs', 'react'];

  it('flags a major in a shared package with dependents', () => {
    expect(propagatingMajors([cs('a', 'core', 'major')], nextjsPackages, dependents)).toHaveLength(1);
  });

  it("allows majors in the product's own packages, even when they have dependents", () => {
    expect(propagatingMajors([cs('a', 'react', 'major')], nextjsPackages, dependents)).toEqual([]);
  });

  it('allows a major that does not propagate (no dependents)', () => {
    expect(propagatingMajors([cs('a', 'cli', 'major')], nextjsPackages, dependents)).toEqual([]);
  });

  it('ignores minor and patch bumps of shared packages', () => {
    const changesets = [cs('a', 'core', 'minor'), cs('b', 'core', 'patch')];
    expect(propagatingMajors(changesets, nextjsPackages, dependents)).toEqual([]);
  });
});

describe('ignoredChangesets', () => {
  it('selects changesets naming an ignored package', () => {
    const changesets = [cs('a', 'angular'), cs('b', 'nextjs'), cs('c', 'core')];
    expect(ignoredChangesets(changesets, ['angular']).map((c) => c.id)).toEqual(['a']);
  });
});
