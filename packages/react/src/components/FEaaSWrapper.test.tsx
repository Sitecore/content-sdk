import React from 'react';
import { stub } from 'sinon';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { ComponentFields } from '@sitecore-content-sdk/core/layout';
import * as td from 'testdouble';
import type { FEaaSComponentParams, FEaaSComponentProps } from './FEaaSComponent.js';

describe('<FEaaSWrapper />', () => {
  const params: FEaaSComponentParams = {
    LibraryId: 'library123',
    ComponentId: 'component123',
    ComponentVersion: 'version123',
    ComponentRevision: 'staged',
    ComponentHostName: 'host123',
    RenderingIdentifier: 'foo-id',
    styles: 'foo bar   ',
  };

  const fields: ComponentFields = {
    sampleText: {
      value: 'Welcome-to-Sitecore-JSS',
    },
  };

  const fetchedData = {
    foo: 'bar',
    baz: 42,
  };

  it('should render', async () => {
    const feaasComponentStub = stub().returns(<p>Foo</p>);

    await td.replaceEsm('./FEaaSComponent.tsx', {
      FEaaSComponent: feaasComponentStub,
    });

    const { FEaaSWrapper } = await import('./FEaaSWrapper.js');

    const mockProps: FEaaSComponentProps = {
      params,
      fields,
      fetchedData,
    };
    const wrapper = render(<FEaaSWrapper {...mockProps} />, { container: document.body });

    const props = feaasComponentStub.args[0][0];
    expect(props.params).to.deep.equal({
      LibraryId: 'library123',
      ComponentId: 'component123',
      ComponentVersion: 'version123',
      ComponentRevision: 'staged',
      ComponentHostName: 'host123',
      RenderingIdentifier: 'foo-id',
      styles: 'foo bar   ',
    });
    expect(props.fields).to.deep.equal({
      sampleText: {
        value: 'Welcome-to-Sitecore-JSS',
      },
    });
    expect(props.fetchedData).to.deep.equal({
      foo: 'bar',
      baz: 42,
    });

    const root = wrapper.container.querySelector('.bar');
    expect(wrapper.container.querySelectorAll('.bar')).to.have.lengthOf(1);
    expect(root?.getAttribute('class')).to.equal('component feaas foo bar');
    expect(root?.getAttribute('id')).to.equal('foo-id');
  });
});
