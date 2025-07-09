// Simple test runner for pagination utility
const { expect } = require('chai');
const sinon = require('sinon');

// Mock the debug module
const debugMock = {
  content: console.log
};

// Mock the pagination module
const { paginateAll, PaginatedResponse, PaginationArgs } = require('./src/content/pagination');

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
});

// Run the tests
const Mocha = require('mocha');
const mocha = new Mocha({
  reporter: 'spec',
  timeout: 5000
});

mocha.addFile(__filename);
mocha.run((failures) => {
  process.exit(failures ? 1 : 0);
}); 