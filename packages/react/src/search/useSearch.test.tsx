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
import { useSearch, UseSearchState } from './useSearch';

type Model = { id: string };

describe('useSearch', () => {
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

  const assertState = (wrapper: RenderResult, state: UseSearchState<{ id: string }>) => {
    expect(wrapper.container.querySelector('#isLoading')?.textContent).equal(
      state.isLoading ? 'true' : 'false'
    );
    expect(wrapper.container.querySelector('#isSuccess')?.textContent).equal(
      state.isSuccess ? 'true' : 'false'
    );
    expect(wrapper.container.querySelector('#isError')?.textContent).equal(
      state.isError ? 'true' : 'false'
    );
    expect(wrapper.container.querySelector('#error')?.textContent).equal(
      state.error ? state.error.message : 'null'
    );
    expect(wrapper.container.querySelector('#total')?.textContent).equal('Total: ' + state.total);
    expect(wrapper.container.querySelector('#totalPages')?.textContent).equal(
      'Pages: ' + state.totalPages
    );
    expect(wrapper.container.querySelector('#results')?.children.length).equal(
      state.results.length
    );
    state.results.forEach((result, index) => {
      expect(wrapper.container.querySelector('#results')?.children[index].textContent).equal(
        result.id
      );
    });
  };

  const renderState = (state: UseSearchState<{ id: string }>) => {
    return (
      <>
        <span id="isLoading">{state.isLoading ? 'true' : 'false'}</span>
        <span id="isSuccess">{state.isSuccess ? 'true' : 'false'}</span>
        <span id="isError">{state.isError ? 'true' : 'false'}</span>
        <span id="status">{state.status}</span>
        <span id="isPreviousData">{state.isPreviousData ? 'true' : 'false'}</span>
        <span id="total">Total: {state.total}</span>
        <span id="totalPages">Pages: {state.totalPages}</span>
        <span id="error">{state.error ? state.error.message : 'null'}</span>
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
      const state = useSearch<Model>({
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
      error: null,
      total: 0,
      totalPages: 0,
      status: 'loading',
      isPreviousData: false,
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
        error: null,
        total: 3,
        totalPages: 1,
        status: 'success',
        isPreviousData: false,
      });
    });
  });

  it('should not automatically search when search is disabled', async () => {
    const TestComponent: React.FC<any> = () => {
      const [enabled, setEnabled] = useState(false);
      const state = useSearch<Model>({
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
      error: null,
      total: 0,
      totalPages: 0,
      status: 'idle',
      isPreviousData: false,
    });

    expect(searchServiceStub.called).to.be.false;

    fireEvent.click(wrapper.container.querySelector('#enable') as Element);

    assertState(wrapper, {
      results: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      total: 0,
      totalPages: 0,
      status: 'loading',
      isPreviousData: false,
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

    await waitFor(() => {
      assertState(wrapper, {
        results: [{ id: '1' }, { id: '2' }, { id: '3' }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        total: 3,
        totalPages: 1,
        status: 'success',
        isPreviousData: false,
      });
    });
  });

  it('should search when the query is changed', async () => {
    const TestComponent: React.FC<any> = () => {
      const [query, setQuery] = useState('initial');
      const state = useSearch<Model>({
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

    // Wait for initial search to complete
    await waitFor(() => {
      assertState(wrapper, {
        results: [{ id: 'initial-1' }, { id: 'initial-2' }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        total: 2,
        totalPages: 1,
        status: 'success',
        isPreviousData: false,
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

    // Change the query
    fireEvent.click(wrapper.container.querySelector('#changeQuery') as Element);

    // Verify loading state is shown again
    assertState(wrapper, {
      results: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      total: 0,
      totalPages: 0,
      status: 'loading',
      isPreviousData: false,
    });
    expect(wrapper.container.querySelector('#query')?.textContent).equal('Query: updated');

    // Wait for updated search to complete
    await waitFor(() => {
      assertState(wrapper, {
        results: [{ id: 'updated-1' }, { id: 'updated-2' }, { id: 'updated-3' }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        total: 3,
        totalPages: 1,
        status: 'success',
        isPreviousData: false,
      });
    });

    // Verify search was called again with updated query
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

  it('should search when the page is changed', async () => {
    const TestComponent: React.FC<any> = () => {
      const [page, setPage] = useState(1);
      const state = useSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
        page: page,
        pageSize: 10,
      });

      return (
        <>
          <button id="changePage" onClick={() => setPage(2)}>
            Change Page
          </button>
          <span id="page">Page: {page}</span>
          {renderState(state)}
        </>
      );
    };

    // First search result (page 1) - returns first 10 items
    searchServiceStub.onFirstCall().resolves({
      results: [
        { id: 'page1-1' },
        { id: 'page1-2' },
        { id: 'page1-3' },
        { id: 'page1-4' },
        { id: 'page1-5' },
      ],
      total: 25, // Total items across all pages
    });

    // Second search result (page 2) - returns next 10 items
    searchServiceStub.onSecondCall().resolves({
      results: [{ id: 'page2-1' }, { id: 'page2-2' }, { id: 'page2-3' }],
      total: 25, // Same total
    });

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    // Wait for initial search (page 1) to complete
    await waitFor(() => {
      assertState(wrapper, {
        results: [
          { id: 'page1-1' },
          { id: 'page1-2' },
          { id: 'page1-3' },
          { id: 'page1-4' },
          { id: 'page1-5' },
        ],
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        total: 25,
        totalPages: 3,
        status: 'success',
        isPreviousData: false,
      });
    });

    // Verify search was called with page 1 (offset = 0)
    expect(searchServiceStub.calledOnce).to.be.true;
    expect(
      searchServiceStub.calledOnceWith({
        searchIndexId: '1234567890',
        keyphrase: 'test',
        limit: 10,
        offset: 0,
        sort: undefined,
      })
    ).to.be.true;

    // Change to page 2
    fireEvent.click(wrapper.container.querySelector('#changePage') as Element);

    // Verify loading state is shown again and page number updated
    assertState(wrapper, {
      results: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      total: 0,
      totalPages: 0,
      status: 'loading',
      isPreviousData: false,
    });
    expect(wrapper.container.querySelector('#page')?.textContent).equal('Page: 2');

    // Wait for updated search (page 2) to complete
    await waitFor(() => {
      assertState(wrapper, {
        results: [{ id: 'page2-1' }, { id: 'page2-2' }, { id: 'page2-3' }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        total: 25,
        totalPages: 3,
        status: 'success',
        isPreviousData: false,
      });
    });

    // Verify search was called again with page 2 (offset = 10)
    expect(searchServiceStub.calledTwice).to.be.true;
    expect(
      searchServiceStub.secondCall.calledWith({
        searchIndexId: '1234567890',
        keyphrase: 'test',
        limit: 10,
        offset: 10,
        sort: undefined,
      })
    ).to.be.true;
  });

  it('should return an error when the search fails', async () => {
    const TestComponent: React.FC<any> = () => {
      const state = useSearch<Model>({
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
      error: null,
      total: 0,
      totalPages: 0,
      status: 'loading',
      isPreviousData: false,
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
        error: new Error('Search failed'),
        total: 0,
        totalPages: 0,
        status: 'error',
        isPreviousData: false,
      });
    });
  });

  it('should search when custom search parameters are provided', async () => {
    const TestComponent: React.FC<any> = () => {
      const [sort] = useState<SortSetting<Model>[]>([{ name: 'id', order: 'desc' }]);
      const state = useSearch<Model>({
        searchIndexId: '1234567890',
        query: 'test',
        sort,
        pageSize: 20,
        page: 3,
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
      error: null,
      total: 0,
      totalPages: 0,
      status: 'loading',
      isPreviousData: false,
    });

    expect(
      searchServiceStub.calledOnceWith({
        searchIndexId: '1234567890',
        keyphrase: 'test',
        limit: 20,
        offset: 40,
        sort: [{ name: 'id', order: 'desc' }],
      })
    ).to.be.true;

    // Wait for async to complete and test final state
    await waitFor(() => {
      assertState(wrapper, {
        results: [{ id: '1' }, { id: '2' }, { id: '3' }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        total: 3,
        totalPages: 1,
        status: 'success',
        isPreviousData: false,
      });
    });
  });

  it('should abort the search when the component is unmounted', async () => {
    const abortSpy = sandbox.spy(AbortController.prototype, 'abort');
    let resolveSearch: (value: { results: Model[]; total: number }) => void;
    const searchPromise = new Promise<{ results: Model[]; total: number }>((resolve) => {
      resolveSearch = resolve;
    });

    searchServiceStub.returns(searchPromise);

    const TestComponent: React.FC<any> = () => {
      const state = useSearch<Model>({
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

    // Verify search was initiated and is in loading state
    expect(searchServiceStub.calledOnce).to.be.true;
    assertState(wrapper, {
      results: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      total: 0,
      totalPages: 0,
      status: 'loading',
      isPreviousData: false,
    });

    // Unmount the component - this should trigger abort
    wrapper.unmount();

    // Verify abort was called during unmount
    expect(abortSpy.calledOnce).to.be.true;

    // Now resolve the promise AFTER unmount
    // The abort signal should prevent state updates
    resolveSearch!({ results: [{ id: '1' }, { id: '2' }, { id: '3' }], total: 3 });

    expect(searchServiceStub.calledOnce).to.be.true;
  });

  it('should abort previous search when a new search is triggered', async () => {
    const abortSpy = sandbox.spy(AbortController.prototype, 'abort');

    // Create a delayed promise for the first search
    let resolveFirstSearch: (value: { results: Model[]; total: number }) => void;
    const firstSearchPromise = new Promise<{ results: Model[]; total: number }>((resolve) => {
      resolveFirstSearch = resolve;
    });

    // Second search resolves immediately
    searchServiceStub.onFirstCall().returns(firstSearchPromise);
    searchServiceStub.onSecondCall().resolves({
      results: [{ id: 'updated-1' }, { id: 'updated-2' }],
      total: 2,
    });

    const TestComponent: React.FC<any> = () => {
      const [query, setQuery] = useState('initial');
      const state = useSearch<Model>({
        searchIndexId: '1234567890',
        query: query,
      });

      return (
        <>
          <button id="changeQuery" onClick={() => setQuery('updated')}>
            Change Query
          </button>
          {renderState(state)}
        </>
      );
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    // Verify first search was initiated
    expect(searchServiceStub.calledOnce).to.be.true;
    assertState(wrapper, {
      results: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      total: 0,
      totalPages: 0,
      status: 'loading',
      isPreviousData: false,
    });

    // Trigger second search before first search completes
    fireEvent.click(wrapper.container.querySelector('#changeQuery') as Element);

    expect(searchServiceStub.calledTwice).to.be.true;

    expect(abortSpy.callCount).to.be.equal(1);

    // Wait for second search to complete
    await waitFor(() => {
      assertState(wrapper, {
        results: [{ id: 'updated-1' }, { id: 'updated-2' }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        total: 2,
        totalPages: 1,
        status: 'success',
        isPreviousData: false,
      });
    });

    // Verify second search was called with updated query
    expect(
      searchServiceStub.secondCall.calledWith({
        searchIndexId: '1234567890',
        keyphrase: 'updated',
        limit: 10,
        offset: 0,
        sort: undefined,
      })
    ).to.be.true;

    // Now resolve the first search (it was aborted, so this shouldn't affect state)
    resolveFirstSearch!({ results: [{ id: 'initial-1' }, { id: 'initial-2' }], total: 2 });

    // Verify state still shows second search results (first search was aborted)
    await waitFor(() => {
      assertState(wrapper, {
        results: [{ id: 'updated-1' }, { id: 'updated-2' }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        total: 2,
        totalPages: 1,
        status: 'success',
        isPreviousData: false,
      });
    });
  });

  it('should abort failed previous search when a new search is triggered', async () => {
    const abortSpy = sandbox.spy(AbortController.prototype, 'abort');

    // Create a delayed promise for the first search
    let rejectFirstSearch: (reason?: any) => void;
    const firstSearchPromise = new Promise<{ results: Model[]; total: number }>((_, reject) => {
      rejectFirstSearch = reject;
    });

    // Second search resolves immediately
    searchServiceStub.onFirstCall().returns(firstSearchPromise);
    searchServiceStub.onSecondCall().resolves({
      results: [{ id: 'updated-1' }, { id: 'updated-2' }],
      total: 2,
    });

    const TestComponent: React.FC<any> = () => {
      const [query, setQuery] = useState('initial');
      const state = useSearch<Model>({
        searchIndexId: '1234567890',
        query: query,
      });

      return (
        <>
          <button id="changeQuery" onClick={() => setQuery('updated')}>
            Change Query
          </button>
          {renderState(state)}
        </>
      );
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    // Verify first search was initiated
    expect(searchServiceStub.calledOnce).to.be.true;
    assertState(wrapper, {
      results: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      total: 0,
      totalPages: 0,
      status: 'loading',
      isPreviousData: false,
    });

    // Trigger second search before first search completes
    fireEvent.click(wrapper.container.querySelector('#changeQuery') as Element);

    expect(searchServiceStub.calledTwice).to.be.true;

    expect(abortSpy.callCount).to.be.equal(1);

    // Wait for second search to complete
    await waitFor(() => {
      assertState(wrapper, {
        results: [{ id: 'updated-1' }, { id: 'updated-2' }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        total: 2,
        totalPages: 1,
        status: 'success',
        isPreviousData: false,
      });
    });

    // Verify second search was called with updated query
    expect(
      searchServiceStub.secondCall.calledWith({
        searchIndexId: '1234567890',
        keyphrase: 'updated',
        limit: 10,
        offset: 0,
        sort: undefined,
      })
    ).to.be.true;

    // Now reject the first search (it was aborted, so this shouldn't affect state)
    rejectFirstSearch!(new Error('Search failed'));

    // Verify state still shows second search results (first search was aborted)
    await waitFor(() => {
      assertState(wrapper, {
        results: [{ id: 'updated-1' }, { id: 'updated-2' }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        total: 2,
        totalPages: 1,
        status: 'success',
        isPreviousData: false,
      });
    });
  });

  it('should throw an error if the search index id is not provided', () => {
    const TestComponent: React.FC<any> = () => {
      const searchParameters = useSearch<Model>({
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
    }).to.throw('useSearch: searchIndexId is required');
  });
});
