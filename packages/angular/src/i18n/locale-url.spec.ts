/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import {
  stripLocalePrefix,
  resolveLocale,
  prependLocale,
  extractLocaleFromUrl,
  stripConfiguredRouteLocalePrefix,
  stripLeadingLocaleFromPathKey,
} from './locale-url';

describe('locale-url', () => {
  const locales = ['en', 'fr'] as const;

  describe('stripLocalePrefix', () => {
    it('strips leading locale segment', () => {
      expect(stripLocalePrefix('/fr/about', locales)).toBe('/about');
    });
    it('preserves query string', () => {
      expect(stripLocalePrefix('/fr/about?q=1', locales)).toBe('/about?q=1');
    });
    it('returns home when only locale segment', () => {
      expect(stripLocalePrefix('/fr', locales)).toBe('/');
    });
    it('leaves path when first segment is not a locale', () => {
      expect(stripLocalePrefix('/about', locales)).toBe('/about');
    });
  });

  describe('resolveLocale', () => {
    it('uses param when present', () => {
      expect(resolveLocale({ locale: 'fr' }, 'en')).toBe('fr');
    });
    it('falls back to default', () => {
      expect(resolveLocale({}, 'en')).toBe('en');
    });
  });

  describe('prependLocale', () => {
    it('does not prefix default language', () => {
      expect(prependLocale('/404', 'en', 'en')).toBe('/404');
    });
    it('prefixes non-default locale', () => {
      expect(prependLocale('/404', 'fr', 'en')).toBe('/fr/404');
    });
  });

  describe('extractLocaleFromUrl', () => {
    it('reads first segment when it is a locale', () => {
      expect(extractLocaleFromUrl('/fr/foo', locales, 'en')).toBe('fr');
    });
    it('returns default when no locale prefix', () => {
      expect(extractLocaleFromUrl('/foo', locales, 'en')).toBe('en');
    });
  });

  describe('stripConfiguredRouteLocalePrefix', () => {
    it('strips mistaken locale prefix from configured route', () => {
      expect(stripConfiguredRouteLocalePrefix('/fr/404', locales)).toBe('/404');
    });
  });

  describe('stripLeadingLocaleFromPathKey', () => {
    it('strips locale from normalized path key', () => {
      expect(stripLeadingLocaleFromPathKey('fr/404', locales)).toBe('404');
    });
  });
});
