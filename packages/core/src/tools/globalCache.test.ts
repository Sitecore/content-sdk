import { expect } from 'chai';
import { getCacheAndClean, setCache, getCache, hasCache } from './globalCache';

describe('globalCache utility', () => {
  afterEach(() => {
    delete globalThis.__dlCache;
  });

  it('should set and get cache value if cache not initialized', () => {
    setCache('testKey', 'testValue');
    expect(getCache('testKey')).to.equal('testValue');
  });

  it('should set and get cache value', () => {
    globalThis.__dlCache = {};
    setCache('testKey', 'testValue');
    setCache('testKeySecond', 'testValueSecond');
    expect(getCache('testKey')).to.equal('testValue');
    expect(getCache('testKeySecond')).to.equal('testValueSecond');
  });

  it('should remove cache value after getCacheAndClean', () => {
    setCache('cleanKey', 'cleanValue');
    expect(getCacheAndClean('cleanKey')).to.equal('cleanValue');
    expect(getCache('cleanKey')).to.equal(undefined);
  });

  it('should return undefined for missing key', () => {
    expect(getCache('missingKey')).to.equal(undefined);
    expect(getCacheAndClean('missingKey')).to.equal(undefined);
  });

  it('should check existence of cache key', () => {
    setCache('existsKey', 123);
    expect(hasCache('existsKey')).to.equal(true);
    expect(hasCache('notExistsKey')).to.equal(false);
  });

  it('should overwrite existing cache value', () => {
    setCache('overwriteKey', 'first');
    setCache('overwriteKey', 'second');
    expect(getCache('overwriteKey')).to.equal('second');
  });
});
