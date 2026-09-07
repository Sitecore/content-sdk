/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { render, waitFor, fireEvent, RenderResult } from '@testing-library/react';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import { SearchService } from '@sitecore-content-sdk/search';
import {
  SitecoreProviderReactContext,
  SitecoreProviderState,
} from '../components/SitecoreProvider';
import { useSuggest, UseSuggestState } from './useSuggest';

type Model = { id: string };

describe('useSuggest', () => {
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

  let suggestServiceStub: SinonStub;

  beforeEach(function () {
    sandbox = createSandbox();
    suggestServiceStub = sandbox.stub(SearchService.prototype, 'suggest');
  });

  afterEach(() => {
    sandbox.restore();
  });

  const assertState = (wrapper: RenderResult, state: UseSuggestState<{ id: string }>) => {
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
    expect(wrapper.container.querySelector('#querySuggestions')?.children.length).equal(
      state.querySuggestions.length
    );
    state.querySuggestions.forEach((item, index) => {
      expect(
        wrapper.container.querySelector('#querySuggestions')?.children[index].textContent
      ).equal(item.text);
    });
    expect(wrapper.container.querySelector('#previewResults')?.children.length).equal(
      state.previewResults.length
    );
    state.previewResults.forEach((result, index) => {
      expect(
        wrapper.container.querySelector('#previewResults')?.children[index].textContent
      ).equal(result.id);
    });
  };

  const renderState = (state: UseSuggestState<{ id: string }>) => {
    return (
      <>
        <span id="isLoading">{state.isLoading ? 'true' : 'false'}</span>
        <span id="isSuccess">{state.isSuccess ? 'true' : 'false'}</span>
        <span id="isError">{state.isError ? 'true' : 'false'}</span>
        <span id="status">{state.status}</span>
        <span id="isPreviousData">{state.isPreviousData ? 'true' : 'false'}</span>
        <span id="error">{state.error ? state.error.message : 'null'}</span>
        <ul id="querySuggestions">
          {state.querySuggestions.map((item) => (
            <li key={item.queryPlusText}>{item.text}</li>
          ))}
        </ul>
        <ul id="previewResults">
          {state.previewResults.map((result) => (
            <li key={result.id}>{result.id}</li>
          ))}
        </ul>
      </>
    );
  };

  it('should suggest', async () => {
    const TestComponent: React.FC<any> = () => {
      const state = useSuggest<Model>({
        searchIndexId: '1234567890',
        query: 'run',
      });

      return renderState(state);
    };

    suggestServiceStub.resolves({
      querySuggestions: [{ text: 'running', queryPlusText: 'running shoes' }],
      previewResults: [{ id: 'doc-1' }, { id: 'doc-2' }],
    });

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    assertState(wrapper, {
      querySuggestions: [],
      previewResults: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      status: 'loading',
      isPreviousData: false,
    });

    expect(
      suggestServiceStub.calledOnceWith({
        searchIndexId: '1234567890',
        keyphrase: 'run',
      })
    ).to.be.true;

    await waitFor(() => {
      assertState(wrapper, {
        querySuggestions: [{ text: 'running', queryPlusText: 'running shoes' }],
        previewResults: [{ id: 'doc-1' }, { id: 'doc-2' }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        status: 'success',
        isPreviousData: false,
      });
    });
  });

  it('should not automatically suggest when disabled', async () => {
    const TestComponent: React.FC<any> = () => {
      const [enabled, setEnabled] = useState(false);
      const state = useSuggest<Model>({
        searchIndexId: '1234567890',
        query: 'run',
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

    suggestServiceStub.resolves({
      querySuggestions: [{ text: 'running', queryPlusText: 'running' }],
      previewResults: [],
    });

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    assertState(wrapper, {
      querySuggestions: [],
      previewResults: [],
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      status: 'idle',
      isPreviousData: false,
    });

    expect(suggestServiceStub.called).to.be.false;

    fireEvent.click(wrapper.container.querySelector('#enable') as Element);

    await waitFor(() => {
      expect(
        suggestServiceStub.calledOnceWith({
          searchIndexId: '1234567890',
          keyphrase: 'run',
        })
      ).to.be.true;
    });
  });

  it('should not send a request when query is empty', async () => {
    const TestComponent: React.FC<any> = () => {
      const state = useSuggest<Model>({
        searchIndexId: '1234567890',
        query: '   ',
      });

      return renderState(state);
    };

    render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    await waitFor(() => {
      expect(suggestServiceStub.called).to.be.false;
    });
  });

  it('should suggest when the query is changed', async () => {
    const TestComponent: React.FC<any> = () => {
      const [query, setQuery] = useState('run');
      const state = useSuggest<Model>({
        searchIndexId: '1234567890',
        query,
      });

      return (
        <>
          <button id="changeQuery" onClick={() => setQuery('sho')}>
            Change Query
          </button>
          {renderState(state)}
        </>
      );
    };

    suggestServiceStub.onFirstCall().resolves({
      querySuggestions: [{ text: 'running', queryPlusText: 'running' }],
      previewResults: [{ id: 'doc-1' }],
    });
    suggestServiceStub.onSecondCall().resolves({
      querySuggestions: [{ text: 'shoes', queryPlusText: 'shoes' }],
      previewResults: [{ id: 'doc-2' }],
    });

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    await waitFor(() => {
      assertState(wrapper, {
        querySuggestions: [{ text: 'running', queryPlusText: 'running' }],
        previewResults: [{ id: 'doc-1' }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        status: 'success',
        isPreviousData: false,
      });
    });

    fireEvent.click(wrapper.container.querySelector('#changeQuery') as Element);

    await waitFor(() => {
      assertState(wrapper, {
        querySuggestions: [{ text: 'shoes', queryPlusText: 'shoes' }],
        previewResults: [{ id: 'doc-2' }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        status: 'success',
        isPreviousData: false,
      });
    });

    expect(suggestServiceStub.secondCall.calledWith({ searchIndexId: '1234567890', keyphrase: 'sho' }))
      .to.be.true;
  });

  it('should return an error when the suggest request fails', async () => {
    const TestComponent: React.FC<any> = () => {
      const state = useSuggest<Model>({
        searchIndexId: '1234567890',
        query: 'run',
      });

      return renderState(state);
    };

    suggestServiceStub.rejects(new Error('Suggest failed'));

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    await waitFor(() => {
      assertState(wrapper, {
        querySuggestions: [],
        previewResults: [],
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: new Error('Suggest failed'),
        status: 'error',
        isPreviousData: false,
      });
    });
  });

  it('should return error when search index id is not provided', () => {
    const TestComponent: React.FC<any> = () => {
      const state = useSuggest<Model>({
        searchIndexId: null as unknown as string,
        query: 'run',
      });

      return renderState(state);
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    assertState(wrapper, {
      querySuggestions: [],
      previewResults: [],
      isLoading: false,
      isSuccess: false,
      isError: true,
      error: new Error('useSuggest: searchIndexId is required when initializing the hook'),
      status: 'error',
      isPreviousData: false,
    });
  });

  it('should pass locale to the suggest service when provided', async () => {
    const TestComponent: React.FC<any> = () => {
      const state = useSuggest<Model>({
        searchIndexId: '1234567890',
        query: 'run',
        locale: 'fr-FR',
      });

      return renderState(state);
    };

    suggestServiceStub.resolves({ querySuggestions: [], previewResults: [] });

    render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    await waitFor(() => {
      expect(
        suggestServiceStub.calledOnceWith({
          searchIndexId: '1234567890',
          keyphrase: 'run',
          locale: 'fr-FR',
        })
      ).to.be.true;
    });
  });

  it('should trim query before sending the suggest request', async () => {
    const TestComponent: React.FC<any> = () => {
      const state = useSuggest<Model>({
        searchIndexId: '1234567890',
        query: '  run  ',
      });

      return renderState(state);
    };

    suggestServiceStub.resolves({ querySuggestions: [], previewResults: [] });

    render(
      <SitecoreProviderReactContext.Provider value={defaultProviderState}>
        <TestComponent />
      </SitecoreProviderReactContext.Provider>
    );

    await waitFor(() => {
      expect(
        suggestServiceStub.calledOnceWith({
          searchIndexId: '1234567890',
          keyphrase: 'run',
        })
      ).to.be.true;
    });
  });
});
