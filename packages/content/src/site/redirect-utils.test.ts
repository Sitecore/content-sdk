/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import {
  breakDownPath,
  isAbsoluteTarget,
  matchFromRedirectMapRedirect,
  matchRedirectItemRedirect,
  processAbsoluteUrlTarget,
  processRelativeUrlTarget,
  RedirectResult,
  resolveRedirectTarget,
  safeCompileRedirectPattern,
} from './redirect-utils';

const LOCALES = ['en', 'da'];

const makeRedirect = (overrides: Partial<RedirectResult> = {}): RedirectResult =>
  ({
    pattern: '/old-page',
    target: '/new-page',
    redirectType: 'REDIRECT_301',
    isQueryStringPreserved: false,
    isLanguagePreserved: false,
    locale: '',
    ...overrides,
  } as RedirectResult);

describe('redirect-utils', () => {
  describe('breakDownPath', () => {
    it('should split a locale-prefixed path', () => {
      expect(breakDownPath(LOCALES, '/en/foo/bar')).to.deep.equal({
        nonLocalePath: '/foo/bar',
        queryString: undefined,
        locale: 'en',
      });
    });

    it('should return the path unchanged when no locale prefix is present', () => {
      expect(breakDownPath(LOCALES, '/foo/bar')).to.deep.equal({
        nonLocalePath: '/foo/bar',
        queryString: undefined,
      });
    });

    it('should extract the query string and strip a trailing slash', () => {
      expect(breakDownPath(LOCALES, '/en/foo?x=1')).to.deep.equal({
        nonLocalePath: '/foo',
        queryString: 'x=1',
        locale: 'en',
      });
      expect(breakDownPath(LOCALES, '/en/foo/')).to.deep.equal({
        nonLocalePath: '/foo',
        queryString: undefined,
        locale: 'en',
      });
    });

    it('should match locales case-insensitively and preserve the original casing', () => {
      expect(breakDownPath(LOCALES, '/EN/foo')).to.deep.equal({
        nonLocalePath: '/foo',
        queryString: undefined,
        locale: 'EN',
      });
    });
  });

  describe('matchRedirectItemRedirect', () => {
    it('should match on locale and normalized, case-insensitive, slash-trimmed pattern', () => {
      const redirect = makeRedirect({ locale: 'en', pattern: '/About/', target: '/x' });
      expect(matchRedirectItemRedirect([redirect], 'en', '/about')).to.equal(redirect);
    });

    it('should return undefined when the locale does not match', () => {
      const redirect = makeRedirect({ locale: 'da', pattern: '/about' });
      expect(matchRedirectItemRedirect([redirect], 'en', '/about')).to.be.undefined;
    });

    it('should return undefined when the path does not match', () => {
      const redirect = makeRedirect({ locale: 'en', pattern: '/other' });
      expect(matchRedirectItemRedirect([redirect], 'en', '/about')).to.be.undefined;
    });

    it('should return undefined for an empty list', () => {
      expect(matchRedirectItemRedirect([], 'en', '/about')).to.be.undefined;
    });

    it('should return the first matching redirect', () => {
      const first = makeRedirect({ locale: 'en', pattern: '/about', target: '/first' });
      const second = makeRedirect({ locale: 'en', pattern: '/about', target: '/second' });
      expect(matchRedirectItemRedirect([first, second], 'en', '/about')).to.equal(first);
    });
  });

  describe('matchFromRedirectMapRedirect', () => {
    it('should match a static url rule', () => {
      const redirect = makeRedirect({ pattern: '/old-page', target: '/new-page' });
      expect(matchFromRedirectMapRedirect([redirect], LOCALES, 'en', '/old-page', '')).to.equal(
        redirect
      );
    });

    it('should ignore redirects that carry a locale (redirect-item rules)', () => {
      const localeRule = makeRedirect({ pattern: '/old-page', locale: 'en' });
      expect(matchFromRedirectMapRedirect([localeRule], LOCALES, 'en', '/old-page', '')).to.be
        .undefined;
    });

    it('should match a locale-prefixed static rule against a non-prefixed incoming path', () => {
      const redirect = makeRedirect({ pattern: '/en/old-page', target: '/new-page' });
      expect(matchFromRedirectMapRedirect([redirect], LOCALES, 'en', '/old-page', '')).to.equal(
        redirect
      );
    });

    it('should match an anchored regex rule and record the matched path', () => {
      const redirect = makeRedirect({ pattern: '^/test/(.*)$', target: '/about' });
      const result = matchFromRedirectMapRedirect([redirect], LOCALES, 'en', '/en/test/red', '');
      expect(result).to.equal(redirect);
      expect(redirect.matchedPath).to.equal('/test/red');
    });

    it('should match a regex rule against the path plus query string', () => {
      const redirect = makeRedirect({ pattern: '^/search\\?q=.*$', target: '/results' });
      const result = matchFromRedirectMapRedirect([redirect], LOCALES, 'en', '/search', '?q=shoes');
      expect(result).to.equal(redirect);
      expect(redirect.matchedQueryString).to.equal('?q=shoes');
    });

    it('should return undefined when nothing matches', () => {
      const redirect = makeRedirect({ pattern: '/old-page' });
      expect(matchFromRedirectMapRedirect([redirect], LOCALES, 'en', '/other', '')).to.be.undefined;
    });

    it('should skip malformed regex rules without throwing', () => {
      const warn = sinon.stub(console, 'warn');
      const broken = makeRedirect({ pattern: '^/broken(', target: '/bad' });
      const good = makeRedirect({ pattern: '/old-page', target: '/new-page' });
      try {
        expect(
          matchFromRedirectMapRedirect([broken, good], LOCALES, 'en', '/old-page', '')
        ).to.equal(good);
        expect(warn.calledOnce).to.be.true;
      } finally {
        warn.restore();
      }
    });
  });

  describe('safeCompileRedirectPattern', () => {
    it('should compile a plain regex source', () => {
      const regex = safeCompileRedirectPattern('^/old-page/(\\d+)$');
      expect(regex).to.be.instanceOf(RegExp);
      expect(regex && regex.test('/old-page/123')).to.be.true;
    });

    it('should compile a JS literal form with explicit flags', () => {
      const regex = safeCompileRedirectPattern('/foo/g');
      expect(regex).to.be.instanceOf(RegExp);
      expect(regex?.flags).to.equal('g');
    });

    it('should return null and warn on a malformed pattern', () => {
      const warn = sinon.stub(console, 'warn');
      try {
        expect(safeCompileRedirectPattern('^/broken(')).to.be.null;
        expect(warn.calledOnce).to.be.true;
      } finally {
        warn.restore();
      }
    });
  });

  describe('isAbsoluteTarget', () => {
    it('should detect absolute and protocol-relative URLs', () => {
      expect(isAbsoluteTarget('https://example.com/x')).to.be.true;
      expect(isAbsoluteTarget('http://example.com')).to.be.true;
      expect(isAbsoluteTarget('//example.com')).to.be.true;
    });

    it('should treat relative paths as non-absolute', () => {
      expect(isAbsoluteTarget('/foo/bar')).to.be.false;
      expect(isAbsoluteTarget('foo/bar')).to.be.false;
    });
  });

  describe('resolveRedirectTarget', () => {
    it('should replace the $siteLang token with the site language', () => {
      const redirect = makeRedirect({ pattern: '/old-page', target: '/$siteLang/new-page' });
      expect(resolveRedirectTarget(redirect, 'da', '/old-page')).to.equal('/da/new-page');
    });

    it('should substitute regex capture groups from the matched path', () => {
      const redirect = makeRedirect({
        pattern: '/old-page/(\\d+)',
        target: '/new-page/$1',
        matchedPath: '/old-page/123',
      });
      expect(resolveRedirectTarget(redirect, 'en', '/old-page/123')).to.equal('/new-page/123');
    });

    it('should fall back to the request path when no matched path is stored', () => {
      const redirect = makeRedirect({ pattern: '/old-page/(\\d+)', target: '/new-page/$1' });
      expect(resolveRedirectTarget(redirect, 'en', '/old-page/456')).to.equal('/new-page/456');
    });

    it('should return a plain static target unchanged', () => {
      const redirect = makeRedirect({ pattern: '/old-page', target: '/new-page' });
      expect(resolveRedirectTarget(redirect, 'en', '/old-page')).to.equal('/new-page');
    });
  });

  describe('processAbsoluteUrlTarget', () => {
    it('should return the target unchanged when the query string is not preserved', () => {
      const redirect = makeRedirect({
        target: 'https://example.com/p?b=2',
        isQueryStringPreserved: false,
      });
      expect(
        processAbsoluteUrlTarget({ nonLocalePath: '/p', queryString: 'a=1' }, redirect)
      ).to.equal('https://example.com/p?b=2');
    });

    it('should merge the incoming query string into the target when preserved', () => {
      const redirect = makeRedirect({
        target: 'https://example.com/p?b=2',
        isQueryStringPreserved: true,
      });
      const result = processAbsoluteUrlTarget(
        { nonLocalePath: '/p', queryString: 'a=1' },
        redirect
      );
      expect(result).to.startWith('https://example.com/p?');
      expect(result).to.contain('a=1');
      expect(result).to.contain('b=2');
    });
  });

  describe('processRelativeUrlTarget', () => {
    it('should preserve the request locale for a locale-less target when isLanguagePreserved is true', () => {
      const redirect = makeRedirect({ target: '/new-page', isLanguagePreserved: true });
      expect(
        processRelativeUrlTarget({ nonLocalePath: '/old-page' }, redirect, LOCALES, 'da')
      ).to.deep.equal({ targetLocale: 'da', targetPath: '/new-page' });
    });

    it('should use the target locale prefix when the target carries one', () => {
      const redirect = makeRedirect({ target: '/da/new-page', isLanguagePreserved: true });
      expect(
        processRelativeUrlTarget({ nonLocalePath: '/old-page' }, redirect, LOCALES, 'en')
      ).to.deep.equal({ targetLocale: 'da', targetPath: '/new-page' });
    });

    it('should emit no locale for a locale-less target when isLanguagePreserved is false', () => {
      const redirect = makeRedirect({ target: '/new-page', isLanguagePreserved: false });
      expect(
        processRelativeUrlTarget({ nonLocalePath: '/old-page' }, redirect, LOCALES, 'da')
      ).to.deep.equal({ targetLocale: '', targetPath: '/new-page' });
    });

    it('should merge the incoming query string into the target path when preserved', () => {
      const redirect = makeRedirect({ target: '/new-page', isQueryStringPreserved: true });
      const result = processRelativeUrlTarget(
        { nonLocalePath: '/old-page', queryString: 'a=1' },
        redirect,
        LOCALES,
        'en'
      );
      expect(result.targetPath).to.startWith('/new-page?');
      expect(result.targetPath).to.contain('a=1');
    });
  });
});

