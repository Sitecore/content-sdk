import { expect } from 'chai';
import {
  collectSitecoreTagsFromEdgeRevalidateRequestBody,
  extractSitecoreEdgeContentId,
  isSitecoreDictionaryEntryUpdate,
  resolveSitecoreDictionarySiteNameFromIdentifier,
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

  describe('isSitecoreDictionaryEntryUpdate', () => {
    it('should match "DictionaryEntry" case-insensitively', () => {
      expect(isSitecoreDictionaryEntryUpdate('DictionaryEntry')).to.equal(true);
    });

    it('should return false for other entity definitions or missing values', () => {
      expect(isSitecoreDictionaryEntryUpdate('Item')).to.equal(false);
      expect(isSitecoreDictionaryEntryUpdate(undefined)).to.equal(false);
      expect(isSitecoreDictionaryEntryUpdate('')).to.equal(false);
    });
  });

  describe('resolveSitecoreDictionarySiteNameFromIdentifier', () => {
    it('should resolve the configured site name that prefixes the identifier', () => {
      expect(
        resolveSitecoreDictionarySiteNameFromIdentifier(
          'iki-vercel-site-1a1905a154414da3883fd9ca7074b128-test 5555-en-gb',
          ['iki-vercel-site', 'other-site']
        )
      ).to.equal('iki-vercel-site');
    });

    it('should prefer the longest matching site name to avoid overlapping prefixes', () => {
      expect(
        resolveSitecoreDictionarySiteNameFromIdentifier(
          'my-site-2-1a1905a154414da3883fd9ca7074b128-value-en',
          ['my-site', 'my-site-2']
        )
      ).to.equal('my-site-2');
    });

    it('should return undefined when no configured site name matches', () => {
      expect(
        resolveSitecoreDictionarySiteNameFromIdentifier(
          'unknown-site-1a1905a154414da3883fd9ca7074b128-value-en',
          ['iki-vercel-site']
        )
      ).to.equal(undefined);
    });

    it('should return undefined when siteNames is empty', () => {
      expect(
        resolveSitecoreDictionarySiteNameFromIdentifier('iki-vercel-site-abc-value-en', [])
      ).to.equal(undefined);
    });

    it('should resolve "test-2" for an identifier that really belongs to "test-2", not "test"', () => {
      expect(
        resolveSitecoreDictionarySiteNameFromIdentifier(
          'test-2-1a1905a154414da3883fd9ca7074b128-value-en',
          ['test', 'test-2']
        )
      ).to.equal('test-2');
    });

    it('should resolve "test" for an identifier that really belongs to "test", not "test-2"', () => {
      expect(
        resolveSitecoreDictionarySiteNameFromIdentifier(
          'test-1a1905a154414da3883fd9ca7074b128-value-en',
          ['test', 'test-2']
        )
      ).to.equal('test');
    });

    it('should be independent of input order for overlapping site names', () => {
      const identifier = 'test-2-1a1905a154414da3883fd9ca7074b128-value-en';
      expect(resolveSitecoreDictionarySiteNameFromIdentifier(identifier, ['test', 'test-2'])).to.equal(
        'test-2'
      );
      expect(resolveSitecoreDictionarySiteNameFromIdentifier(identifier, ['test-2', 'test'])).to.equal(
        'test-2'
      );
    });

    it('should not match a site name that is a prefix without a separating hyphen (e.g. "test" vs "test2")', () => {
      expect(
        resolveSitecoreDictionarySiteNameFromIdentifier(
          'test2-1a1905a154414da3883fd9ca7074b128-value-en',
          ['test', 'test2']
        )
      ).to.equal('test2');
    });

    it('should not match when the identifier equals a site name with no trailing separator', () => {
      expect(resolveSitecoreDictionarySiteNameFromIdentifier('test', ['test'])).to.equal(undefined);
    });

    it('should match case-insensitively and return the configured casing of the site name', () => {
      expect(
        resolveSitecoreDictionarySiteNameFromIdentifier(
          'TEST-SITE-1a1905a154414da3883fd9ca7074b128-value-en',
          ['Test-Site']
        )
      ).to.equal('Test-Site');
    });

    it('should ignore a blank/empty configured site name instead of matching everything', () => {
      expect(
        resolveSitecoreDictionarySiteNameFromIdentifier(
          'iki-vercel-site-1a1905a154414da3883fd9ca7074b128-value-en',
          ['', '   ', 'iki-vercel-site']
        )
      ).to.equal('iki-vercel-site');

      expect(
        resolveSitecoreDictionarySiteNameFromIdentifier('anything-at-all', ['', '   '])
      ).to.equal(undefined);
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
      expect(tags).to.deep.equal(['sc:item:71b0ba07-1621-4254-aee4-429b1a970c8b:en']);
    });

    it('should use defaultLocale when entity_culture is missing', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        {
          updates: [{ identifier: '71B0BA0716214254AEE4429B1A970C8B' }],
        },
        { defaultLocale: 'da' }
      );
      expect(tags).to.deep.equal(['sc:item:71b0ba07-1621-4254-aee4-429b1a970c8b:da']);
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
        'sc:item:a52f9514-0777-4085-b2a2-d9e9d76ebdc9:ja-jp',
        'sc:item:6ca225db-4de8-4048-bcc1-61b13027b63a:ja-jp',
      ]);
    });

    it('should dedupe across updates', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        {
          updates: [
            { identifier: '71B0BA0716214254AEE4429B1A970C8B', entity_culture: 'en' },
            { identifier: '71B0BA0716214254AEE4429B1A970C8B-media', entity_culture: 'en' },
          ],
        },
        { defaultLocale: 'en' }
      );
      expect(tags).to.have.length(1);
    });

    it('should map a Dictionary entry update to sc:dict for the resolved site, not sc:item', () => {
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
      expect(tags).to.deep.equal(['sc:dict:iki-vercel-site:en-gb']);
    });

    it('should not add a dictionary tag for a Dictionary entry update with no matching site', () => {
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
      expect(tags).to.deep.equal([]);
    });

    it('should not add a dictionary tag for a non-dictionary update, even with siteNames configured', () => {
      const tags = collectSitecoreTagsFromEdgeRevalidateRequestBody(
        {
          updates: [{ identifier: '71B0BA0716214254AEE4429B1A970C8B', entity_culture: 'en' }],
        },
        { defaultLocale: 'en', siteNames: ['iki-vercel-site'] }
      );
      expect(tags).to.deep.equal(['sc:item:71b0ba0716214254aee4429b1a970c8b:en']);
    });
  });
});
