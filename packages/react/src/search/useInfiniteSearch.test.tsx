/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { render, waitFor, fireEvent, RenderResult } from '@testing-library/react';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import { SearchService, SortSetting, FacetRequest } from '@sitecore-content-sdk/search';
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
    expect(wrapper.container.querySelector('#status')?.textContent).equal(state.status);
    expect(wrapper.container.querySelector('#loadMoreStatus')?.textContent).equal(
      state.loadMoreStatus
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
        <span id="status">{state.status}</span>
        <span id="loadMoreStatus">{state.loadMoreStatus}</span>
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
      const state = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
      });

      return renderState(state);
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
      status: 'loading',
      loadMoreStatus: 'idle',
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
        status: 'success',
        loadMoreStatus: 'idle',
      });
    });
  });

  it('should not automatically search when search is disabled', async () => {
    const TestComponent: React.FC<any> = () => {
      const [enabled, setEnabled] = useState(false);
      const state = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
        enabled,
      });

      return (
        <>
          <button id="enable" onClick={() => setEnabled(true)}>
            Enable
          </button>
          {renderState(state)}
        </>
      );
    };

    searchServiceStub.resolves({ results: [{ id: 1 }, { id: 2 }, { id: 3 }], total: 3 });

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    assertState(wrapper, {
      results: [],
      isLoading: false,
      isSuccess: false,
      isError: false,
      isLoadingMore: false,
      isLoadingMoreError: false,
      hasNextPage: false,
      error: null,
      total: 0,
      totalPages: 0,
      status: 'idle',
      loadMoreStatus: 'idle',
    });

    expect(searchServiceStub.called).to.be.false;

    fireEvent.click(wrapper.container.querySelector('#enable') as Element);

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
      status: 'loading',
      loadMoreStatus: 'idle',
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
        status: 'success',
        loadMoreStatus: 'idle',
      });
    });
  });

  it('should search when the query is changed', async () => {
    const TestComponent: React.FC<any> = () => {
      const [query, setQuery] = useState('initial');
      const state = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: query,
      });

      return (
        <>
          <button id="changeQuery" onClick={() => setQuery('updated')}>
            Change Query
          </button>
          <span id="query">Query: {query}</span>
          {renderState(state)}
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
      status: 'loading',
      loadMoreStatus: 'idle',
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
        status: 'success',
        loadMoreStatus: 'idle',
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
      status: 'loading',
      loadMoreStatus: 'idle',
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
        status: 'success',
        loadMoreStatus: 'idle',
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
      const [sort] = useState<SortSetting<Model>[]>([{ name: 'id', order: 'desc' }]);
      const state = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
        sort,
        pageSize: 20,
      });

      return renderState(state);
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
      status: 'loading',
      loadMoreStatus: 'idle',
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
        status: 'success',
        loadMoreStatus: 'idle',
      });
    });
  });

  it('should load more results', async () => {
    const TestComponent: React.FC<any> = () => {
      const state = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
      });

      return renderState(state);
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
      status: 'loading',
      loadMoreStatus: 'idle',
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
        status: 'success',
        loadMoreStatus: 'idle',
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
      status: 'success',
      loadMoreStatus: 'loading',
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
        status: 'success',
        loadMoreStatus: 'idle',
      });
    });
  });

  it('should return error when initial search fails', async () => {
    const TestComponent: React.FC<any> = () => {
      const state = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
      });

      return renderState(state);
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
      status: 'loading',
      loadMoreStatus: 'idle',
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
        status: 'error',
        loadMoreStatus: 'idle',
      });
    });
  });

  it('should return error when load more fails', async () => {
    const TestComponent: React.FC<any> = () => {
      const state = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
      });

      return renderState(state);
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
      status: 'loading',
      loadMoreStatus: 'idle',
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
        status: 'success',
        loadMoreStatus: 'idle',
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
      status: 'success',
      loadMoreStatus: 'loading',
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
        status: 'success',
        loadMoreStatus: 'error',
      });
    });
  });

  it('should return error when search index id is not provided', () => {
    const TestComponent: React.FC<any> = () => {
      const state = useInfiniteSearch<Model>({
        searchIndexId: null as unknown as string,
        query: 'test',
      });

      return renderState(state);
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    assertState(wrapper, {
      results: [],
      isLoading: false,
      isSuccess: false,
      isError: true,
      hasNextPage: false,
      isLoadingMore: false,
      isLoadingMoreError: false,
      error: new Error('useInfiniteSearch: searchIndexId is required when initializing the hook'),
      total: 0,
      totalPages: 0,
      status: 'error',
      loadMoreStatus: 'idle',
    });
  });

  it('should not execute "load more" request when a previous "load more" request is in progress', async () => {
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
      const state = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
      });

      return renderState(state);
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
      status: 'loading',
      loadMoreStatus: 'idle',
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
        status: 'success',
        loadMoreStatus: 'idle',
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
      status: 'success',
      loadMoreStatus: 'loading',
    });

    fireEvent.click(wrapper.container.querySelector('#loadMore') as Element);

    await waitFor(() => {
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
        status: 'success',
        loadMoreStatus: 'loading',
      });
    });

    resolveFirstLoadMore!({ results: loadMoreResults, total: 6 });

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
        status: 'success',
        loadMoreStatus: 'idle',
      });
    });

    expect(searchServiceStub.calledTwice).to.be.true;
  });

  it('should pass locale to the search service when provided', async () => {
    const TestComponent: React.FC<any> = () => {
      const state = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
        locale: 'fr-FR',
      });

      return renderState(state);
    };

    searchServiceStub.resolves({ results: [{ id: 1 }], total: 1 });

    render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    await waitFor(() => {
      expect(
        searchServiceStub.calledOnceWith({
          searchIndexId: '1234567890',
          keyphrase: 'test',
          limit: 10,
          offset: 0,
          sort: undefined,
          locale: 'fr-FR',
        })
      ).to.be.true;
    });
  });

  it('should pass facet config to the search service and return facets in state', async () => {
    const facetConfig: FacetRequest = { all: true };

    const TestComponent: React.FC<any> = () => {
      const state = useInfiniteSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
        facet: facetConfig,
      });

      return (
        <>
          {renderState(state)}
          <span id="facetName">{state.facets?.[0]?.name ?? 'none'}</span>
          <span id="facetValue">{state.facets?.[0]?.value?.[0]?.text?.toString() ?? 'none'}</span>
        </>
      );
    };

    searchServiceStub.resolves({
      results: [{ id: 1 }],
      total: 1,
      facets: [{ name: 'Category', value: [{ text: 'Running', count: 5 }] }],
    });

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    await waitFor(() => {
      expect(
        searchServiceStub.calledOnceWith({
          searchIndexId: '1234567890',
          keyphrase: 'test',
          limit: 10,
          offset: 0,
          sort: undefined,
          facet: facetConfig,
        })
      ).to.be.true;
    });

    await waitFor(() => {
      expect(wrapper.container.querySelector('#facetName')?.textContent).equal('Category');
      expect(wrapper.container.querySelector('#facetValue')?.textContent).equal('Running');
    });
  });
});
