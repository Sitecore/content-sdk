/* eslint-disable no-unused-expressions */

// what is `import x = require('x');`? great question: https://github.com/Microsoft/TypeScript/issues/5073
import chai from 'chai';
import chaiString from 'chai-string';
import { replaceMediaUrlPrefix, getSrcSet, updateImageUrl, getRequiredParams } from './media-api';

const expect = chai.use(chaiString).expect;

describe('getRequiredParams', () => {
  it('should return required query string params including preview context params', () => {
    const parsedQs = {
      rev: '11',
      db: '22',
      xxx: 'ppp',
      la: '33',
      vs: '44',
      ts: '55',
      ttc: '63916515230',
      tt: 'ABC123',
      hash: 'DEF456',
      yyy: 'vvv',
    };

    const params = getRequiredParams(parsedQs);

    expect(params).to.deep.equal({
      rev: '11',
      db: '22',
      la: '33',
      vs: '44',
      ts: '55',
      ttc: '63916515230',
      tt: 'ABC123',
      hash: 'DEF456',
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
    const url = new URL(updated);
    expect(url.searchParams.get('mh')).to.equal('5');
    expect(url.searchParams.get('mw')).to.equal('6');
  });

  it('should remove non-required query parameters not provided', () => {
    const original =
      'http://sitecore/-/media/lorem.png?h=1&w=2&mh=3&mw=4&hash=CC5043DC03C6C27F40EDB08CF84AB8670C05D63D';
    const updated = updateImageUrl(original, { mh: '5', mw: '6' });
    const url = new URL(updated);
    expect(url.searchParams.get('mh')).to.equal('5');
    expect(url.searchParams.get('mw')).to.equal('6');
    expect(url.searchParams.get('h')).to.be.null;
    expect(url.searchParams.get('w')).to.be.null;
    expect(url.searchParams.get('hash')).to.equal('CC5043DC03C6C27F40EDB08CF84AB8670C05D63D');
  });

  it('should preserve required query parameters', () => {
    const original =
      'http://sitecore/-/media/lorem.png?rev=100&db=master&la=en&vs=200&ts=foo&mh=3&mw=4';
    const updated = updateImageUrl(original, { mh: '5', mw: '6' });
    const url = new URL(updated);
    expect(url.searchParams.get('mh')).to.equal('5');
    expect(url.searchParams.get('mw')).to.equal('6');
    expect(url.searchParams.get('rev')).to.equal('100');
    expect(url.searchParams.get('db')).to.equal('master');
    expect(url.searchParams.get('la')).to.equal('en');
    expect(url.searchParams.get('vs')).to.equal('200');
    expect(url.searchParams.get('ts')).to.equal('foo');
  });

  it('should replace /-/media/ with /-/jssmedia/', () => {
    const original = 'http://sitecore/-/media/lorem/ipsum.jpg';
    const updated = updateImageUrl(original, { foo: 'bar' });
    const url = new URL(updated);
    expect(url.pathname).to.startsWith('/-/jssmedia/');
  });

  it('should replace /~/media/ with /~/jssmedia/', () => {
    const original = 'http://sitecore/~/media/lorem/ipsum.jpg';
    const updated = updateImageUrl(original, { foo: 'bar' });
    const url = new URL(updated);
    expect(url.pathname).to.startsWith('/~/jssmedia/');
  });

  describe('preview context URL handling', () => {
    it('should preserve preview context params (ttc, tt, hash) alongside imageParams', () => {
      const original =
        'http://sitecore/-/media/lorem.jpg?h=386&iar=0&w=580&ttc=63916515230&tt=920D06D9A5A7854EA56FEC0C7ACF7A7A&hash=D04C2CC8A2097B956B39657256631ED7';
      const updated = updateImageUrl(original, { mw: '100', mh: '50' });
      const url = new URL(updated);
      // Preview context params should be preserved
      expect(url.searchParams.get('ttc')).to.equal('63916515230');
      expect(url.searchParams.get('tt')).to.equal('920D06D9A5A7854EA56FEC0C7ACF7A7A');
      expect(url.searchParams.get('hash')).to.equal('D04C2CC8A2097B956B39657256631ED7');
      // New imageParams should be added
      expect(url.searchParams.get('mw')).to.equal('100');
      expect(url.searchParams.get('mh')).to.equal('50');
      // Non-required params should be stripped
      expect(url.searchParams.get('h')).to.be.null;
      expect(url.searchParams.get('iar')).to.be.null;
      expect(url.searchParams.get('w')).to.be.null;
      // URL prefix should be replaced
      expect(url.pathname).to.startsWith('/-/jssmedia/');
    });

    it('should preserve tt and hash params when present', () => {
      const original = 'http://sitecore/-/media/lorem.jpg?w=100&tt=ABC123&hash=DEF456';
      const updated = updateImageUrl(original, { mw: '200' });
      const url = new URL(updated);
      // Preview params preserved
      expect(url.searchParams.get('tt')).to.equal('ABC123');
      expect(url.searchParams.get('hash')).to.equal('DEF456');
      // imageParams added
      expect(url.searchParams.get('mw')).to.equal('200');
      // Non-required params stripped
      expect(url.searchParams.get('w')).to.be.null;
    });

    it('should work with path-only preview URLs', () => {
      const original = '/-/media/test.jpg?ttc=123&tt=ABC&hash=XYZ';
      const updated = updateImageUrl(original, { w: '500' });
      expect(updated).to.include('ttc=123');
      expect(updated).to.include('tt=ABC');
      expect(updated).to.include('hash=XYZ');
      expect(updated).to.include('w=500');
    });
  });

  describe('should replace url using custom mediaUrlPrefix', () => {
    it('should replace /-assets/ with /-/jssmedia', () => {
      const original = 'http://sitecore/-assets/lorem/ipsum.jpg';
      const mediaUrlPrefix = /\/([-~]{1})assets\//i;
      const updated = updateImageUrl(original, { foo: 'bar' }, mediaUrlPrefix);
      const url = new URL(updated);
      expect(url.pathname).to.startsWith('/-/jssmedia/');
    });

    it('should replace /~assets/ with /~/jssmedia', () => {
      const original = 'http://sitecore/~assets/lorem/ipsum.jpg';
      const mediaUrlPrefix = /\/([-~]{1})assets\//i;
      const updated = updateImageUrl(original, { foo: 'bar' }, mediaUrlPrefix);
      const url = new URL(updated);
      expect(url.pathname).to.startsWith('/~/jssmedia/');
    });

    it('should replace /-/assets/ with /-/jssmedia/', () => {
      const original = 'http://sitecore/-/assets/lorem/ipsum.jpg';
      const mediaUrlPrefix = /\/([-~]{1})\/assets\//i;
      const updated = updateImageUrl(original, { foo: 'bar' }, mediaUrlPrefix);
      const url = new URL(updated);
      expect(url.pathname).to.startsWith('/-/jssmedia/');
    });

    it('should replace /~/assets/ with /~/jssmedia/', () => {
      const original = 'http://sitecore/~/assets/lorem/ipsum.jpg';
      const mediaUrlPrefix = /\/([-~]{1})\/assets\//i;
      const updated = updateImageUrl(original, { foo: 'bar' }, mediaUrlPrefix);
      const url = new URL(updated);
      expect(url.pathname).to.startsWith('/~/jssmedia/');
    });
  });

  it('should omit empty string params', () => {
    const original = 'http://sitecore/-/media/lorem/ipsum.jpg';
    const updated = updateImageUrl(original, { w: '100', h: '', mw: 0 });
    const url = new URL(updated);
    expect(url.searchParams.get('w')).to.equal('100');
    expect(url.searchParams.get('mw')).to.equal('0');
    expect(url.searchParams.has('h')).to.be.false;
  });

  it('should merge querystring and params', () => {
    const src =
      '/media/lorem/ipsum.jpg?x=valueX&y=value111&rev=109010&db=333&la=444&vs=555&ts=666&unknownParam=54321';
    const params = { y: 'valueY', z: 'valueZ' };
    const parsed = updateImageUrl(src, params);
    const url = new URL(parsed, 'http://local.invalid');

    expect(`${url.pathname}${url.search}`).equal(
      '/media/lorem/ipsum.jpg?y=valueY&z=valueZ&rev=109010&db=333&la=444&vs=555&ts=666'
    );
    expect(Object.fromEntries(url.searchParams)).deep.equal({
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
      const url = new URL(updated);
      expect(url.pathname).to.startsWith('/-/jssmedia/');
    });

    it('should replace /~/media/ with /~/jssmedia/', () => {
      const original = 'http://sitecore/~/media/lorem/ipsum.jpg';
      const updated = replaceMediaUrlPrefix(original);
      const url = new URL(updated);
      expect(url.pathname).to.startsWith('/~/jssmedia/');
    });
  });
});
