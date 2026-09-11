/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import {
  collectSitecoreTagsFromEdgeRevalidateRequestBody,
  extractSitecoreEdgeContentId,
  isSitecoreDictionaryEntryUpdate,
  resolveSitecoreDictionarySiteNameFromIdentifier,
} from './sitecore-edge-webhook-revalidation';

describe('sitecore-edge-webhook-revalidation', () => {
  describe('extractSitecoreEdgeContentId', () => {
    it('strips -media and -layout suffixes', () => {
      expect(extractSitecoreEdgeContentId('71B0BA0716214254AEE4429B1A970C8B-media')).toBe(
        '71B0BA0716214254AEE4429B1A970C8B'
      );
      expect(extractSitecoreEdgeContentId('71B0BA0716214254AEE4429B1A970C8B-LAYOUT')).toBe(
        '71B0BA0716214254AEE4429B1A970C8B'
      );
    });
  });

  describe('isSitecoreDictionaryEntryUpdate', () => {
    it('matches "DictionaryEntry" case-insensitively', () => {
      expect(isSitecoreDictionaryEntryUpdate('DictionaryEntry')).toBe(true);
      expect(isSitecoreDictionaryEntryUpdate('dictionaryentry')).toBe(true);
    });

    it('returns false for other entity definitions or missing values', () => {
      expect(isSitecoreDictionaryEntryUpdate('Item')).toBe(false);
      expect(isSitecoreDictionaryEntryUpdate(undefined)).toBe(false);
    });
  });

  describe('resolveSitecoreDictionarySiteNameFromIdentifier', () => {
    it('resolves the configured site name that prefixes the identifier', () => {
      expect(
        resolveSitecoreDictionarySiteNameFromIdentifier(
          'iki-vercel-site-1a1905a154414da3883fd9ca7074b128-test 5555-en-gb',
          ['iki-vercel-site', 'other-site']
        )
      ).toBe('iki-vercel-site');
    });

    it('prefers the longest matching site name to avoid overlapping prefixes', () => {
      expect(
        resolveSitecoreDictionarySiteNameFromIdentifier(
          'test-2-1a1905a154414da3883fd9ca7074b128-value-en',
          ['test', 'test-2']
        )
      ).toBe('test-2');
      // and doesn't steal a real match belonging to the shorter name
      expect(
        resolveSitecoreDictionarySiteNameFromIdentifier(
          'test-1a1905a154414da3883fd9ca7074b128-value-en',
          ['test', 'test-2']
        )
      ).toBe('test');
    });

    it('returns undefined when no configured site name matches', () => {
      expect(
        resolveSitecoreDictionarySiteNameFromIdentifier(
          'unknown-site-1a1905a154414da3883fd9ca7074b128-value-en',
          ['iki-vercel-site']
        )
      ).toBeUndefined();
    });

    it('returns undefined when siteNames is empty', () => {
      expect(
        resolveSitecoreDictionarySiteNameFromIdentifier('iki-vercel-site-abc-value-en', [])
      ).toBeUndefined();
    });
  });

  describe('collectSitecoreTagsFromEdgeRevalidateRequestBody', () => {
    it('maps updates to sc:item tags using entity_culture', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        {
          updates: [
            {
              identifier: '71B0BA0716214254AEE4429B1A970C8B-media',
              entity_culture: 'en',
            },
          ],
        },
        { defaultLocale: 'en' }
      );
      expect(tags).toEqual(['sc:item:71b0ba0716214254aee4429b1a970c8b:en']);
    });

    it('maps a Dictionary entry update to sc:dict for the resolved site, not sc:item', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        {
          updates: [
            {
              identifier: 'iki-vercel-site-1a1905a154414da3883fd9ca7074b128-test 5555-en-gb',
              entity_definition: 'DictionaryEntry',
              operation: 'Update',
              entity_culture: 'en-GB',
            },
          ],
        },
        { defaultLocale: 'en', siteNames: ['iki-vercel-site'] }
      );
      expect(tags).toEqual(['sc:dict:iki-vercel-site:en-gb']);
    });

    it('does not add a dictionary tag for a Dictionary entry update with no matching site', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        {
          updates: [
            {
              identifier: 'unknown-site-1a1905a154414da3883fd9ca7074b128-test 5555-en-gb',
              entity_definition: 'DictionaryEntry',
              entity_culture: 'en-GB',
            },
          ],
        },
        { defaultLocale: 'en', siteNames: ['iki-vercel-site'] }
      );
      expect(tags).toEqual([]);
    });

    it('does not add a dictionary tag for a non-dictionary update, even with siteNames configured', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        {
          updates: [{ identifier: '71B0BA0716214254AEE4429B1A970C8B', entity_culture: 'en' }],
        },
        { defaultLocale: 'en', siteNames: ['iki-vercel-site'] }
      );
      expect(tags).toEqual(['sc:item:71b0ba0716214254aee4429b1a970c8b:en']);
    });
  });
});
