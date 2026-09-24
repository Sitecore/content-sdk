/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { getPersonalizeTokens, shouldBypassPageFinalization } from './context-helpers';

describe('shouldBypassPageFinalization', () => {
  it('bypasses Preview and Design Library so token literals are preserved', () => {
    expect(shouldBypassPageFinalization(null)).toBe(true);
    expect(shouldBypassPageFinalization(undefined)).toBe(true);
    expect(shouldBypassPageFinalization({ mode: { isPreview: true } })).toBe(true);
    expect(shouldBypassPageFinalization({ mode: { isDesignLibrary: true } })).toBe(true);
    expect(shouldBypassPageFinalization({ mode: { isPreview: false, isDesignLibrary: false } })).toBe(
      false
    );
  });
});

describe('getPersonalizeTokens', () => {
  it('returns the trusted map, including empty, and undefined when absent', () => {
    expect(getPersonalizeTokens({ scParams: { tokens: { name: 'Ada' } } } as any)).toEqual({
      name: 'Ada',
    });
    expect(getPersonalizeTokens({ scParams: { tokens: {} } } as any)).toEqual({});
    expect(getPersonalizeTokens({ scParams: {} } as any)).toBeUndefined();
  });
});
