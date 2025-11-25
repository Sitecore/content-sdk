/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { createSandbox, SinonSandbox, SinonStub, spy } from 'sinon';
import { SearchService } from '@sitecore-content-sdk/search';
import { LayoutServicePageState } from '@sitecore-content-sdk/core/layout';
import {
  SitecoreProviderReactContext,
  SitecoreProviderState,
} from '../components/SitecoreProvider';
import { useSearch } from './useSearch';

describe.only('useSearch', () => {
  let sandbox: SinonSandbox;

  const testComponentProps: SitecoreProviderState = {
    page: {
      layout: {
        sitecore: {
          context: {},
          route: null,
        },
      },
      locale: 'en',
      mode: {
        name: LayoutServicePageState.Normal,
        isNormal: true,
        isPreview: false,
        isEditing: false,
        isDesignLibrary: false,
        designLibrary: {
          isVariantGeneration: false,
        },
      },
    },
    api: {
      edge: {
        contextId: 'id',
        edgeUrl: 'url',
        clientContextId: 'clientId',
      },
      local: {
        apiKey: 'apiKey',
        apiHost: 'apiHost',
        path: 'path',
      },
    },
    setPage: spy(),
  };

  let searchServiceStub: SinonStub;

  beforeEach(function () {
    this.timeout(2555555555);
    sandbox = createSandbox();
    searchServiceStub = sandbox.stub(SearchService.prototype, 'search');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return the correct search results', async () => {
    const TestComponent: React.FC<any> = () => {
      const { results, total, isLoading, isEmpty, totalPages, error } = useSearch({
        searchIndexId: '1234567890',
        query: 'test',
      });

      return (
        <>
          <span id="isLoading">{isLoading ? 'loading' : 'loaded'}</span>
          <span id="isEmpty">{isEmpty ? 'empty' : 'not-empty'}</span>
          <span id="error">{error ? 'error' : 'no-error'}</span>
          <span id="total">Total: {total}</span>
          <span id="totalPages">Pages: {totalPages}</span>
          <ul id="results">
            {results.map((result) => (
              <li key={result.id as string}>{result.id}</li>
            ))}
          </ul>
        </>
      );
    };

    searchServiceStub.resolves({ results: [{ id: 1 }, { id: 2 }, { id: 3 }], total: 3 });

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={testComponentProps}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    // Test initial state (before async completes)
    expect(wrapper.container.querySelector('#isLoading')?.textContent).equal('loading');
    expect(wrapper.container.querySelector('#isEmpty')?.textContent).equal('empty');
    expect(wrapper.container.querySelector('#error')?.textContent).equal('no-error');
    expect(wrapper.container.querySelector('#total')?.textContent).equal('Total: 0');
    expect(wrapper.container.querySelector('#totalPages')?.textContent).equal('Pages: 0');
    expect(wrapper.container.querySelector('#results')?.children.length).equal(0);

    // Wait for async to complete and test final state
    await waitFor(() => {
      expect(wrapper.container.querySelector('#isLoading')?.textContent).equal('loaded');
      expect(wrapper.container.querySelector('#isEmpty')?.textContent).equal('not-empty');
      expect(wrapper.container.querySelector('#error')?.textContent).equal('no-error');
      expect(wrapper.container.querySelector('#total')?.textContent).equal('Total: 3');
      expect(wrapper.container.querySelector('#totalPages')?.textContent).equal('Pages: 1');
      expect(wrapper.container.querySelector('#results')?.children.length).equal(3);
      expect(wrapper.container.querySelector('#results')?.children[0].textContent).equal('1');
      expect(wrapper.container.querySelector('#results')?.children[1].textContent).equal('2');
      expect(wrapper.container.querySelector('#results')?.children[2].textContent).equal('3');
    });
  });

  it('should return the correct search results when the query is changed', async () => {
    const TestComponent: React.FC<any> = () => {
      const [query, setQuery] = useState('initial');
      const { results, total, isLoading, isEmpty } = useSearch({
        searchIndexId: '1234567890',
        query: query,
      });

      return (
        <>
          <button id="changeQuery" onClick={() => setQuery('updated')}>
            Change Query
          </button>
          <span id="query">Query: {query}</span>
          <span id="isLoading">{isLoading ? 'loading' : 'loaded'}</span>
          <span id="isEmpty">{isEmpty ? 'empty' : 'not-empty'}</span>
          <span id="total">Total: {total}</span>
          <ul id="results">
            {results.map((result) => (
              <li key={result.id as string}>{result.id}</li>
            ))}
          </ul>
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
      <SitecoreProviderReactContext.Provider value={testComponentProps}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    // Wait for initial search to complete
    await waitFor(() => {
      expect(wrapper.container.querySelector('#isLoading')?.textContent).equal('loaded');
      expect(wrapper.container.querySelector('#total')?.textContent).equal('Total: 2');
      expect(wrapper.container.querySelector('#results')?.children.length).equal(2);
      expect(wrapper.container.querySelector('#results')?.children[0].textContent).equal(
        'initial-1'
      );
      expect(wrapper.container.querySelector('#results')?.children[1].textContent).equal(
        'initial-2'
      );
    });

    // Verify search was called with initial query
    expect(searchServiceStub.calledOnce).to.be.true;
    expect(searchServiceStub.firstCall.args[0].keyphrase).equal('initial');

    // Change the query
    fireEvent.click(wrapper.container.querySelector('#changeQuery') as Element);

    // Verify loading state is shown again
    expect(wrapper.container.querySelector('#isLoading')?.textContent).equal('loading');
    expect(wrapper.container.querySelector('#query')?.textContent).equal('Query: updated');

    // Wait for updated search to complete
    await waitFor(() => {
      expect(wrapper.container.querySelector('#isLoading')?.textContent).equal('loaded');
      expect(wrapper.container.querySelector('#total')?.textContent).equal('Total: 3');
      expect(wrapper.container.querySelector('#results')?.children.length).equal(3);
      expect(wrapper.container.querySelector('#results')?.children[0].textContent).equal(
        'updated-1'
      );
      expect(wrapper.container.querySelector('#results')?.children[1].textContent).equal(
        'updated-2'
      );
      expect(wrapper.container.querySelector('#results')?.children[2].textContent).equal(
        'updated-3'
      );
    });

    // Verify search was called again with updated query
    expect(searchServiceStub.calledTwice).to.be.true;
    expect(searchServiceStub.secondCall.args[0].keyphrase).equal('updated');
  });

  it('should return the correct search results when the page is changed', async () => {
    const TestComponent: React.FC<any> = () => {
      const [page, setPage] = useState(1);
      const { results, total, isLoading, totalPages } = useSearch({
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
          <span id="isLoading">{isLoading ? 'loading' : 'loaded'}</span>
          <span id="total">Total: {total}</span>
          <span id="totalPages">Total Pages: {totalPages}</span>
          <ul id="results">
            {results.map((result) => (
              <li key={result.id as string}>{result.id}</li>
            ))}
          </ul>
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
      <SitecoreProviderReactContext.Provider value={testComponentProps}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    // Wait for initial search (page 1) to complete
    await waitFor(() => {
      expect(wrapper.container.querySelector('#isLoading')?.textContent).equal('loaded');
      expect(wrapper.container.querySelector('#total')?.textContent).equal('Total: 25');
      expect(wrapper.container.querySelector('#totalPages')?.textContent).equal('Total Pages: 3');
      expect(wrapper.container.querySelector('#results')?.children.length).equal(5);
      expect(wrapper.container.querySelector('#results')?.children[0].textContent).equal('page1-1');
      expect(wrapper.container.querySelector('#results')?.children[4].textContent).equal('page1-5');
    });

    // Verify search was called with page 1 (offset = 0)
    expect(searchServiceStub.calledOnce).to.be.true;
    expect(searchServiceStub.firstCall.args[0].offset).equal(0);
    expect(searchServiceStub.firstCall.args[0].limit).equal(10);

    // Change to page 2
    fireEvent.click(wrapper.container.querySelector('#changePage') as Element);

    // Verify loading state is shown again and page number updated
    expect(wrapper.container.querySelector('#isLoading')?.textContent).equal('loading');
    expect(wrapper.container.querySelector('#page')?.textContent).equal('Page: 2');

    // Wait for updated search (page 2) to complete
    await waitFor(() => {
      expect(wrapper.container.querySelector('#isLoading')?.textContent).equal('loaded');
      expect(wrapper.container.querySelector('#total')?.textContent).equal('Total: 25');
      expect(wrapper.container.querySelector('#totalPages')?.textContent).equal('Total Pages: 3');
      expect(wrapper.container.querySelector('#results')?.children.length).equal(3);
      expect(wrapper.container.querySelector('#results')?.children[0].textContent).equal('page2-1');
      expect(wrapper.container.querySelector('#results')?.children[1].textContent).equal('page2-2');
      expect(wrapper.container.querySelector('#results')?.children[2].textContent).equal('page2-3');
    });

    // Verify search was called again with page 2 (offset = 10)
    expect(searchServiceStub.calledTwice).to.be.true;
    expect(searchServiceStub.secondCall.args[0].offset).equal(10); // pageSize * (page - 1) = 10 * (2 - 1) = 10
    expect(searchServiceStub.secondCall.args[0].limit).equal(10);
  });
});
