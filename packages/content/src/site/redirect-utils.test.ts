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

    it('should extract the query string and preserve a trailing slash', () => {
      expect(breakDownPath(LOCALES, '/en/foo?x=1')).to.deep.equal({
        nonLocalePath: '/foo',
        queryString: 'x=1',
        locale: 'en',
      });
      expect(breakDownPath(LOCALES, '/en/foo/')).to.deep.equal({
        nonLocalePath: '/foo/',
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
      // the locale is stripped but the remaining path keeps its original casing
      expect(breakDownPath(LOCALES, '/EN/Foo/Bar')).to.deep.equal({
        nonLocalePath: '/Foo/Bar',
        queryString: undefined,
        locale: 'EN',
      });
    });

    it('should reduce a locale-only path to root and record the locale', () => {
      expect(breakDownPath(LOCALES, '/en')).to.deep.equal({
        nonLocalePath: '/',
        queryString: undefined,
        locale: 'en',
      });
      expect(breakDownPath(LOCALES, '/en/')).to.deep.equal({
        nonLocalePath: '/',
        queryString: undefined,
        locale: 'en',
      });
      expect(breakDownPath(LOCALES, '/en?x=1')).to.deep.equal({
        nonLocalePath: '/',
        queryString: 'x=1',
        locale: 'en',
      });
    });

    it('should not strip a leading segment that is not a configured locale', () => {
      expect(breakDownPath(LOCALES, '/de/foo')).to.deep.equal({
        nonLocalePath: '/de/foo',
        queryString: undefined,
      });
    });

    it('should never strip a locale when no locales are configured', () => {
      expect(breakDownPath([], '/en/foo')).to.deep.equal({
        nonLocalePath: '/en/foo',
        queryString: undefined,
      });
      expect(breakDownPath([], '/foo')).to.deep.equal({
        nonLocalePath: '/foo',
        queryString: undefined,
      });
    });

    it('should normalize a path without a leading slash', () => {
      expect(breakDownPath(LOCALES, 'en/foo')).to.deep.equal({
        nonLocalePath: '/foo',
        queryString: undefined,
        locale: 'en',
      });
      // a non-locale, slash-less path gets a leading slash added
      expect(breakDownPath(LOCALES, 'foo')).to.deep.equal({
        nonLocalePath: '/foo',
        queryString: undefined,
      });
    });

    it('should collapse root, empty and slash-only paths to a single slash', () => {
      expect(breakDownPath(LOCALES, '/')).to.deep.equal({
        nonLocalePath: '/',
        queryString: undefined,
      });
      expect(breakDownPath(LOCALES, '')).to.deep.equal({
        nonLocalePath: '/',
        queryString: undefined,
      });
      expect(breakDownPath(LOCALES, '//')).to.deep.equal({
        nonLocalePath: '/',
        queryString: undefined,
      });
      expect(breakDownPath(LOCALES, '///')).to.deep.equal({
        nonLocalePath: '/',
        queryString: undefined,
      });
    });

    it('should keep a query string with no path and normalize the path to root', () => {
      expect(breakDownPath(LOCALES, '?x=1')).to.deep.equal({
        nonLocalePath: '/',
        queryString: 'x=1',
      });
    });

    it('should preserve an empty query string produced by a trailing question mark', () => {
      expect(breakDownPath(LOCALES, '/en/foo?')).to.deep.equal({
        nonLocalePath: '/foo',
        queryString: '',
        locale: 'en',
      });
    });

    it('should preserve a trailing slash on the locale-less path', () => {
      expect(breakDownPath(LOCALES, '/en/foo/bar/')).to.deep.equal({
        nonLocalePath: '/foo/bar/',
        queryString: undefined,
        locale: 'en',
      });
      expect(breakDownPath(LOCALES, '/en/foo/?x=1')).to.deep.equal({
        nonLocalePath: '/foo/',
        queryString: 'x=1',
        locale: 'en',
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
      expect(
        matchFromRedirectMapRedirect([redirect], 'en', { nonLocalePath: '/old-page' })
      ).to.equal(redirect);
    });

    it('should ignore redirects that carry a locale (redirect-item rules)', () => {
      const localeRule = makeRedirect({ pattern: '/old-page', locale: 'en' });
      expect(matchFromRedirectMapRedirect([localeRule], 'en', { nonLocalePath: '/old-page' })).to.be
        .undefined;
    });

    it('should match a locale-prefixed static rule against a locale-less incoming path', () => {
      const redirect = makeRedirect({ pattern: '/en/old-page', target: '/new-page' });
      expect(
        matchFromRedirectMapRedirect([redirect], 'en', { nonLocalePath: '/old-page' })
      ).to.equal(redirect);
    });

    it('should match a locale-less static rule even when the incoming URL carried a locale', () => {
      // incomingPathData is already locale-stripped, so a non-locale rule still matches
      const redirect = makeRedirect({ pattern: '/old-page', target: '/new-page' });
      expect(
        matchFromRedirectMapRedirect([redirect], 'en', { nonLocalePath: '/old-page', locale: 'en' })
      ).to.equal(redirect);
    });

    it('should match a locale-prefixed static rule when the incoming URL carried that locale', () => {
      const redirect = makeRedirect({ pattern: '/en/old-page', target: '/new-page' });
      expect(
        matchFromRedirectMapRedirect([redirect], 'en', { nonLocalePath: '/old-page', locale: 'en' })
      ).to.equal(redirect);
    });

    it('should compare locales case-insensitively', () => {
      const redirect = makeRedirect({ pattern: '/EN/old-page', target: '/new-page' });
      expect(
        matchFromRedirectMapRedirect([redirect], 'En', { nonLocalePath: '/old-page' })
      ).to.equal(redirect);
    });

    it('should match a static rule with a query string', () => {
      const redirect = makeRedirect({ pattern: '/search?q=shoes', target: '/results' });
      expect(
        matchFromRedirectMapRedirect([redirect], 'en', {
          nonLocalePath: '/search',
          queryString: 'q=shoes',
        })
      ).to.equal(redirect);
    });

    it('should match an anchored regex rule and record the locale-less matched path', () => {
      const redirect = makeRedirect({ pattern: '^/test/(.*)$', target: '/about' });
      const result = matchFromRedirectMapRedirect([redirect], 'en', {
        nonLocalePath: '/test/red',
        locale: 'en',
      });
      expect(result).to.equal(redirect);
      expect(redirect.matchedPath).to.equal('/test/red');
    });

    it('should match a regex rule against the path plus query string', () => {
      const redirect = makeRedirect({ pattern: '^/search\\?q=.*$', target: '/results' });
      const result = matchFromRedirectMapRedirect([redirect], 'en', {
        nonLocalePath: '/search',
        queryString: 'q=shoes',
      });
      expect(result).to.equal(redirect);
      expect(redirect.matchedQueryString).to.equal('?q=shoes');
      expect(redirect.matchedPath).to.equal('/search');
    });

    it('should match a regex rule anchored without a trailing slash for both slashed and unslashed paths', () => {
      // `^/my-page$` should match both `/my-page` and `/my-page/`
      const withoutSlash = makeRedirect({ pattern: '^/my-page$', target: '/new-page' });
      expect(
        matchFromRedirectMapRedirect([withoutSlash], 'en', { nonLocalePath: '/my-page' })
      ).to.equal(withoutSlash);

      const withSlash = makeRedirect({ pattern: '^/my-page$', target: '/new-page' });
      expect(
        matchFromRedirectMapRedirect([withSlash], 'en', { nonLocalePath: '/my-page/' })
      ).to.equal(withSlash);
    });

    it('should return undefined when nothing matches', () => {
      const redirect = makeRedirect({ pattern: '/old-page' });
      expect(matchFromRedirectMapRedirect([redirect], 'en', { nonLocalePath: '/other' })).to.be
        .undefined;
    });

    it('should skip malformed regex rules without throwing', () => {
      const warn = sinon.stub(console, 'warn');
      const broken = makeRedirect({ pattern: '^/broken(', target: '/bad' });
      const good = makeRedirect({ pattern: '/old-page', target: '/new-page' });
      try {
        expect(
          matchFromRedirectMapRedirect([broken, good], 'en', { nonLocalePath: '/old-page' })
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
      expect(
        processRelativeUrlTarget(
          { nonLocalePath: '/old-page', queryString: 'a=1' },
          redirect,
          LOCALES,
          'en'
        )
      ).to.deep.equal({ targetLocale: '', targetPath: '/new-page?a=1' });
    });

    // --- static (url pattern) targets: the rule's target is used verbatim ---

    it('should keep the query string carried by a static url target when there is no incoming query', () => {
      const redirect = makeRedirect({ target: '/new-page?ref=1' });
      expect(
        processRelativeUrlTarget({ nonLocalePath: '/old-page' }, redirect, LOCALES, 'en')
      ).to.deep.equal({ targetLocale: '', targetPath: '/new-page?ref=1' });
    });

    it('should drop the incoming query when preservation is off, keeping only the target query', () => {
      const redirect = makeRedirect({ target: '/new-page?ref=1', isQueryStringPreserved: false });
      expect(
        processRelativeUrlTarget(
          { nonLocalePath: '/old-page', queryString: 'a=1' },
          redirect,
          LOCALES,
          'en'
        )
      ).to.deep.equal({ targetLocale: '', targetPath: '/new-page?ref=1' });
    });

    it('should merge incoming and target query strings, with the target winning on key collisions', () => {
      const redirect = makeRedirect({
        target: '/new-page?ref=1&keep=t',
        isQueryStringPreserved: true,
      });
      expect(
        processRelativeUrlTarget(
          { nonLocalePath: '/old-page', queryString: 'ref=9&extra=x' },
          redirect,
          LOCALES,
          'en'
        )
      ).to.deep.equal({ targetLocale: '', targetPath: '/new-page?ref=1&extra=x&keep=t' });
    });

    it('should merge query strings while honoring a locale prefix carried by the target', () => {
      const redirect = makeRedirect({
        target: '/da/new-page?ref=1',
        isQueryStringPreserved: true,
      });
      expect(
        processRelativeUrlTarget(
          { nonLocalePath: '/old-page', queryString: 'q=2' },
          redirect,
          LOCALES,
          'en'
        )
      ).to.deep.equal({ targetLocale: 'da', targetPath: '/new-page?q=2&ref=1' });
    });

    it('should let a target locale prefix win over isLanguagePreserved', () => {
      const redirect = makeRedirect({ target: '/en/new-page', isLanguagePreserved: true });
      expect(
        processRelativeUrlTarget({ nonLocalePath: '/old-page' }, redirect, LOCALES, 'da')
      ).to.deep.equal({ targetLocale: 'en', targetPath: '/new-page' });
    });

    it('should preserve the original casing of a target locale prefix', () => {
      const redirect = makeRedirect({ target: '/DA/foo' });
      expect(
        processRelativeUrlTarget({ nonLocalePath: '/old-page' }, redirect, LOCALES, 'en')
      ).to.deep.equal({ targetLocale: 'DA', targetPath: '/foo' });
    });

    it('should preserve the request locale for a bare root target', () => {
      const redirect = makeRedirect({ target: '/', isLanguagePreserved: true });
      expect(
        processRelativeUrlTarget({ nonLocalePath: '/old-page' }, redirect, LOCALES, 'en')
      ).to.deep.equal({ targetLocale: 'en', targetPath: '/' });
    });

    // --- regex pattern targets: resolveRedirectTarget has already substituted $1/$siteLang,
    //     so processRelativeUrlTarget receives a concrete path ---

    it('should preserve the request locale for a locale-less regex-substituted target', () => {
      const redirect = makeRedirect({
        pattern: '^/old/(\\d+)$',
        target: '/products/123',
        isLanguagePreserved: true,
      });
      expect(
        processRelativeUrlTarget({ nonLocalePath: '/old/123' }, redirect, LOCALES, 'da')
      ).to.deep.equal({ targetLocale: 'da', targetPath: '/products/123' });
    });

    it('should honor a locale prefix in a regex-substituted target even when isLanguagePreserved is false', () => {
      const redirect = makeRedirect({
        pattern: '^/old/(\\d+)$',
        target: '/da/products/123',
        isLanguagePreserved: false,
      });
      expect(
        processRelativeUrlTarget({ nonLocalePath: '/old/123' }, redirect, LOCALES, 'en')
      ).to.deep.equal({ targetLocale: 'da', targetPath: '/products/123' });
    });
  });
});

