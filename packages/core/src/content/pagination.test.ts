import { expect } from 'chai';
import sinon from 'sinon';
import { paginateAll, PaginatedResponse, PaginationArgs } from './pagination';
import { ContentClient } from './content-client';
import { Taxonomy } from './taxonomies';

describe('pagination utility', () => {
  beforeEach(() => {
    sinon.restore();
  });

  describe('paginateAll', () => {
    it('should fetch all pages from a paginated endpoint', async () => {
      // Mock a paginated response with 3 pages
      const mockFetchPage = sinon.stub();
      mockFetchPage
        .onFirstCall()
        .resolves({
          results: [
            { id: '1', name: 'Taxonomy 1' },
            { id: '2', name: 'Taxonomy 2' },
          ],
          cursor: 'cursor1',
          hasMore: true,
        })
        .onSecondCall()
        .resolves({
          results: [
            { id: '3', name: 'Taxonomy 3' },
            { id: '4', name: 'Taxonomy 4' },
          ],
          cursor: 'cursor2',
          hasMore: true,
        })
        .onThirdCall()
        .resolves({
          results: [{ id: '5', name: 'Taxonomy 5' }],
          cursor: undefined,
          hasMore: false,
        });

      const result = await paginateAll(mockFetchPage);

      expect(mockFetchPage.callCount).to.equal(3);
      expect(mockFetchPage.firstCall.args[0]).to.deep.equal({ after: undefined, pageSize: undefined });
      expect(mockFetchPage.secondCall.args[0]).to.deep.equal({ after: 'cursor1', pageSize: undefined });
      expect(mockFetchPage.thirdCall.args[0]).to.deep.equal({ after: 'cursor2', pageSize: undefined });

      expect(result).to.deep.equal([
        { id: '1', name: 'Taxonomy 1' },
        { id: '2', name: 'Taxonomy 2' },
        { id: '3', name: 'Taxonomy 3' },
        { id: '4', name: 'Taxonomy 4' },
        { id: '5', name: 'Taxonomy 5' },
      ]);
    });

    it('should respect pageSize option', async () => {
      const mockFetchPage = sinon.stub().resolves({
        results: [{ id: '1' }],
        cursor: undefined,
        hasMore: false,
      });

      await paginateAll(mockFetchPage, { pageSize: 50 });

      expect(mockFetchPage.firstCall.args[0]).to.deep.equal({ after: undefined, pageSize: 50 });
    });

    it('should respect maxPages option', async () => {
      const mockFetchPage = sinon.stub();
      mockFetchPage
        .onFirstCall()
        .resolves({
          results: [{ id: '1' }],
          cursor: 'cursor1',
          hasMore: true,
        })
        .onSecondCall()
        .resolves({
          results: [{ id: '2' }],
          cursor: 'cursor2',
          hasMore: true,
        });

      const result = await paginateAll(mockFetchPage, { maxPages: 2 });

      expect(mockFetchPage.callCount).to.equal(2);
      expect(result).to.deep.equal([{ id: '1' }, { id: '2' }]);
    });

    it('should handle single page responses', async () => {
      const mockFetchPage = sinon.stub().resolves({
        results: [{ id: '1' }, { id: '2' }],
        cursor: undefined,
        hasMore: false,
      });

      const result = await paginateAll(mockFetchPage);

      expect(mockFetchPage.callCount).to.equal(1);
      expect(result).to.deep.equal([{ id: '1' }, { id: '2' }]);
    });

    it('should handle empty responses', async () => {
      const mockFetchPage = sinon.stub().resolves({
        results: [],
        cursor: undefined,
        hasMore: false,
      });

      const result = await paginateAll(mockFetchPage);

      expect(mockFetchPage.callCount).to.equal(1);
      expect(result).to.deep.equal([]);
    });

    it('should throw error for invalid response structure', async () => {
      const mockFetchPage = sinon.stub().resolves({
        results: 'not an array',
        hasMore: true,
      });

      try {
        await paginateAll(mockFetchPage);
        expect.fail('Expected error to be thrown');
      } catch (error) {
        expect(error.message).to.include('Invalid response: expected results to be an array');
      }
    });

    it('should throw error for missing hasMore field', async () => {
      const mockFetchPage = sinon.stub().resolves({
        results: [{ id: '1' }],
        cursor: 'cursor1',
      });

      try {
        await paginateAll(mockFetchPage);
        expect.fail('Expected error to be thrown');
      } catch (error) {
        expect(error.message).to.include('Invalid response: expected hasMore to be a boolean');
      }
    });

    it('should stop pagination when receiving fewer items than pageSize', async () => {
      const mockFetchPage = sinon.stub();
      mockFetchPage
        .onFirstCall()
        .resolves({
          results: [{ id: '1' }, { id: '2' }],
          cursor: 'cursor1',
          hasMore: true,
        })
        .onSecondCall()
        .resolves({
          results: [{ id: '3' }], // Only 1 item when pageSize is 2
          cursor: 'cursor2',
          hasMore: true,
        });

      const result = await paginateAll(mockFetchPage, { pageSize: 2 });

      expect(mockFetchPage.callCount).to.equal(2);
      expect(result).to.deep.equal([{ id: '1' }, { id: '2' }, { id: '3' }]);
    });
  });

  describe('integration with ContentClient', () => {
    it('should work with getTaxonomies method', async () => {
      // This test demonstrates how the utility would be used with the actual ContentClient
      const mockGetTaxonomies = sinon.stub();
      mockGetTaxonomies
        .onFirstCall()
        .resolves({
          results: [{ system: { id: '1', name: 'Taxonomy 1' } }],
          cursor: 'cursor1',
          hasMore: true,
        })
        .onSecondCall()
        .resolves({
          results: [{ system: { id: '2', name: 'Taxonomy 2' } }],
          cursor: undefined,
          hasMore: false,
        });

      const result = await paginateAll(mockGetTaxonomies);

      expect(mockGetTaxonomies.callCount).to.equal(2);
      expect(result).to.deep.equal([
        { system: { id: '1', name: 'Taxonomy 1' } },
        { system: { id: '2', name: 'Taxonomy 2' } },
      ]);
    });
  });
}); 