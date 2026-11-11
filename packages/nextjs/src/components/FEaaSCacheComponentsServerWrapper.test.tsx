/* eslint-disable no-unused-expressions */
import React, { Suspense } from 'react';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';
import { FEaaSServerWrapperProps } from '@sitecore-content-sdk/react';
import type * as WrapperModule from './FEaaSCacheComponentsServerWrapper';

chai.use(sinonChai);

describe('FEaaSCacheComponentsServerWrapper', () => {
  const sandbox = sinon.createSandbox();
  let connection: sinon.SinonStub;
  let FEaaSServerWrapper: sinon.SinonStub;
  let mod: typeof WrapperModule;

  const props = {
    params: { styles: 'my-style', LibraryId: 'lib' },
    fields: { title: { value: 'Title' } },
    rendering: {
      componentName: 'FEaaSWrapper',
      params: { ComponentHostName: 'feaas.example', LibraryId: 'lib', ComponentId: 'comp' },
    },
  } as FEaaSServerWrapperProps;

  beforeEach(() => {
    connection = sandbox.stub().resolves();
    FEaaSServerWrapper = sandbox.stub().callsFake(() => <div />);

    mod = proxyquire('./FEaaSCacheComponentsServerWrapper', {
      'next/server': { connection, '@noCallThru': true },
      '@sitecore-content-sdk/react': { FEaaSServerWrapper, '@noCallThru': true },
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

  it('should render FEaaSServerWrapper at request time behind Suspense', async () => {
    const rendered = await renderBody(mod.FEaaSCacheComponentsServerWrapper(props));

    expect(connection).to.have.been.calledOnce;
    expect(rendered.type).to.equal(FEaaSServerWrapper);
    expect(rendered.props).to.deep.equal(props);
  });

  it('should wait for connection before rendering FEaaSServerWrapper', async () => {
    let resolveConnection: () => void = () => {};
    connection.returns(new Promise<void>((resolve) => (resolveConnection = resolve)));

    let settled = false;
    const body = renderBody(mod.FEaaSCacheComponentsServerWrapper(props)).then((rendered) => {
      settled = true;
      return rendered;
    });

    await Promise.resolve();
    expect(settled).to.be.false;

    resolveConnection();
    const rendered = await body;
    expect(rendered.type).to.equal(FEaaSServerWrapper);
  });
});
