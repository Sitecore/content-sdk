/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  ATOMS_CSS_CACHE_MAX_ENTRIES,
  atomsCssCacheKey,
  setAtomsCssCacheEntry,
} from './css-cache';

describe('atoms CSS cache helpers', () => {
  it('atomsCssCacheKey sorts tokens for stable keys', () => {
    expect(atomsCssCacheKey(['b', 'a'])).to.equal('a b');
    expect(atomsCssCacheKey(['a', 'b'])).to.equal('a b');
  });

  it('setAtomsCssCacheEntry evicts the oldest entry when over capacity', () => {
    const cache = new Map<string, string>();
    setAtomsCssCacheEntry(cache, 'one', '1', 2);
    setAtomsCssCacheEntry(cache, 'two', '2', 2);
    setAtomsCssCacheEntry(cache, 'three', '3', 2);

    expect(cache.size).to.equal(2);
    expect(cache.has('one')).to.be.false;
    expect(cache.get('two')).to.equal('2');
    expect(cache.get('three')).to.equal('3');
  });

  it('exposes a positive default max cache size', () => {
    expect(ATOMS_CSS_CACHE_MAX_ENTRIES).to.be.greaterThan(0);
  });
});
