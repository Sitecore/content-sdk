import React, { useEffect, useState } from 'react';
import { describe, it } from 'mocha';
import { createSandbox, SinonSandbox, SinonStub, spy } from 'sinon';
import { SearchService } from '@sitecore-content-sdk/search';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { LayoutServicePageState } from '@sitecore-content-sdk/core/layout';
import {
  SitecoreProviderReactContext,
  SitecoreProviderState,
} from '../components/SitecoreProvider';
import { useSitecore } from '../enhancers/withSitecore';
import { getOffset, useSearchService } from './utils';

describe('search utils', () => {
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

  beforeEach(() => {
    sandbox = createSandbox();
    searchServiceStub = sandbox.stub(SearchService.prototype, 'search');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('useSearchService', () => {
    it('should return a search service', async () => {
      const TestComponent: React.FC<any> = () => {
        const { api } = useSitecore();
        const searchService = useSearchService();
        const [results, setResults] = useState<{ id: string }[]>([]);
        const [total, setTotal] = useState(0);

        useEffect(() => {
          if (!searchService) return;

          const fetchResults = async () => {
            const searchResults = await searchService?.search<{ id: string }>({
              searchIndexId: '1234567890',
              keyphrase: 'test',
            });
            setResults(searchResults?.results || []);
            setTotal(searchResults?.total || 0);
          };
          fetchResults();
        }, [searchService]);

        return (
          <>
            <span id="contextId">
              {api?.edge.contextId} {api?.edge.edgeUrl}
            </span>
            <span id="total">Total: {total}</span>
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

      await waitFor(() => {
        expect(wrapper.container.querySelector('#contextId')?.textContent).equal('id url');
        expect(wrapper.container.querySelector('#total')?.textContent).equal('Total: 3');
        expect(wrapper.container.querySelector('#results')?.children.length).equal(3);
        expect(wrapper.container.querySelector('#results')?.children[0].textContent).equal('1');
        expect(wrapper.container.querySelector('#results')?.children[1].textContent).equal('2');
        expect(wrapper.container.querySelector('#results')?.children[2].textContent).equal('3');
      });
    });
  });

  describe('getOffset', () => {
    it('should return the correct offset', () => {
      expect(getOffset(1, 10)).equal(0);
      expect(getOffset(2, 10)).equal(10);
      expect(getOffset(3, 10)).equal(20);
    });
  });
});
