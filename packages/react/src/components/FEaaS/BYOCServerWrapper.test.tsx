/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { expect } from 'chai';
import { createSandbox, SinonSandbox } from 'sinon';
import { render } from '@testing-library/react';
import { BYOCServerWrapper } from './BYOCServerWrapper';
import * as feaasUtils from './feaas-utils';
import * as BYOCWrapperModule from './BYOCWrapper';
import { BYOCComponentProps, BYOCComponentParams } from './models';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';

describe('BYOCServerWrapper', () => {
  let sandbox: SinonSandbox;
  let fetchBYOCComponentServerPropsStub: any;
  let BYOCWrapperStub: any;

  beforeEach(() => {
    sandbox = createSandbox();

    // Mock fetchBYOCComponentServerProps
    fetchBYOCComponentServerPropsStub = sandbox.stub(feaasUtils, 'fetchBYOCComponentServerProps');

    // Mock BYOCWrapper component
    BYOCWrapperStub = sandbox.stub(BYOCWrapperModule, 'BYOCWrapper');
    BYOCWrapperStub.callsFake((props: any) => (
      <div className="byoc-wrapper-mock" data-testid="byoc-wrapper">
        {JSON.stringify(props)}
      </div>
    ));
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get server props via fetchBYOCComponentServerProps and render client wrapper', async () => {
    // Arrange
    const mockServerProps = {
      fetchedData: { key1: 'value1', key2: 'value2' },
    };

    const mockParams: BYOCComponentParams = {
      ComponentName: 'TestComponent',
      ComponentProps: JSON.stringify({ prop1: 'value1' }),
    };

    const mockRendering: ComponentRendering = {
      uid: 'test-uid',
      componentName: 'BYOCWrapper',
      params: mockParams,
    };

    const inputProps: BYOCComponentProps = {
      rendering: mockRendering,
      // Don't include fetchedData so server props won't be overridden
    };

    fetchBYOCComponentServerPropsStub.resolves(mockServerProps);

    // Act
    const result = await BYOCServerWrapper(inputProps);
    const { container } = render(result);

    // Assert
    expect(fetchBYOCComponentServerPropsStub).to.have.been.calledOnce;
    expect(fetchBYOCComponentServerPropsStub).to.have.been.calledWith(mockParams);

    expect(BYOCWrapperStub).to.have.been.calledOnce;

    // Verify that server props are merged with input props
    const finalProps = BYOCWrapperStub.firstCall.args[0];
    expect(finalProps).to.include(mockServerProps);
    expect(finalProps).to.include(inputProps);
    expect(finalProps.fetchedData).to.deep.equal(mockServerProps.fetchedData);
    expect(finalProps.rendering).to.deep.equal(mockRendering);

    // Verify component renders correctly
    expect(container.querySelector('[data-testid="byoc-wrapper"]')).to.not.be.null;
  });

  it('should override server props from fetchBYOCComponentServerProps with props passed into it', async () => {
    // Arrange
    const mockServerProps = {
      fetchedData: { serverKey: 'serverValue' },
    };

    const overrideProps = {
      fetchedData: { overrideKey: 'overrideValue' },
    };

    const mockParams: BYOCComponentParams = {
      ComponentName: 'TestComponent',
    };

    const mockRendering: ComponentRendering = {
      uid: 'test-uid-2',
      componentName: 'BYOCWrapper',
      params: mockParams,
    };

    const inputProps: BYOCComponentProps = {
      rendering: mockRendering,
      ...overrideProps, // These should override server props
    };

    fetchBYOCComponentServerPropsStub.resolves(mockServerProps);

    // Act
    const result = await BYOCServerWrapper(inputProps);
    render(result);

    // Assert
    expect(fetchBYOCComponentServerPropsStub).to.have.been.calledOnce;
    expect(fetchBYOCComponentServerPropsStub).to.have.been.calledWith(mockParams);

    expect(BYOCWrapperStub).to.have.been.calledOnce;

    // Verify that input props override server props
    const finalProps = BYOCWrapperStub.firstCall.args[0];
    expect(finalProps.fetchedData).to.deep.equal(overrideProps.fetchedData);
    expect(finalProps.rendering).to.deep.equal(mockRendering);

    // Verify server props are still present but overridden where conflicts exist
    expect(finalProps).to.have.property('fetchedData');
    expect(finalProps.fetchedData).to.not.deep.equal(mockServerProps.fetchedData);
  });

  it('should handle empty params gracefully', async () => {
    // Arrange
    const mockServerProps = {
      fetchedData: {},
    };

    const inputProps: BYOCComponentProps = {
      rendering: {
        uid: 'test-uid-3',
        componentName: 'BYOCWrapper',
        // params is undefined
      },
      // Don't set fetchedData to avoid overriding server props
    };

    fetchBYOCComponentServerPropsStub.resolves(mockServerProps);

    // Act
    const result = await BYOCServerWrapper(inputProps);
    render(result);

    // Assert
    expect(fetchBYOCComponentServerPropsStub).to.have.been.calledOnce;
    expect(fetchBYOCComponentServerPropsStub).to.have.been.calledWith({});

    expect(BYOCWrapperStub).to.have.been.calledOnce;

    const finalProps = BYOCWrapperStub.firstCall.args[0];
    expect(finalProps).to.include(mockServerProps);
    expect(finalProps).to.include(inputProps);
  });

  it('should handle missing rendering object', async () => {
    // Arrange
    const mockServerProps = {
      fetchedData: { fallbackData: 'value' },
    };

    const inputProps: BYOCComponentProps = {
      // rendering is undefined
      // Don't set fetchedData to avoid overriding server props
    };

    fetchBYOCComponentServerPropsStub.resolves(mockServerProps);

    // Act
    const result = await BYOCServerWrapper(inputProps);
    render(result);

    // Assert
    expect(fetchBYOCComponentServerPropsStub).to.have.been.calledOnce;
    expect(fetchBYOCComponentServerPropsStub).to.have.been.calledWith({});

    expect(BYOCWrapperStub).to.have.been.calledOnce;

    const finalProps = BYOCWrapperStub.firstCall.args[0];
    expect(finalProps).to.include(mockServerProps);
    expect(finalProps).to.include(inputProps);
  });

  it('should handle fetchBYOCComponentServerProps errors gracefully', async () => {
    // Arrange
    const inputProps: BYOCComponentProps = {
      rendering: {
        uid: 'test-uid-4',
        componentName: 'BYOCWrapper',
        params: { ComponentName: 'TestComponent' },
      },
      fetchedData: { fallbackData: 'fallback' },
    };

    fetchBYOCComponentServerPropsStub.rejects(new Error('Server error'));

    // Act & Assert
    try {
      await BYOCServerWrapper(inputProps);
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error).to.be.an('error');
      expect((error as Error).message).to.equal('Server error');
    }

    expect(fetchBYOCComponentServerPropsStub).to.have.been.calledOnce;
    expect(BYOCWrapperStub).to.not.have.been.called;
  });
});
