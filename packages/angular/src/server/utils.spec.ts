import { describe, it, expect } from 'vitest';
import { EDITING_PARAMS_HEADER } from '../editing/constants';
import { matches, isEditingPreview } from './utils';

describe('matches', () => {
  describe('string patterns (exact match)', () => {
    it('matches an identical path', () => {
      expect(matches('/about', '/about')).toBe(true);
    });

    it('does not match a different path', () => {
      expect(matches('/about', '/contact')).toBe(false);
    });

    it('does not match on a trailing slash difference', () => {
      expect(matches('/about/', '/about')).toBe(false);
    });

    it('does not match a sub-path (no prefix semantics)', () => {
      expect(matches('/about/team', '/about')).toBe(false);
    });
  });

  describe('regex patterns', () => {
    it('matches when the regex tests true', () => {
      expect(matches('/api/data', /^\/api(\/|$)/)).toBe(true);
      expect(matches('/api', /^\/api(\/|$)/)).toBe(true);
    });

    it('is anchored: /api regex does not match /api-docs', () => {
      expect(matches('/api-docs', /^\/api(\/|$)/)).toBe(false);
    });

    it('matches a static-file path via an extension regex', () => {
      expect(matches('/assets/logo.png', /\.[^/]+$/)).toBe(true);
      expect(matches('/about', /\.[^/]+$/)).toBe(false);
    });
  });
});

describe('isEditingPreview', () => {
  it('returns false when no headers are provided', () => {
    expect(isEditingPreview()).toBe(false);
  });

  it('returns false when the editing params header is absent', () => {
    expect(isEditingPreview({ other: '1' })).toBe(false);
  });

  it('returns true when the editing params header is present', () => {
    expect(isEditingPreview({ [EDITING_PARAMS_HEADER]: '{"site":"a"}' })).toBe(true);
  });
});
