/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { Route, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { createLocaleMatcher, createLocaleErrorMatcher } from './locale-matcher';

function seg(path: string): UrlSegment {
  return new UrlSegment(path, {});
}

const noopGroup = {} as UrlSegmentGroup;
const noopRoute = {} as Route;

describe('locale-matcher', () => {
  const locales = ['en', 'fr'] as const;

  describe('createLocaleMatcher', () => {
    const matcher = createLocaleMatcher(locales);

    it('matches prefixed URL with locale param', () => {
      const r = matcher([seg('fr'), seg('about')], noopGroup, noopRoute);
      expect(r).not.toBeNull();
      expect(r?.posParams?.locale?.path).toBe('fr');
      expect(r!.consumed.length).toBe(2);
    });

    it('matches unprefixed URL without locale param', () => {
      const r = matcher([seg('about')], noopGroup, noopRoute);
      expect(r).not.toBeNull();
      expect(r?.posParams?.locale).toBeUndefined();
      expect(r!.consumed.length).toBe(1);
    });

    it('matches empty segments for home', () => {
      const r = matcher([], noopGroup, noopRoute);
      expect(r).not.toBeNull();
      expect(r!.consumed.length).toBe(0);
    });
  });

  describe('createLocaleErrorMatcher', () => {
    const m404 = createLocaleErrorMatcher(locales, '404');

    it('matches /404', () => {
      expect(m404([seg('404')], noopGroup, noopRoute)).not.toBeNull();
    });

    it('matches /fr/404', () => {
      const r = m404([seg('fr'), seg('404')], noopGroup, noopRoute);
      expect(r).not.toBeNull();
      expect(r?.posParams?.locale?.path).toBe('fr');
    });

    it('does not match /fr/foo', () => {
      expect(m404([seg('fr'), seg('foo')], noopGroup, noopRoute)).toBeNull();
    });

    it('does not match /fr/404/extra', () => {
      expect(m404([seg('fr'), seg('404'), seg('x')], noopGroup, noopRoute)).toBeNull();
    });
  });
});
