/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { render, waitFor, fireEvent, RenderResult } from '@testing-library/react';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import { SearchService, SortSetting } from '@sitecore-content-sdk/search';
import {
  SitecoreProviderReactContext,
  SitecoreProviderState,
} from '../components/SitecoreProvider';
import { useInfiniteSearch, UseInfiniteSearchState } from './useInfiniteSearch';

type Model = { id: string | number };

describe('useInfiniteSearch', () => {
  let sandbox: SinonSandbox;

  const defaultProviderState = {
    api: {
      edge: {
        contextId: 'id',
        edgeUrl: 'url',
        clientContextId: 'clientId',
      },
    },
  } as SitecoreProviderState;

  let searchServiceStub: SinonStub;

  beforeEach(function () {
    sandbox = createSandbox();
    searchServiceStub = sandbox.stub(SearchService.prototype, 'search');
  });

  afterEach(() => {
    sandbox.restore();
  });

  const assertState = (
    wrapper: RenderResult,
    state: Omit<UseInfiniteSearchState<Model>, 'loadMore'>
  ) => {
    expect(wrapper.container.querySelector('#isLoading')?.textContent).equal(
      state.isLoading ? 'true' : 'false'
    );
    expect(wrapper.container.querySelector('#isSuccess')?.textContent).equal(
      state.isSuccess ? 'true' : 'false'
    );
    expect(wrapper.container.querySelector('#isError')?.textContent).equal(
      state.isError ? 'true' : 'false'
    );
    expect(wrapper.container.querySelector('#isLoadingMore')?.textContent).equal(
      state.isLoadingMore ? 'true' : 'false'
    );
    expect(wrapper.container.querySelector('#isLoadingMoreError')?.textContent).equal(
      state.isLoadingMoreError ? 'true' : 'false'
    );
    expect(wrapper.container.querySelector('#hasNextPage')?.textContent).equal(
      state.hasNextPage ? 'true' : 'false'
    );
    expect(wrapper.container.querySelector('#total')?.textContent).equal('Total: ' + state.total);
    expect(wrapper.container.querySelector('#totalPages')?.textContent).equal(
      'Pages: ' + state.totalPages
    );
    expect(wrapper.container.querySelector('#error')?.textContent).equal(
      state.error ? state.error.message : 'null'
    );
    state.results.forEach((result, index) => {
      expect(wrapper.container.querySelector('#results')?.children[index].textContent).equal(
        result.id.toString()
      );
    });
  };

  const renderState = (state: UseInfiniteSearchState<Model>) => {
    return (
      <>
        <span id="isLoading">{state.isLoading ? 'true' : 'false'}</span>
        <span id="isSuccess">{state.isSuccess ? 'true' : 'false'}</span>
        <span id="isError">{state.isError ? 'true' : 'false'}</span>
        <span id="isLoadingMore">{state.isLoadingMore ? 'true' : 'false'}</span>
        <span id="isLoadingMoreError">{state.isLoadingMoreError ? 'true' : 'false'}</span>
        <span id="hasNextPage">{state.hasNextPage ? 'true' : 'false'}</span>
        <span id="total">Total: {state.total}</span>
        <span id="totalPages">Pages: {state.totalPages}</span>
        <span id="error">{state.error ? state.error.message : 'null'}</span>
        <button id="loadMore" onClick={state.loadMore}>
          Load More
        </button>
        <ul id="results">
          {state.results.map((result) => (
            <li key={result.id}>{result.id}</li>
          ))}
        </ul>
      </>
    );
  };

  it('should search', async () => {
    const TestComponent: React.FC<any> = () => {
      const {
        results,
        loadMore,
        hasNextPage,
        isLoading,
        isSuccess,
        isError,
        isLoadingMore,
        isLoadingMoreError,
        total,
        totalPages,
        error,
      } = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
      });

      return renderState({
        results,
        isLoading,
        isSuccess,
        isError,
        isLoadingMore,
        isLoadingMoreError,
        hasNextPage,
        total,
        totalPages,
        error,
        loadMore,
      });
    };

    searchServiceStub.resolves({ results: [{ id: 1 }, { id: 2 }, { id: 3 }], total: 3 });

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    assertState(wrapper, {
      results: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      isLoadingMore: false,
      isLoadingMoreError: false,
      hasNextPage: false,
      error: null,
      total: 0,
      totalPages: 0,
    });

    expect(
      searchServiceStub.calledOnceWith({
        searchIndexId: '1234567890',
        keyphrase: 'test',
        limit: 10,
        offset: 0,
        sort: undefined,
      })
    ).to.be.true;

    // Wait for async to complete and test final state
    await waitFor(() => {
      assertState(wrapper, {
        results: [{ id: '1' }, { id: '2' }, { id: '3' }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        isLoadingMore: false,
        isLoadingMoreError: false,
        hasNextPage: false,
        error: null,
        total: 3,
        totalPages: 1,
      });
    });
  });

  it('should search when the query is changed', async () => {
    const TestComponent: React.FC<any> = () => {
      const [query, setQuery] = useState('initial');
      const {
        results,
        loadMore,
        hasNextPage,
        isLoading,
        isSuccess,
        isError,
        isLoadingMore,
        isLoadingMoreError,
        total,
        totalPages,
        error,
      } = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: query,
      });

      return (
        <>
          <button id="changeQuery" onClick={() => setQuery('updated')}>
            Change Query
          </button>
          <span id="query">Query: {query}</span>
          {renderState({
            results,
            loadMore,
            hasNextPage,
            isLoading,
            isSuccess,
            isError,
            isLoadingMore,
            isLoadingMoreError,
            total,
            totalPages,
            error,
          })}
        </>
      );
    };

    // First search result
    searchServiceStub.onFirstCall().resolves({
      results: [{ id: 'initial-1' }, { id: 'initial-2' }],
      total: 2,
    });

    // Second search result (after query change)
    searchServiceStub.onSecondCall().resolves({
      results: [{ id: 'updated-1' }, { id: 'updated-2' }, { id: 'updated-3' }],
      total: 3,
    });

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    assertState(wrapper, {
      results: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      isLoadingMore: false,
      isLoadingMoreError: false,
      hasNextPage: false,
      error: null,
      total: 0,
      totalPages: 0,
    });

    // Wait for initial search to complete
    await waitFor(() => {
      assertState(wrapper, {
        results: [{ id: 'initial-1' }, { id: 'initial-2' }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        isLoadingMore: false,
        isLoadingMoreError: false,
        hasNextPage: false,
        error: null,
        total: 2,
        totalPages: 1,
      });
    });

    // Verify search was called with initial query
    expect(
      searchServiceStub.firstCall.calledWith({
        searchIndexId: '1234567890',
        keyphrase: 'initial',
        limit: 10,
        offset: 0,
        sort: undefined,
      })
    ).to.be.true;

    fireEvent.click(wrapper.container.querySelector('#changeQuery') as Element);

    assertState(wrapper, {
      results: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      isLoadingMore: false,
      isLoadingMoreError: false,
      hasNextPage: false,
      error: null,
      total: 0,
      totalPages: 0,
    });

    expect(wrapper.container.querySelector('#query')?.textContent).equal('Query: updated');

    await waitFor(() => {
      assertState(wrapper, {
        results: [{ id: 'updated-1' }, { id: 'updated-2' }, { id: 'updated-3' }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        isLoadingMore: false,
        isLoadingMoreError: false,
        hasNextPage: false,
        error: null,
        total: 3,
        totalPages: 1,
      });
    });

    expect(
      searchServiceStub.secondCall.calledWith({
        searchIndexId: '1234567890',
        keyphrase: 'updated',
        limit: 10,
        offset: 0,
        sort: undefined,
      })
    ).to.be.true;
  });

  it('should search when custom search parameters are provided', async () => {
    const TestComponent: React.FC<any> = () => {
      const [sort] = useState<SortSetting<'id'>[]>([{ name: 'id', order: 'desc' }]);
      const {
        results,
        loadMore,
        hasNextPage,
        isLoading,
        isSuccess,
        isError,
        isLoadingMore,
        isLoadingMoreError,
        total,
        totalPages,
        error,
      } = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
        sort,
        pageSize: 20,
      });

      return renderState({
        results,
        isLoading,
        isSuccess,
        isError,
        isLoadingMore,
        isLoadingMoreError,
        hasNextPage,
        total,
        totalPages,
        error,
        loadMore,
      });
    };

    searchServiceStub.resolves({ results: [{ id: 1 }, { id: 2 }, { id: 3 }], total: 3 });

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    // Test initial state (before async completes)
    assertState(wrapper, {
      results: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      isLoadingMore: false,
      isLoadingMoreError: false,
      hasNextPage: false,
      error: null,
      total: 0,
      totalPages: 0,
    });

    expect(
      searchServiceStub.calledOnceWith({
        searchIndexId: '1234567890',
        keyphrase: 'test',
        limit: 20,
        offset: 0,
        sort: [{ name: 'id', order: 'desc' }],
      })
    ).to.be.true;

    // Wait for async to complete and test final state
    await waitFor(() => {
      assertState(wrapper, {
        results: [{ id: 1 }, { id: 2 }, { id: 3 }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        isLoadingMore: false,
        isLoadingMoreError: false,
        hasNextPage: false,
        error: null,
        total: 3,
        totalPages: 1,
      });
    });
  });

  it('should load more results', async () => {
    const TestComponent: React.FC<any> = () => {
      const {
        results,
        loadMore,
        hasNextPage,
        isLoading,
        isSuccess,
        isError,
        isLoadingMore,
        isLoadingMoreError,
        total,
        totalPages,
        error,
      } = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
      });

      return renderState({
        results,
        isLoading,
        isSuccess,
        isError,
        isLoadingMore,
        isLoadingMoreError,
        hasNextPage,
        total,
        totalPages,
        error,
        loadMore,
      });
    };

    const firstCallResults = Array.from({ length: 10 }, (_, index) => ({ id: index + 1 }));
    const secondCallResults = Array.from({ length: 10 }, (_, index) => ({ id: index + 11 }));

    searchServiceStub
      .onFirstCall()
      .resolves({
        results: firstCallResults,
        total: 20,
      })
      .onSecondCall()
      .resolves({
        results: secondCallResults,
        total: 20,
      });

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    assertState(wrapper, {
      results: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      isLoadingMore: false,
      isLoadingMoreError: false,
      hasNextPage: false,
      error: null,
      total: 0,
      totalPages: 0,
    });

    expect(
      searchServiceStub.calledOnceWith({
        searchIndexId: '1234567890',
        keyphrase: 'test',
        limit: 10,
        offset: 0,
        sort: undefined,
      })
    ).to.be.true;

    // Wait for async to complete and test final state
    await waitFor(() => {
      assertState(wrapper, {
        results: firstCallResults,
        isLoading: false,
        isSuccess: true,
        isError: false,
        isLoadingMore: false,
        isLoadingMoreError: false,
        hasNextPage: true,
        error: null,
        total: 20,
        totalPages: 2,
      });
    });

    fireEvent.click(wrapper.container.querySelector('#loadMore') as Element);

    // Should preserve the first call results while loading more
    assertState(wrapper, {
      results: firstCallResults,
      isLoading: false,
      isSuccess: true,
      isError: false,
      isLoadingMore: true,
      isLoadingMoreError: false,
      hasNextPage: true,
      total: 20,
      totalPages: 2,
      error: null,
    });

    await waitFor(() => {
      assertState(wrapper, {
        results: [...firstCallResults, ...secondCallResults],
        isLoading: false,
        isSuccess: true,
        isError: false,
        isLoadingMore: false,
        isLoadingMoreError: false,
        hasNextPage: false,
        total: 20,
        totalPages: 2,
        error: null,
      });
    });
  });

  it('should return error when initial search fails', async () => {
    const TestComponent: React.FC<any> = () => {
      const {
        results,
        loadMore,
        hasNextPage,
        isLoading,
        isSuccess,
        isError,
        isLoadingMore,
        isLoadingMoreError,
        total,
        totalPages,
        error,
      } = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
      });

      return renderState({
        results,
        isLoading,
        isSuccess,
        isError,
        isLoadingMore,
        isLoadingMoreError,
        hasNextPage,
        total,
        totalPages,
        error,
        loadMore,
      });
    };

    searchServiceStub.rejects(new Error('Search failed'));

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    assertState(wrapper, {
      results: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      isLoadingMore: false,
      isLoadingMoreError: false,
      hasNextPage: false,
      error: null,
      total: 0,
      totalPages: 0,
    });

    expect(
      searchServiceStub.calledOnceWith({
        searchIndexId: '1234567890',
        keyphrase: 'test',
        limit: 10,
        offset: 0,
        sort: undefined,
      })
    ).to.be.true;

    // Wait for async to complete and test final state
    await waitFor(() => {
      assertState(wrapper, {
        results: [],
        isLoading: false,
        isSuccess: false,
        isError: true,
        isLoadingMore: false,
        isLoadingMoreError: false,
        hasNextPage: false,
        error: new Error('Search failed'),
        total: 0,
        totalPages: 0,
      });
    });
  });

  it('should return error when load more fails', async () => {
    const TestComponent: React.FC<any> = () => {
      const {
        results,
        loadMore,
        hasNextPage,
        isLoading,
        isSuccess,
        isError,
        isLoadingMore,
        isLoadingMoreError,
        total,
        totalPages,
        error,
      } = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
      });

      return renderState({
        results,
        isLoading,
        isSuccess,
        isError,
        isLoadingMore,
        isLoadingMoreError,
        hasNextPage,
        total,
        totalPages,
        error,
        loadMore,
      });
    };

    const firstCallResults = Array.from({ length: 10 }, (_, index) => ({ id: index + 1 }));

    searchServiceStub
      .onFirstCall()
      .resolves({
        results: firstCallResults,
        total: 20,
      })
      .onSecondCall()
      .rejects(new Error('Load more failed'));

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    assertState(wrapper, {
      results: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      isLoadingMore: false,
      isLoadingMoreError: false,
      hasNextPage: false,
      error: null,
      total: 0,
      totalPages: 0,
    });

    expect(
      searchServiceStub.calledOnceWith({
        searchIndexId: '1234567890',
        keyphrase: 'test',
        limit: 10,
        offset: 0,
        sort: undefined,
      })
    ).to.be.true;

    // Wait for async to complete and test final state
    await waitFor(() => {
      assertState(wrapper, {
        results: firstCallResults,
        isLoading: false,
        isSuccess: true,
        isError: false,
        isLoadingMore: false,
        isLoadingMoreError: false,
        hasNextPage: true,
        error: null,
        total: 20,
        totalPages: 2,
      });
    });

    fireEvent.click(wrapper.container.querySelector('#loadMore') as Element);

    // Should preserve the first call results while loading more
    assertState(wrapper, {
      results: firstCallResults,
      isLoading: false,
      isSuccess: true,
      isError: false,
      isLoadingMore: true,
      isLoadingMoreError: false,
      hasNextPage: true,
      total: 20,
      totalPages: 2,
      error: null,
    });

    await waitFor(() => {
      assertState(wrapper, {
        results: firstCallResults,
        isLoading: false,
        isSuccess: true,
        isError: false,
        isLoadingMore: false,
        isLoadingMoreError: true,
        hasNextPage: true,
        total: 20,
        totalPages: 2,
        error: new Error('Load more failed'),
      });
    });
  });

  it('should throw an error if the search index id is not provided', () => {
    const TestComponent: React.FC<any> = () => {
      const searchParameters = useInfiniteSearch<Model>({
        searchIndexId: '',
        query: 'test',
      });

      return JSON.stringify(searchParameters);
    };

    expect(() => {
      render(
        <SitecoreProviderReactContext.Provider value={defaultProviderState}>
          <TestComponent />
        </SitecoreProviderReactContext.Provider>
      );
    }).to.throw('useInfiniteSearch: searchIndexId is required');
  });

  it('should abort previous load more request when a new load more request is triggered', async () => {
    const abortSpy = sandbox.spy(AbortController.prototype, 'abort');

    let resolveFirstLoadMore: (value: { results: Model[]; total: number }) => void;
    const firstLoadMorePromise = new Promise<{ results: Model[]; total: number }>((resolve) => {
      resolveFirstLoadMore = resolve;
    });

    const initialResults = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const loadMoreResults = [{ id: 4 }, { id: 5 }, { id: 6 }];

    searchServiceStub
      .onFirstCall()
      .resolves({
        results: initialResults,
        total: 6,
      })
      .onSecondCall()
      .returns(firstLoadMorePromise)
      .onThirdCall()
      .resolves({
        results: loadMoreResults,
        total: 6,
      });

    const TestComponent: React.FC<any> = () => {
      const {
        results,
        loadMore,
        hasNextPage,
        isLoading,
        isSuccess,
        isError,
        isLoadingMore,
        isLoadingMoreError,
        total,
        totalPages,
        error,
      } = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
      });

      return renderState({
        results,
        isLoading,
        isSuccess,
        isError,
        isLoadingMore,
        isLoadingMoreError,
        hasNextPage,
        total,
        totalPages,
        error,
        loadMore,
      });
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    assertState(wrapper, {
      results: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      isLoadingMore: false,
      isLoadingMoreError: false,
      hasNextPage: false,
      error: null,
      total: 0,
      totalPages: 0,
    });

    await waitFor(() => {
      assertState(wrapper, {
        results: initialResults,
        isLoading: false,
        isSuccess: true,
        isError: false,
        isLoadingMore: false,
        isLoadingMoreError: false,
        hasNextPage: true,
        error: null,
        total: 6,
        totalPages: 1,
      });
    });

    fireEvent.click(wrapper.container.querySelector('#loadMore') as Element);

    assertState(wrapper, {
      results: initialResults,
      isLoading: false,
      isSuccess: true,
      isError: false,
      isLoadingMore: true,
      isLoadingMoreError: false,
      hasNextPage: true,
      error: null,
      total: 6,
      totalPages: 1,
    });

    fireEvent.click(wrapper.container.querySelector('#loadMore') as Element);

    await waitFor(() => {
      assertState(wrapper, {
        results: [...initialResults, ...loadMoreResults],
        isLoading: false,
        isSuccess: true,
        isError: false,
        isLoadingMore: false,
        isLoadingMoreError: false,
        hasNextPage: false,
        error: null,
        total: 6,
        totalPages: 1,
      });
    });

    resolveFirstLoadMore!({ results: loadMoreResults, total: 6 });

    // Verify that state is unchanged since the first load more request was aborted
    assertState(wrapper, {
      results: [...initialResults, ...loadMoreResults],
      isLoading: false,
      isSuccess: true,
      isError: false,
      isLoadingMore: false,
      isLoadingMoreError: false,
      hasNextPage: false,
      error: null,
      total: 6,
      totalPages: 1,
    });

    expect(abortSpy.calledTwice).to.be.true;
    expect(searchServiceStub.calledThrice).to.be.true;
  });

  it('should abort failed previous load more request when a new load more request is triggered', async () => {
    const abortSpy = sandbox.spy(AbortController.prototype, 'abort');

    const initialResults = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const loadMoreResults = [{ id: 4 }, { id: 5 }, { id: 6 }];

    // Create a delayed promise for the first loadMore that will fail
    let rejectFirstLoadMore: (reason?: any) => void;
    const firstLoadMorePromise = new Promise<{ results: Model[]; total: number }>((_, reject) => {
      rejectFirstLoadMore = reject;
    });

    // First search succeeds, first loadMore fails (delayed), second loadMore succeeds
    searchServiceStub
      .onFirstCall()
      .resolves({
        results: initialResults,
        total: 6,
      })
      .onSecondCall()
      .returns(firstLoadMorePromise)
      .onThirdCall()
      .resolves({
        results: loadMoreResults,
        total: 6,
      });

    const TestComponent: React.FC<any> = () => {
      const {
        results,
        loadMore,
        hasNextPage,
        isLoading,
        isSuccess,
        isError,
        isLoadingMore,
        isLoadingMoreError,
        total,
        totalPages,
        error,
      } = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
      });

      return renderState({
        results,
        isLoading,
        isSuccess,
        isError,
        isLoadingMore,
        isLoadingMoreError,
        hasNextPage,
        total,
        totalPages,
        error,
        loadMore,
      });
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    // Wait for initial search to complete
    await waitFor(() => {
      assertState(wrapper, {
        results: initialResults,
        isLoading: false,
        isSuccess: true,
        isError: false,
        isLoadingMore: false,
        isLoadingMoreError: false,
        hasNextPage: true,
        error: null,
        total: 6,
        totalPages: 1,
      });
    });

    // Trigger first loadMore (will fail but is delayed)
    fireEvent.click(wrapper.container.querySelector('#loadMore') as Element);

    // Verify first loadMore was initiated
    expect(searchServiceStub.calledTwice).to.be.true;
    assertState(wrapper, {
      results: initialResults,
      isLoading: false,
      isSuccess: true,
      isError: false,
      isLoadingMore: true,
      isLoadingMoreError: false,
      hasNextPage: true,
      error: null,
      total: 6,
      totalPages: 1,
    });

    // Trigger second loadMore before first loadMore completes (fails)
    fireEvent.click(wrapper.container.querySelector('#loadMore') as Element);

    expect(searchServiceStub.calledThrice).to.be.true;

    expect(abortSpy.callCount).to.be.equal(2);

    await waitFor(() => {
      assertState(wrapper, {
        results: [...initialResults, ...loadMoreResults],
        isLoading: false,
        isSuccess: true,
        isError: false,
        isLoadingMore: false,
        isLoadingMoreError: false,
        hasNextPage: false,
        error: null,
        total: 6,
        totalPages: 1,
      });
    });

    rejectFirstLoadMore!(new Error('Load more failed'));

    // Verify state still shows second loadMore results (first loadMore was aborted)
    assertState(wrapper, {
      results: [...initialResults, ...loadMoreResults],
      isLoading: false,
      isSuccess: true,
      isError: false,
      isLoadingMore: false,
      isLoadingMoreError: false,
      hasNextPage: false,
      error: null,
      total: 6,
      totalPages: 1,
    });
  });
});
