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
      expect(tags).toEqual(['sc:item:71b0ba0716214254aee4429b1a970c8b:en:latest']);
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
      expect(tags).toEqual(['sc:item:71b0ba0716214254aee4429b1a970c8b:en:latest']);
    });
  });
});
