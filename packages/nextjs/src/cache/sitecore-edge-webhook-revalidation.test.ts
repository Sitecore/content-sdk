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
      expect(tags).to.deep.equal(['sc:item:71b0ba07-1621-4254-aee4-429b1a970c8b:en:latest']);
    });

    it('should use defaultLocale when entity_culture is missing', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        {
          updates: [{ identifier: '71B0BA0716214254AEE4429B1A970C8B' }],
        },
        { defaultLocale: 'da' }
      );
      expect(tags).to.deep.equal(['sc:item:71b0ba07-1621-4254-aee4-429b1a970c8b:da:latest']);
    });

    it('should lowercase entity_culture and hyphenate Edge identifiers', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        {
          invocation_id: 'a56e4689-63be-4eb3-bbd4-a709c65819dc',
          updates: [
            {
              identifier: 'A52F951407774085B2A2D9E9D76EBDC9',
              entity_definition: 'Item',
              operation: 'Update',
              entity_culture: 'ja-JP',
            },
            {
              identifier: '6CA225DB4DE84048BCC161B13027B63A-layout',
              entity_definition: 'LayoutData',
              operation: 'Update',
              entity_culture: 'ja-JP',
            },
            {
              identifier: '6CA225DB4DE84048BCC161B13027B63A',
              entity_definition: 'Item',
              operation: 'Update',
              entity_culture: 'ja-JP',
            },
          ],
          continues: false,
        },
        { defaultLocale: 'en' }
      );
      expect(tags).to.deep.equal([
        'sc:item:a52f9514-0777-4085-b2a2-d9e9d76ebdc9:ja-jp:latest',
        'sc:item:6ca225db-4de8-4048-bcc1-61b13027b63a:ja-jp:latest',
      ]);
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
      expect(tags).to.deep.equal(['sc:item:71b0ba07-1621-4254-aee4-429b1a970c8b:en:latest']);
    });

    it('should dedupe across updates and tags', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        {
          updates: [
            { identifier: '71B0BA0716214254AEE4429B1A970C8B', entity_culture: 'en' },
            { identifier: '71B0BA0716214254AEE4429B1A970C8B-media', entity_culture: 'en' },
          ],
          tags: ['sc:item:71b0ba07-1621-4254-aee4-429b1a970c8b:en:latest'],
        },
        { defaultLocale: 'en' }
      );
      expect(tags).to.have.length(1);
    });
  });
});
