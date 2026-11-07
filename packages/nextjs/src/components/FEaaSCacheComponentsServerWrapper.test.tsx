/* eslint-disable no-unused-expressions */
import React, { Suspense } from 'react';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';
import { Page, PageMode } from '@sitecore-content-sdk/content/client';
import { FEaaSServerWrapperProps } from '@sitecore-content-sdk/react';
import type * as WrapperModule from './FEaaSCacheComponentsServerWrapper';

chai.use(sinonChai);

describe('FEaaSCacheComponentsServerWrapper', () => {
  const sandbox = sinon.createSandbox();
  let connection: sinon.SinonStub;
  let fetchFEaaSComponentServerProps: sinon.SinonStub;
  let FEaaSWrapper: sinon.SinonStub;
  let mod: typeof WrapperModule;

  const serverProps = { template: '<div>fetched</div>', revisionFallback: 'published' };

  const page = (isNormal: boolean): Page => ({
    locale: 'en',
    layout: { sitecore: { context: {}, route: null } },
    mode: {
      name: isNormal ? 'normal' : 'preview',
      isNormal,
      isPreview: !isNormal,
      isEditing: false,
      isDesignLibrary: false,
      designLibrary: { isVariantGeneration: false },
    } as PageMode,
  });

  const props = (
    isNormal: boolean
  ): FEaaSServerWrapperProps & { componentMap: Map<string, any> } => ({
    page: page(isNormal),
    componentMap: new Map([['Other', () => null]]),
    params: { styles: 'my-style', LibraryId: 'lib' },
    fields: { title: { value: 'Title' } },
    rendering: {
      componentName: 'FEaaSWrapper',
      params: {
        ComponentHostName: 'feaas.example',
        LibraryId: 'lib',
        ComponentId: 'comp',
        ComponentVersion: '1',
        DynamicPlaceholderId: '3',
      } as any,
    },
  });

  beforeEach(() => {
    connection = sandbox.stub().resolves();
    fetchFEaaSComponentServerProps = sandbox.stub().resolves(serverProps);
    FEaaSWrapper = sandbox.stub().callsFake(() => <div />);

    mod = proxyquire('./FEaaSCacheComponentsServerWrapper', {
      'next/server': { connection, '@noCallThru': true },
      '@sitecore-content-sdk/react': {
        FEaaSWrapper,
        fetchFEaaSComponentServerProps,
        '@noCallThru': true,
      },
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  const renderBody = async (element: React.JSX.Element) => {
    expect(element.type).to.equal(Suspense);
    const child = element.props.children as React.ReactElement<{ [key: string]: unknown }>;
    return (child.type as (p: unknown) => Promise<React.ReactElement>)(child.props);
  };

  it('renders at request time behind Suspense by default', async () => {
    const rendered = await renderBody(mod.FEaaSCacheComponentsServerWrapper(props(true)));

    expect(connection).to.have.been.calledOnce;
    expect(connection).to.have.been.calledBefore(fetchFEaaSComponentServerProps);
    expect(fetchFEaaSComponentServerProps).to.have.been.calledOnceWith(
      props(true).rendering!.params,
      true
    );
    expect(rendered.type).to.equal(FEaaSWrapper);
  });

  it('passes only serializable props to the client wrapper', async () => {
    const rendered = await renderBody(mod.FEaaSCacheComponentsServerWrapper(props(true)));

    expect(rendered.props).to.deep.equal({
      ...serverProps,
      params: { styles: 'my-style', LibraryId: 'lib' },
      fields: { title: { value: 'Title' } },
    });
  });

  it('uses the cached fetcher on normal pages without opting into request time', async () => {
    const getCachedServerProps = sandbox.stub().resolves({ template: '<div>cached</div>' });
    const Wrapper = mod.createFEaaSCacheComponentsServerWrapper({ getCachedServerProps });

    const rendered = await renderBody(Wrapper(props(true)));

    expect(connection).to.not.have.been.called;
    expect(fetchFEaaSComponentServerProps).to.not.have.been.called;
    expect(getCachedServerProps).to.have.been.calledOnceWithExactly({
      ComponentHostName: 'feaas.example',
      LibraryId: 'lib',
      ComponentId: 'comp',
      ComponentVersion: '1',
    });
    expect(rendered.props.template).to.equal('<div>cached</div>');
  });

  it('keeps preview rendering at request time even with a cached fetcher', async () => {
    const getCachedServerProps = sandbox.stub().resolves({});
    const Wrapper = mod.createFEaaSCacheComponentsServerWrapper({ getCachedServerProps });

    await renderBody(Wrapper(props(false)));

    expect(getCachedServerProps).to.not.have.been.called;
    expect(connection).to.have.been.calledOnce;
    expect(fetchFEaaSComponentServerProps).to.have.been.calledOnceWith(
      props(false).rendering!.params,
      false
    );
  });

  it('renders the client wrapper when the fetcher returns null', async () => {
    const Wrapper = mod.createFEaaSCacheComponentsServerWrapper({
      getCachedServerProps: sandbox.stub().resolves(null),
    });

    const rendered = await renderBody(Wrapper(props(true)));

    expect(rendered.type).to.equal(FEaaSWrapper);
    expect(rendered.props.template).to.be.undefined;
  });
});
