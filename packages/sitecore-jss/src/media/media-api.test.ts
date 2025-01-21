/* eslint-disable no-unused-expressions */

// what is `import x = require('x');`? great question: https://github.com/Microsoft/TypeScript/issues/5073
import chai from 'chai';
import chaiString from 'chai-string';
import URL from 'url-parse';
import { replaceMediaUrlPrefix, getSrcSet, updateImageUrl, getRequiredParams } from './media-api';

const expect = chai.use(chaiString).expect;

describe('getRequiredParams', () => {
  it('should return required query string params', () => {
    const parsedQs = {
      rev: '11',
      db: '22',
      xxx: 'ppp',
      la: '33',
      vs: '44',
      ts: '55',
      yyy: 'vvv',
    };

    const params = getRequiredParams(parsedQs);

    expect(params).to.deep.equal({
      rev: '11',
      db: '22',
      la: '33',
      vs: '44',
      ts: '55',
    });
  });
});

describe('updateImageUrl', () => {
  it('should return original if no params', () => {
    const original =
      'http://sitecore/-/media/lorem/ipsum.jpg?h=1&w=2&hash=CC5043DC03C6C27F40EDB08CF84AB8670C05D63D';
    const updated = updateImageUrl(original);
    expect(updated).to.equal(original);
  });

  it('should override parameters with those provided', () => {
    const original = 'http://sitecore/-/media/lorem.png?mh=3&mw=4';
    const updated = updateImageUrl(original, { mh: '5', mw: '6' });
    const url = URL(updated, true);
    expect(url.query.mh).to.equal('5');
    expect(url.query.mw).to.equal('6');
  });

  it('should remove non-required query parameters not provided', () => {
    const original =
      'http://sitecore/-/media/lorem.png?h=1&w=2&mh=3&mw=4&hash=CC5043DC03C6C27F40EDB08CF84AB8670C05D63D';
    const updated = updateImageUrl(original, { mh: '5', mw: '6' });
    const url = URL(updated, true);
    expect(url.query.mh).to.equal('5');
    expect(url.query.mw).to.equal('6');
    expect(url.query.h).to.be.undefined;
    expect(url.query.w).to.be.undefined;
    expect(url.query.hash).to.be.undefined;
  });

  it('should preserve required query parameters', () => {
    const original =
      'http://sitecore/-/media/lorem.png?rev=100&db=master&la=en&vs=200&ts=foo&mh=3&mw=4';
    const updated = updateImageUrl(original, { mh: '5', mw: '6' });
    const url = URL(updated, true);
    expect(url.query.mh).to.equal('5');
    expect(url.query.mw).to.equal('6');
    expect(url.query.rev).to.equal('100');
    expect(url.query.db).to.equal('master');
    expect(url.query.la).to.equal('en');
    expect(url.query.vs).to.equal('200');
    expect(url.query.ts).to.equal('foo');
  });

  it('should replace /-/media/ with /-/jssmedia/', () => {
    const original = 'http://sitecore/-/media/lorem/ipsum.jpg';
    const updated = updateImageUrl(original, { foo: 'bar' });
    const url = URL(updated);
    expect(url.pathname).to.startsWith('/-/jssmedia/');
  });

  it('should replace /~/media/ with /~/jssmedia/', () => {
    const original = 'http://sitecore/~/media/lorem/ipsum.jpg';
    const updated = updateImageUrl(original, { foo: 'bar' });
    const url = URL(updated);
    expect(url.pathname).to.startsWith('/~/jssmedia/');
  });

  describe('should replace url using custom mediaUrlPrefix', () => {
    it('should replace /-assets/ with /-/jssmedia', () => {
      const original = 'http://sitecore/-assets/lorem/ipsum.jpg';
      const mediaUrlPrefix = /\/([-~]{1})assets\//i;
      const updated = updateImageUrl(original, { foo: 'bar' }, mediaUrlPrefix);
      const url = URL(updated);
      expect(url.pathname).to.startsWith('/-/jssmedia/');
    });

    it('should replace /~assets/ with /~/jssmedia', () => {
      const original = 'http://sitecore/~assets/lorem/ipsum.jpg';
      const mediaUrlPrefix = /\/([-~]{1})assets\//i;
      const updated = updateImageUrl(original, { foo: 'bar' }, mediaUrlPrefix);
      const url = URL(updated);
      expect(url.pathname).to.startsWith('/~/jssmedia/');
    });

    it('should replace /-/assets/ with /-/jssmedia/', () => {
      const original = 'http://sitecore/-/assets/lorem/ipsum.jpg';
      const mediaUrlPrefix = /\/([-~]{1})\/assets\//i;
      const updated = updateImageUrl(original, { foo: 'bar' }, mediaUrlPrefix);
      const url = URL(updated);
      expect(url.pathname).to.startsWith('/-/jssmedia/');
    });

    it('should replace /~/assets/ with /~/jssmedia/', () => {
      const original = 'http://sitecore/~/assets/lorem/ipsum.jpg';
      const mediaUrlPrefix = /\/([-~]{1})\/assets\//i;
      const updated = updateImageUrl(original, { foo: 'bar' }, mediaUrlPrefix);
      const url = URL(updated);
      expect(url.pathname).to.startsWith('/~/jssmedia/');
    });
  });

  it('should merge querystring and params', () => {
    const src =
      '/media/lorem/ipsum.jpg?x=valueX&y=value111&rev=109010&db=333&la=444&vs=555&ts=666&unknownParam=54321';
    const params = { y: 'valueY', z: 'valueZ' };
    const parsed = updateImageUrl(src, params);
    const url = URL(parsed, {}, true);

    expect(url.toString()).equal(
      '/media/lorem/ipsum.jpg?y=valueY&z=valueZ&rev=109010&db=333&la=444&vs=555&ts=666'
    );
    expect(url.query).deep.equal({
      y: 'valueY',
      z: 'valueZ',
      rev: '109010',
      db: '333',
      la: '444',
      vs: '555',
      ts: '666',
    });
  });
});

