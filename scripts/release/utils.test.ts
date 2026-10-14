/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { branchPrefix, holdsVersions } from './utils';

const NEXTJS = '@sitecore-content-sdk/nextjs';
const released = [{ name: NEXTJS, version: '2.5.0' }];

describe('holdsVersions', () => {
  it('is true when the ref holds every released version or a newer one', () => {
    expect(holdsVersions(released, new Map([[NEXTJS, '2.5.0']]))).toBe(true);
    expect(holdsVersions(released, new Map([[NEXTJS, '2.6.0']]))).toBe(true);
    expect(holdsVersions(released, new Map([[NEXTJS, '2.4.0']]))).toBe(false);
    expect(holdsVersions(released, new Map())).toBe(false);
  });
});

describe('branchPrefix', () => {
  it('takes release/<name> from release branches and the whole name otherwise', () => {
    expect(branchPrefix('release/limited/nextjs-20261013120000')).toBe('release/limited');
    expect(branchPrefix('release/legacy/nextjs/v2')).toBe('release/legacy');
    expect(branchPrefix('release/1.x.x')).toBe('release/1.x.x');
    expect(branchPrefix('dev')).toBe('dev');
    expect(branchPrefix('feature/x')).toBe('feature/x');
  });
});
