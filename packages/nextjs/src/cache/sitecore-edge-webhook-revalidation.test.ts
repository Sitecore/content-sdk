import { expect } from 'chai';
import {
  collectSitecoreTagsFromEdgeRevalidateRequestBody,
  extractSitecoreEdgeContentId,
} from './sitecore-edge-webhook-revalidation';

describe('sitecore-edge-webhook-revalidation', () => {
  describe('extractSitecoreEdgeContentId', () => {
    it('should strip -media suffix', () => {
      expect(extractSitecoreEdgeContentId('71B0BA0716214254AEE4429B1A970C8B-media')).to.equal(
        '71B0BA0716214254AEE4429B1A970C8B'
      );
    });

    it('should strip -layout suffix case-insensitively', () => {
      expect(extractSitecoreEdgeContentId('71B0BA0716214254AEE4429B1A970C8B-LAYOUT')).to.equal(
        '71B0BA0716214254AEE4429B1A970C8B'
      );
    });

    it('should return trimmed base id', () => {
      expect(extractSitecoreEdgeContentId('  {abc}  ')).to.equal('{abc}');
    });

    it('should return empty for non-string', () => {
      expect(extractSitecoreEdgeContentId(null as unknown as string)).to.equal('');
    });
  });

  describe('collectSitecoreTagsFromEdgeRevalidateRequestBody', () => {
    it('should map updates to sc:item tags using entity_culture', () => {
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
      expect(tags).to.deep.equal(['sc:item:71b0ba0716214254aee4429b1a970c8b:en:latest']);
    });

    it('should use defaultLocale when entity_culture is missing', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        {
          updates: [{ identifier: '71B0BA0716214254AEE4429B1A970C8B' }],
        },
        { defaultLocale: 'da' }
      );
      expect(tags).to.deep.equal(['sc:item:71b0ba0716214254aee4429b1a970c8b:da:latest']);
    });

    it('should pass through full sc: tags in tags array', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        {
          tags: ['sc:dict:default:en'],
        },
        { defaultLocale: 'en' }
      );
      expect(tags).to.deep.equal(['sc:dict:default:en']);
    });

    it('should map bare ids in tags array to item tags with defaultLocale', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        {
          tags: ['71B0BA0716214254AEE4429B1A970C8B'],
        },
        { defaultLocale: 'en' }
      );
      expect(tags).to.deep.equal(['sc:item:71b0ba0716214254aee4429b1a970c8b:en:latest']);
    });

    it('should dedupe across updates and tags', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        {
          updates: [
            { identifier: '71B0BA0716214254AEE4429B1A970C8B', entity_culture: 'en' },
            { identifier: '71B0BA0716214254AEE4429B1A970C8B-media', entity_culture: 'en' },
          ],
          tags: ['sc:item:71b0ba0716214254aee4429b1a970c8b:en:latest'],
        },
        { defaultLocale: 'en' }
      );
      expect(tags).to.have.length(1);
    });
  });
});