describe('getSrcSet', () => {
  it('should create a srcset for all provided widths', () => {
    const original = '/ipsum.jpg';
    const expected =
      '/ipsum.jpg?h=1000&w=1000 1000w, /ipsum.jpg?h=500&w=500 500w, /ipsum.jpg?mh=250&mw=250 250w';
    const params = [
      { h: '1000', w: '1000' },
      { h: '500', w: '500' },
      { mh: '250', mw: '250' },
      { h: '100' },
    ];
    const srcSet = getSrcSet(original, params);
    expect(srcSet).to.equal(expected);
  });

  it('should combine default and srcset parameters', () => {
    const original = '/ipsum.jpg';
    const expected = '/ipsum.jpg?as=1&w=1000 1000w, /ipsum.jpg?as=1&w=500 500w';
    const params = [{ w: '1000' }, { w: '500' }];
    const srcSet = getSrcSet(original, params, { as: '1', w: '9999' });
    expect(srcSet).to.equal(expected);
  });

  describe('should replace url using custom mediaUrlPrefix', () => {
    const params = [{ w: '1000' }, { w: '500' }];

    it('should replace /-assets/ with /-/jssmedia', () => {
      const original = '/-assets/lorem/ipsum.jpg';
      const expected =
        '/-/jssmedia/lorem/ipsum.jpg?w=1000 1000w, /-/jssmedia/lorem/ipsum.jpg?w=500 500w';
      const mediaUrlPrefix = /\/([-~]{1})assets\//i;
      const srcSet = getSrcSet(original, params, undefined, mediaUrlPrefix);
      expect(srcSet).to.equal(expected);
    });

    it('should replace /~assets/ with /~/jssmedia', () => {
      const original = '/~assets/lorem/ipsum.jpg';
      const expected =
        '/~/jssmedia/lorem/ipsum.jpg?w=1000 1000w, /~/jssmedia/lorem/ipsum.jpg?w=500 500w';
      const mediaUrlPrefix = /\/([-~]{1})assets\//i;
      const srcSet = getSrcSet(original, params, undefined, mediaUrlPrefix);
      expect(srcSet).to.equal(expected);
    });

    it('should replace /-/assets/ with /-/jssmedia/', () => {
      const original = '/-/assets/lorem/ipsum.jpg';
      const expected =
        '/-/jssmedia/lorem/ipsum.jpg?w=1000 1000w, /-/jssmedia/lorem/ipsum.jpg?w=500 500w';
      const mediaUrlPrefix = /\/([-~]{1})\/assets\//i;
      const srcSet = getSrcSet(original, params, undefined, mediaUrlPrefix);
      expect(srcSet).to.equal(expected);
    });

    it('should replace /~/assets/ with /~/jssmedia/', () => {
      const original = '/~/assets/lorem/ipsum.jpg';
      const expected =
        '/~/jssmedia/lorem/ipsum.jpg?w=1000 1000w, /~/jssmedia/lorem/ipsum.jpg?w=500 500w';
      const mediaUrlPrefix = /\/([-~]{1})\/assets\//i;
      const srcSet = getSrcSet(original, params, undefined, mediaUrlPrefix);
      expect(srcSet).to.equal(expected);
    });
  });

  describe('replaceMediaUrlPrefix', () => {
    it('should replace /-/media/ with /-/jssmedia/', () => {
      const original = 'http://sitecore/-/media/lorem/ipsum.jpg';
      const updated = replaceMediaUrlPrefix(original);
      const url = URL(updated);
      expect(url.pathname).to.startsWith('/-/jssmedia/');
    });

    it('should replace /~/media/ with /~/jssmedia/', () => {
      const original = 'http://sitecore/~/media/lorem/ipsum.jpg';
      const updated = replaceMediaUrlPrefix(original);
      const url = URL(updated);
      expect(url.pathname).to.startsWith('/~/jssmedia/');
    });
  });
});
