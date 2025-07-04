import React from 'react';
import { stub } from 'sinon';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import * as td from 'testdouble';

describe('<BYOCWrapper />', () => {
  it('should render', async () => {
    const byocComponentStub = stub().returns(<p>Foo</p>);

    await td.replaceEsm('./BYOCComponent.tsx', {
      BYOCComponent: byocComponentStub,
    });

    const { BYOCWrapper } = await import('./BYOCWrapper.js');

    const mockProps = {
      params: {
        ComponentName: 'xxx',
        ComponentProps: JSON.stringify({ prop1: 'value1' }),
        RenderingIdentifier: 'foo-id',
        styles: 'bar car   ',
      },
    };
    const { container } = await render(<BYOCWrapper {...mockProps} />);
    const props = byocComponentStub.args[0][0];
    expect(container.querySelectorAll('.bar')).to.have.lengthOf(1);
    expect(props?.params).to.deep.equal({
      ComponentName: 'xxx',
      ComponentProps: JSON.stringify({ prop1: 'value1' }),
      RenderingIdentifier: 'foo-id',
      styles: 'bar car   ',
    });

    const root = container.querySelectorAll('.bar');
    expect(root).to.have.lengthOf(1);
    expect(root[0].getAttribute('class')).to.equal('bar car');
    expect(root[0].getAttribute('id')).to.equal('foo-id');
  });
});
