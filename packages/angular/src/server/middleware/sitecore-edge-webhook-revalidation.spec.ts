/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import {
  collectSitecoreTagsFromEdgeRevalidateRequestBody,
  extractSitecoreEdgeContentId,
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
      expect(tags).toEqual(['sc:item:71b0ba07-1621-4254-aee4-429b1a970c8b:en']);
    });

    it('passes through full sc: tags in tags array', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        { tags: ['sc:loader:dictionary:default:en'] },
        { defaultLocale: 'en' }
      );
      expect(tags).toEqual(['sc:loader:dictionary:default:en']);
    });

    it('maps bare ids in tags array to item tags with defaultLocale', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        { tags: ['71B0BA0716214254AEE4429B1A970C8B'] },
        { defaultLocale: 'en' }
      );
      expect(tags).toEqual(['sc:item:71b0ba07-1621-4254-aee4-429b1a970c8b:en']);
    });

    it('lowercases entity_culture and hyphenates Edge identifiers', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        {
          updates: [
            {
              identifier: 'A52F951407774085B2A2D9E9D76EBDC9',
              entity_culture: 'ja-JP',
            },
            {
              identifier: '6CA225DB4DE84048BCC161B13027B63A-layout',
              entity_culture: 'ja-JP',
            },
            {
              identifier: '6CA225DB4DE84048BCC161B13027B63A',
              entity_culture: 'ja-JP',
            },
          ],
        },
        { defaultLocale: 'en' }
      );
      expect(tags).toEqual([
        'sc:item:a52f9514-0777-4085-b2a2-d9e9d76ebdc9:ja-jp',
        'sc:item:6ca225db-4de8-4048-bcc1-61b13027b63a:ja-jp',
      ]);
    });
  });
});
