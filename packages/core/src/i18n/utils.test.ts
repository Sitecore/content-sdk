import { expect } from 'chai';
import { getLocaleRewrite } from './utils';

describe('utils', () => {
  describe('getLocaleRewrite', () => {
    const defaultLocale = 'en';

    it('should prepend the locale to the path when pathname starts with "/"', () => {
      const pathname = '/some/path';
      const result = getLocaleRewrite(pathname, defaultLocale);
      expect(result).to.equal(`/en/some/path`);
    });

    it('should prepend the locale to the path when pathname does not start with "/"', () => {
      const pathname = 'some/path';
      const result = getLocaleRewrite(pathname, defaultLocale);
      expect(result).to.equal(`/en/some/path`);
    });

    it('should return the root path with the locale', () => {
      const pathname = '/';
      const result = getLocaleRewrite(pathname, defaultLocale);
      expect(result).to.equal(`/en`);
    });
  });
});
