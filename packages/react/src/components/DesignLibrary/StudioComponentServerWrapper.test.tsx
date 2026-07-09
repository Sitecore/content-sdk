/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { expect } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
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
      },
      '@sitecore-content-sdk/core/tools': {
        resolveEdgeUrl: resolveEdgeUrlStub,
      },
      '@sitecore-content-sdk/content': {
        debug: { layout: undefined },
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
      expect(consoleWarnStub).to.have.been.calledWithMatch(
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
      expect(consoleWarnStub).to.have.been.calledWithMatch(
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
      expect(consoleErrorStub).to.have.been.calledWithMatch(
        'StudioComponentServerWrapper: failed to fetch component layout'
      );
    });

    it('returns null and errors when response body is not valid JSON', async () => {
      fetcherGetStub.resolves({ data: 'not-json{{' });

      const result = await StudioComponentServerWrapper({
        componentRef: 'components/hero/default',
      });

      expect(result).to.be.null;
      expect(consoleErrorStub).to.have.been.calledWithMatch(
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
      expect(fetcherGetStub).to.have.been.calledOnce;
      expect(result.type).to.equal(StudioComponentWrapperStub);
      expect(result.props.document).to.deep.equal(sampleDocument);
    });

    it('returns null and errors when URL resolution fails', async () => {
      resolveEdgeUrlStub.throws(new Error('invalid hostname'));

      const result = await StudioComponentServerWrapper({
        componentRef: 'components/hero/default',
      });

      expect(result).to.be.null;
      expect(consoleErrorStub).to.have.been.calledWithMatch(
        'StudioComponentServerWrapper: failed to resolve component from'
      );
    });
  });

  describe('successful render', () => {
    it('renders StudioComponentWrapper with the fetched document', async () => {
      const result = await StudioComponentServerWrapper({
        componentRef: 'components/hero/default',
      });

      // The server wrapper returns a React element (JSX), not a rendered output.
      // Assert the element type and props directly.
      expect(result).to.not.be.null;
      expect(result.type).to.equal(StudioComponentWrapperStub);
      expect(result.props.document).to.deep.equal(sampleDocument);
    });
  });

  describe('fields and params forwarding', () => {
    it('forwards fields to StudioComponentWrapper', async () => {
      const fields = { heading: { value: 'Hello' } };

      const result = await StudioComponentServerWrapper({
        componentRef: 'components/hero/default',
        fields: fields as any,
        params: {},
      });

      expect(result).to.not.be.null;
      expect(result.props.fields).to.equal(fields);
    });

    it('forwards params to StudioComponentWrapper', async () => {
      const params = { styles: 'primary', size: 'large' };

      const result = await StudioComponentServerWrapper({
        componentRef: 'components/hero/default',
        fields: {} as any,
        params,
      });

      expect(result).to.not.be.null;
      expect(result.props.params).to.equal(params);
    });

    it('forwards both fields and params together', async () => {
      const fields = { title: { value: 'My Title' } };
      const params = { styles: 'dark' };

      const result = await StudioComponentServerWrapper({
        componentRef: 'components/hero/default',
        fields: fields as any,
        params,
      });

      expect(result).to.not.be.null;
      expect(result.props.fields).to.equal(fields);
      expect(result.props.params).to.equal(params);
    });
  });
});
