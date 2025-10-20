/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { expect, use } from 'chai';
import { createSandbox, SinonSandbox } from 'sinon';
import { render } from '@testing-library/react';
import { FEaaSServerWrapper } from './FEaaSSeverWrapper';
import * as feaasUtils from './feaas-utils';
import * as FEaaSWrapperModule from './FEaaSWrapper';
import { FEaaSComponentProps, FEaaSComponentParams } from './models';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';
import { Page, PageMode } from '@sitecore-content-sdk/core/client';

describe('FEaaSServerWrapper', () => {
  let sandbox: SinonSandbox;
  let fetchFEaaSComponentServerPropsStub: any;
  let FEaaSWrapperStub: any;

  beforeEach(() => {
    sandbox = createSandbox();

    // Mock fetchFEaaSComponentServerProps
    fetchFEaaSComponentServerPropsStub = sandbox.stub(feaasUtils, 'fetchFEaaSComponentServerProps');

    // Mock FEaaSWrapper component
    FEaaSWrapperStub = sandbox.stub(FEaaSWrapperModule, 'FEaaSWrapper');
    FEaaSWrapperStub.callsFake((props: any) => (
      <div className="feaas-wrapper-mock" data-testid="feaas-wrapper">
        {JSON.stringify(props)}
      </div>
    ));
  });

  afterEach(() => {
    sandbox.restore();
  });

  const createMockPage = (isNormal: boolean = true): Page => ({
    locale: 'en',
    layout: {
      sitecore: {
        context: {},
        route: null,
      },
    },
    mode: {
      name: 'normal',
      isNormal,
      isPreview: false,
      isEditing: false,
      isDesignLibrary: false,
      designLibrary: {
        isVariantGeneration: false,
      },
    } as PageMode,
  });

  it('should get server props via fetchFEaaSComponentServerProps and render client wrapper', async () => {
    // Arrange
    const mockServerProps = {
      template: '<div>Test Template</div>',
      fetchedData: { key1: 'value1', key2: 'value2' },
      revisionFallback: 'published' as const,
    };

    const mockParams: FEaaSComponentParams = {
      LibraryId: 'lib123',
      ComponentId: 'comp456',
      ComponentVersion: '1.0.0',
      ComponentRevision: 'published',
      ComponentHostName: 'https://example.com',
    };

    const mockRendering: ComponentRendering = {
      uid: 'test-uid',
      componentName: 'FEaaSWrapper',
      params: mockParams,
    };

    const mockPage = createMockPage(true);

    const inputProps: FEaaSComponentProps = {
      rendering: mockRendering,
      page: mockPage,
      // Don't include template and fetchedData so server props won't be overridden
    };

    fetchFEaaSComponentServerPropsStub.resolves(mockServerProps);

    // Act
    const result = await FEaaSServerWrapper(inputProps);
    const { container } = render(result);

    // Assert
    expect(fetchFEaaSComponentServerPropsStub).to.have.been.calledOnce;
    expect(fetchFEaaSComponentServerPropsStub).to.have.been.calledWith(mockParams, true);

    expect(FEaaSWrapperStub).to.have.been.calledOnce;

    // Verify that server props are merged with input props
    const finalProps = FEaaSWrapperStub.firstCall.args[0];
    expect(finalProps).to.include(mockServerProps);
    expect(finalProps).to.include(inputProps);
    expect(finalProps.template).to.equal(mockServerProps.template);
    expect(finalProps.fetchedData).to.deep.equal(mockServerProps.fetchedData);
    expect(finalProps.rendering).to.deep.equal(mockRendering);
    expect(finalProps.page).to.deep.equal(mockPage);

    // Verify component renders correctly
    expect(container.querySelector('[data-testid="feaas-wrapper"]')).to.not.be.null;
  });

  it('should override server props from fetchFEaaSComponentServerProps with props passed into it', async () => {
    // Arrange
    const mockServerProps = {
      template: '<div>Server Template</div>',
      fetchedData: { serverKey: 'serverValue' },
      revisionFallback: 'published' as const,
    };

    const overrideProps = {
      template: '<div>Override Template</div>',
      fetchedData: { overrideKey: 'overrideValue' },
    };

    const mockParams: FEaaSComponentParams = {
      LibraryId: 'lib123',
      ComponentId: 'comp456',
      ComponentVersion: '1.0.0',
    };

    const mockRendering: ComponentRendering = {
      uid: 'test-uid-2',
      componentName: 'FEaaSWrapper',
      params: mockParams,
    };

    const mockPage = createMockPage(false); // isNormal = false

    const inputProps: FEaaSComponentProps = {
      rendering: mockRendering,
      page: mockPage,
      ...overrideProps, // These should override server props
    };

    fetchFEaaSComponentServerPropsStub.resolves(mockServerProps);

    // Act
    const result = await FEaaSServerWrapper(inputProps);
    render(result);

    // Assert
    expect(fetchFEaaSComponentServerPropsStub).to.have.been.calledOnce;
    expect(fetchFEaaSComponentServerPropsStub).to.have.been.calledWith(mockParams, false);

    expect(FEaaSWrapperStub).to.have.been.calledOnce;

    // Verify that input props override server props
    const finalProps = FEaaSWrapperStub.firstCall.args[0];
    expect(finalProps.template).to.equal(overrideProps.template);
    expect(finalProps.fetchedData).to.deep.equal(overrideProps.fetchedData);
    expect(finalProps.rendering).to.deep.equal(mockRendering);
    expect(finalProps.page).to.deep.equal(mockPage);

    // Verify server props are still present but overridden where conflicts exist
    expect(finalProps).to.have.property('revisionFallback', mockServerProps.revisionFallback);
    expect(finalProps.template).to.not.equal(mockServerProps.template);
    expect(finalProps.fetchedData).to.not.deep.equal(mockServerProps.fetchedData);
  });

  it('should pass correct isPageStateNormal parameter based on page mode', async () => {
    // Arrange
    const mockServerProps = {
      template: '<div>Template</div>',
      fetchedData: {},
      revisionFallback: 'staged' as const,
    };

    const mockParams: FEaaSComponentParams = {
      LibraryId: 'lib123',
      ComponentId: 'comp456',
      ComponentVersion: '1.0.0',
    };

    const mockRendering: ComponentRendering = {
      uid: 'test-uid-3',
      componentName: 'FEaaSWrapper',
      params: mockParams,
    };

    fetchFEaaSComponentServerPropsStub.resolves(mockServerProps);

    // Test with isNormal = true
    const normalPage = createMockPage(true);
    const normalProps: FEaaSComponentProps = {
      rendering: mockRendering,
      page: normalPage,
    };

    await FEaaSServerWrapper(normalProps);
    expect(fetchFEaaSComponentServerPropsStub).to.have.been.calledWith(mockParams, true);

    // Reset stub
    fetchFEaaSComponentServerPropsStub.reset();

    // Test with isNormal = false
    const editingPage = createMockPage(false);
    const editingProps: FEaaSComponentProps = {
      rendering: mockRendering,
      page: editingPage,
    };

    await FEaaSServerWrapper(editingProps);
    expect(fetchFEaaSComponentServerPropsStub).to.have.been.calledWith(mockParams, false);
  });

  it('should handle empty params gracefully', async () => {
    // Arrange
    const mockServerProps = {
      template: '',
      fetchedData: {},
      revisionFallback: 'published' as const,
    };

    const inputProps: FEaaSComponentProps = {
      rendering: {
        uid: 'test-uid-4',
        componentName: 'FEaaSWrapper',
        // params is undefined
      },
      page: createMockPage(),
    };

    fetchFEaaSComponentServerPropsStub.resolves(mockServerProps);

    // Act
    const result = await FEaaSServerWrapper(inputProps);
    render(result);

    // Assert
    expect(fetchFEaaSComponentServerPropsStub).to.have.been.calledOnce;
    expect(fetchFEaaSComponentServerPropsStub).to.have.been.calledWith({}, true);

    expect(FEaaSWrapperStub).to.have.been.calledOnce;

    const finalProps = FEaaSWrapperStub.firstCall.args[0];
    expect(finalProps).to.include(mockServerProps);
    expect(finalProps).to.include(inputProps);
  });

  it('should handle missing rendering object', async () => {
    // Arrange
    const mockServerProps = {
      template: '<div>Fallback Template</div>',
      fetchedData: { fallbackData: 'value' },
      revisionFallback: 'published' as const,
    };

    const inputProps: FEaaSComponentProps = {
      // rendering is undefined
      page: createMockPage(),
    };

    fetchFEaaSComponentServerPropsStub.resolves(mockServerProps);

    // Act
    const result = await FEaaSServerWrapper(inputProps);
    render(result);

    // Assert
    expect(fetchFEaaSComponentServerPropsStub).to.have.been.calledOnce;
    expect(fetchFEaaSComponentServerPropsStub).to.have.been.calledWith({}, true);

    expect(FEaaSWrapperStub).to.have.been.calledOnce;

    const finalProps = FEaaSWrapperStub.firstCall.args[0];
    expect(finalProps).to.include(mockServerProps);
    expect(finalProps).to.include(inputProps);
  });

  it('should handle missing page object', async () => {
    // Arrange
    const mockServerProps = {
      template: '<div>Template</div>',
      fetchedData: {},
      revisionFallback: 'published' as const,
    };

    const mockParams: FEaaSComponentParams = {
      LibraryId: 'lib123',
      ComponentId: 'comp456',
      ComponentVersion: '1.0.0',
    };

    const inputProps: FEaaSComponentProps = {
      rendering: {
        uid: 'test-uid-5',
        componentName: 'FEaaSWrapper',
        params: mockParams,
      },
      // page is undefined
    };

    fetchFEaaSComponentServerPropsStub.resolves(mockServerProps);

    // Act
    const result = await FEaaSServerWrapper(inputProps);
    render(result);

    // Assert
    expect(fetchFEaaSComponentServerPropsStub).to.have.been.calledOnce;
    expect(fetchFEaaSComponentServerPropsStub).to.have.been.calledWith(mockParams, undefined);

    expect(FEaaSWrapperStub).to.have.been.calledOnce;
  });

  it('should handle fetchFEaaSComponentServerProps errors gracefully', async () => {
    // Arrange
    const inputProps: FEaaSComponentProps = {
      rendering: {
        uid: 'test-uid-6',
        componentName: 'FEaaSWrapper',
        params: { LibraryId: 'lib123' },
      },
      page: createMockPage(),
      template: '<div>Fallback Template</div>',
    };

    fetchFEaaSComponentServerPropsStub.rejects(new Error('Server error'));

    // Act & Assert
    try {
      await FEaaSServerWrapper(inputProps);
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error).to.be.an('error');
      expect((error as Error).message).to.equal('Server error');
    }

    expect(fetchFEaaSComponentServerPropsStub).to.have.been.calledOnce;
    expect(FEaaSWrapperStub).to.not.have.been.called;
  });
});
