/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { buildHrefFromLinkField, resolveLinkFromField } from './link-field-utils';
import type { LinkField } from '@sitecore-content-sdk/content/layout';

describe('link-field-binding', () => {
  describe('resolveLinkFromField', () => {
    it('returns value from LinkField wrapper', () => {
      const field: LinkField = { value: { href: '/x', text: 'X' } };
      expect(resolveLinkFromField(field)).toEqual(field.value);
    });

    it('returns bare LinkFieldValue when href is set at root', () => {
      const field = { href: '/y', text: 'Y' };
      expect(resolveLinkFromField(field)).toBe(field);
    });
  });

  describe('buildHrefFromLinkField', () => {
    it('concatenates query and hash fragment', () => {
      expect(
        buildHrefFromLinkField({
          href: '/p',
          querystring: 'a=1',
          anchor: 'sec',
          linktype: 'internal',
        })
      ).toBe('/p?a=1#sec');
    });
  });
});
