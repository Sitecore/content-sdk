/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { expect } from 'chai';
import { assert, createSandbox, SinonSandbox, SinonStub } from 'sinon';
import proxyquire from 'proxyquire';
import type { Document } from '@sitecore-content-sdk/content/atoms';

describe('StudioComponentServerWrapper', () => {
  let sandbox: SinonSandbox;

  let module: any;
  let StudioComponentServerWrapper: any;

  let fetcherGetStub: SinonStub;
  let StudioComponentWrapperStub: SinonStub;
  let consoleWarnStub: SinonStub;
  let consoleErrorStub: SinonStub;
  let resolveEdgeUrlStub: SinonStub;

  const sampleDocument: Document = {
    name: 'hero',
    root: 'test',
    elements: {
      test: { type: 'Text', props: { content: 'Hello' }, children: [] },
    },
  };

  beforeEach(() => {
    sandbox = createSandbox();

    fetcherGetStub = sandbox.stub().resolves({ data: JSON.stringify(sampleDocument) });
    StudioComponentWrapperStub = sandbox
      .stub()
      .returns(React.createElement('div', { 'data-test': 'wrapper' }));
    consoleWarnStub = sandbox.stub(console, 'warn');
    consoleErrorStub = sandbox.stub(console, 'error');
    resolveEdgeUrlStub = sandbox.stub().returns('https://edge.example.com');

    module = proxyquire('./StudioComponentServerWrapper', {
      '@sitecore-content-sdk/core': {
        NativeDataFetcher: class {
          get: SinonStub;
          constructor() {
            this.get = fetcherGetStub;
          }
        },
        getAtomsCssCompiler: () => null,
      },
      '@sitecore-content-sdk/core/tools': {
        resolveEdgeUrl: resolveEdgeUrlStub,
      },
      '@sitecore-content-sdk/content': {
        debug: { layout: undefined },
      },
      '../../atoms/extract-document-classes': {
        extractDocumentClasses: () => [],
      },
      './StudioComponentWrapper': {
        StudioComponentWrapper: StudioComponentWrapperStub,
      },
    });

    StudioComponentServerWrapper = module.StudioComponentServerWrapper;

    process.env.SITECORE_EDGE_PLATFORM_HOSTNAME = 'https://edge.example.com';
  });

  afterEach(() => {
    sandbox.restore();
    delete process.env.SITECORE_EDGE_PLATFORM_HOSTNAME;
  });

  describe('early returns', () => {
    it('returns null when componentRef is empty string', async () => {
      const result = await StudioComponentServerWrapper({ componentRef: '' });
      expect(result).to.be.null;
    });

    it('returns null when componentRef is undefined', async () => {
      const result = await StudioComponentServerWrapper({ componentRef: undefined as any });
      expect(result).to.be.null;
    });

    it('returns null when no path can be extracted from componentRef', async () => {
      const result = await StudioComponentServerWrapper({
        componentRef: 'some/path/variant1',
        fieldNames: 'nonexistent',
      });
      // 'nonexistent' does not match 'variant1' and there is no 'default' segment
      expect(result).to.be.null;
      assert.calledWithMatch(
        consoleWarnStub,
        'StudioComponentServerWrapper: failed to extract path'
      );
    });
  });

  describe('path extraction (extractVariantPathFromComponentRef)', () => {
    it('uses the path whose last segment matches fieldNames', async () => {
      const result = await StudioComponentServerWrapper({
        componentRef: 'org/components/hero/mobile | org/components/hero/desktop',
        fieldNames: 'desktop',
      });

      expect(result).to.not.be.null;
      // Ensure fetcher was called with the desktop path
      const calledUrl: string = fetcherGetStub.firstCall.args[0];
      expect(calledUrl).to.include('desktop');
    });

    it('falls back to the "default" variant when fieldNames does not match', async () => {
      const result = await StudioComponentServerWrapper({
        componentRef: 'org/components/hero/default | org/components/hero/mobile',
        fieldNames: 'desktop',
      });

      expect(result).to.not.be.null;
      const calledUrl: string = fetcherGetStub.firstCall.args[0];
      expect(calledUrl).to.include('default');
    });

    it('uses "default" fieldNames when fieldNames prop is omitted', async () => {
      const result = await StudioComponentServerWrapper({
        componentRef: 'org/components/hero/default',
      });

      expect(result).to.not.be.null;
      const calledUrl: string = fetcherGetStub.firstCall.args[0];
      expect(calledUrl).to.include('default');
    });

    it('returns null and warns when no path matches and no default exists', async () => {
      const result = await StudioComponentServerWrapper({
        componentRef: 'org/components/hero/mobile',
        fieldNames: 'desktop',
      });

      expect(result).to.be.null;
      assert.calledWithMatch(
        consoleWarnStub,
        'StudioComponentServerWrapper: failed to extract path'
      );
    });
  });

  describe('fetchDocument — URL construction', () => {
    it('prepends /mms/ to a relative path that starts with /', async () => {
      await StudioComponentServerWrapper({ componentRef: '/components/hero/default' });

      const calledUrl: string = fetcherGetStub.firstCall.args[0];
      expect(calledUrl).to.include('/mms/components/hero/default');
    });

    it('prepends /mms/ to a relative path without a leading /', async () => {
      await StudioComponentServerWrapper({ componentRef: 'components/hero/default' });

      const calledUrl: string = fetcherGetStub.firstCall.args[0];
      expect(calledUrl).to.include('/mms/components/hero/default');
    });
  });

  describe('fetchDocument — fetch errors', () => {
    it('returns null and errors when fetcher.get throws', async () => {
      fetcherGetStub.rejects(new Error('network error'));

      const result = await StudioComponentServerWrapper({
        componentRef: 'components/hero/default',
      });

      expect(result).to.be.null;
      assert.calledWithMatch(
        consoleErrorStub,
        'StudioComponentServerWrapper: failed to fetch component layout'
      );
    });

    it('returns null and errors when response body is not valid JSON', async () => {
      fetcherGetStub.resolves({ data: 'not-json{{' });

      const result = await StudioComponentServerWrapper({
        componentRef: 'components/hero/default',
      });

      expect(result).to.be.null;
      assert.calledWithMatch(
        consoleErrorStub,
        'StudioComponentServerWrapper: failed to parse component layout response'
      );
    });
  });

  describe('fetchDocument — path validation', () => {
    it('renders when fieldNames matches the variant segment in componentRef', async () => {
      const result = await StudioComponentServerWrapper({
        componentRef: 'org/components/hero/nonexistent',
        fieldNames: 'nonexistent',
      });

      expect(result).to.not.be.null;
      assert.calledOnce(fetcherGetStub);
      const wrapper = React.Children.toArray(result.props.children).find(
        (child: any) => child && child.type === StudioComponentWrapperStub
      ) as React.ReactElement;
      expect(wrapper).to.not.be.undefined;
      expect(wrapper.props.document).to.deep.equal({
        ...sampleDocument,
        state: { fields: undefined, params: undefined },
      });
    });

    it('returns null and errors when URL resolution fails', async () => {
      resolveEdgeUrlStub.throws(new Error('invalid hostname'));

      const result = await StudioComponentServerWrapper({
        componentRef: 'components/hero/default',
      });

      expect(result).to.be.null;
      assert.calledWithMatch(
        consoleErrorStub,
        'StudioComponentServerWrapper: failed to resolve component from'
      );
    });
  });

  const getWrapperElement = (result: any) => {
    const children = React.Children.toArray(result.props.children);
    return children.find(
      (child: any) => child && child.type === StudioComponentWrapperStub
    ) as React.ReactElement;
  };

  describe('successful render', () => {
    it('renders StudioComponentWrapper with the fetched document', async () => {
      const result = await StudioComponentServerWrapper({
        componentRef: 'components/hero/default',
      });

      // The server wrapper returns a fragment with an optional style tag + wrapper.
      expect(result).to.not.be.null;
      const wrapper = getWrapperElement(result);
      expect(wrapper).to.not.be.undefined;
      expect(wrapper.props.document).to.deep.equal({
        ...sampleDocument,
        state: { fields: undefined, params: undefined },
      });
    });

    it('injects compiled CSS when a compiler is registered', async () => {
      const compileStub = sandbox.stub().resolves('.text-red-500{color:red}');
      module = proxyquire('./StudioComponentServerWrapper', {
        '@sitecore-content-sdk/core': {
          NativeDataFetcher: class {
            get: SinonStub;
            constructor() {
              this.get = fetcherGetStub;
            }
          },
          getAtomsCssCompiler: () => compileStub,
        },
        '@sitecore-content-sdk/core/tools': {
          resolveEdgeUrl: resolveEdgeUrlStub,
        },
        '@sitecore-content-sdk/content': {
          debug: { layout: undefined },
        },
        '../../atoms/extract-document-classes': {
          extractDocumentClasses: () => ['text-red-500'],
        },
        './StudioComponentWrapper': {
          StudioComponentWrapper: StudioComponentWrapperStub,
        },
      });

      const result = await module.StudioComponentServerWrapper({
        componentRef: 'components/hero/default',
      });

      assert.calledOnceWithExactly(compileStub, ['text-red-500']);
      const children = React.Children.toArray(result.props.children);
      const style = children.find((child: any) => child && child.type === 'style') as any;
      expect(style).to.not.be.undefined;
      expect(style.props.dangerouslySetInnerHTML).to.deep.equal({
        __html: '.text-red-500{color:red}',
      });
    });
  });

  describe('fields and params injection into document state', () => {
    it('injects fields into a fetched document without initial state', async () => {
      const fields = { heading: { value: 'Hello' } };

      const result = await StudioComponentServerWrapper({
        componentRef: 'components/hero/default',
        fields: fields as any,
        params: {},
      });

      expect(result).to.not.be.null;
      const wrapper = getWrapperElement(result);
      expect(wrapper.props.document.state.fields).to.equal(fields);
      expect(wrapper.props.document.state.params).to.deep.equal({});
      expect(wrapper.props).to.not.have.property('fields');
    });

    it('injects params into a fetched document without initial state', async () => {
      const params = { styles: 'primary', size: 'large' };

      const result = await StudioComponentServerWrapper({
        componentRef: 'components/hero/default',
        fields: {} as any,
        params,
      });

      expect(result).to.not.be.null;
      const wrapper = getWrapperElement(result);
      expect(wrapper.props.document.state.params).to.equal(params);
      expect(wrapper.props.document.state.fields).to.deep.equal({});
      expect(wrapper.props).to.not.have.property('params');
    });

    it('overwrites document fields and params with runtime values without merging', async () => {
      const fields = { title: { value: 'My Title' } };
      const params = { styles: 'dark' };
      const document: Document = {
        ...sampleDocument,
        state: {
          fields: { title: { value: 'Document Title' }, stale: { value: 'Remove me' } },
          params: { styles: 'light', RenderingIdentifier: 'stale-id' },
          counter: 3,
          user: { name: 'Alice' },
        },
      };
      const serializedDocument = JSON.stringify(document);
      fetcherGetStub.resolves({ data: serializedDocument });
      sandbox.stub(JSON, 'parse').callThrough().withArgs(serializedDocument).returns(document);
      Object.freeze(document.state);
      Object.freeze(document);

      const result = await StudioComponentServerWrapper({
        componentRef: 'components/hero/default',
        fields: fields as any,
        params,
      });

      expect(result).to.not.be.null;
      const wrapper = getWrapperElement(result);
      const injectedDocument = wrapper.props.document;
      expect(injectedDocument).to.not.equal(document);
      expect(injectedDocument.state).to.not.equal(document.state);
      expect(injectedDocument.state).to.deep.equal({
        fields,
        params,
        counter: 3,
        user: { name: 'Alice' },
      });
      expect(injectedDocument.state.fields).to.equal(fields);
      expect(injectedDocument.state.params).to.equal(params);
      expect(injectedDocument.state.user).to.equal(document.state?.user);
      expect(injectedDocument.elements).to.equal(document.elements);
      expect(JSON.stringify(document)).to.equal(serializedDocument);
      expect(wrapper.props).to.not.have.property('fields');
      expect(wrapper.props).to.not.have.property('params');
    });

    [
      { fields: undefined, params: { styles: 'runtime' } },
      { fields: { title: { value: 'Runtime Title' } }, params: undefined },
      { fields: undefined, params: undefined },
    ].forEach(({ fields, params }) => {
      it(`overwrites stored values when runtime fields are ${
        fields ? 'defined' : 'undefined'
      } and params are ${params ? 'defined' : 'undefined'}`, async () => {
        const document: Document = {
          ...sampleDocument,
          state: {
            fields: { title: { value: 'Document Title' } },
            params: { styles: 'document' },
            message: 'preserved',
          },
        };
        fetcherGetStub.resolves({ data: JSON.stringify(document) });

        const result = await StudioComponentServerWrapper({
          componentRef: 'components/hero/default',
          fields,
          params,
        });

        const state = getWrapperElement(result).props.document.state;
        expect(state).to.deep.equal({ fields, params, message: 'preserved' });
        expect(state).to.have.own.property('fields', fields);
        expect(state).to.have.own.property('params', params);
      });
    });
  });
});
