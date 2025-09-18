/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import {
  getPlaceholderRenderings,
  getSXAParams,
  wrapErrorBoundary,
  getRenderedComponentProps,
  getComponentForRendering,
} from './PlaceholderCommon';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';
import { PlaceholderProps } from './models';
import { ComponentMap, ReactModule } from '../sharedTypes';
import { constants } from '@sitecore-content-sdk/core';
import ErrorBoundary from '../ErrorBoundary';
import { MissingComponent } from '../MissingComponent';
import { HiddenRendering } from '../HiddenRendering';
import { FEaaSComponent, FEAAS_COMPONENT_RENDERING_NAME } from '../FEaaSComponent';
import { FEaaSWrapper, FEAAS_WRAPPER_RENDERING_NAME } from '../FEaaSWrapper';
import { BYOCComponent, BYOC_COMPONENT_RENDERING_NAME } from '../BYOCComponent';
import { BYOCWrapper, BYOC_WRAPPER_RENDERING_NAME } from '../BYOCWrapper';

describe('PlaceholderCommon', () => {
  const sandbox = createSandbox();
  let consoleWarnStub: any;
  let consoleErrorStub: any;

  beforeEach(() => {
    consoleWarnStub = sandbox.stub(console, 'warn');
    consoleErrorStub = sandbox.stub(console, 'error');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getPlaceholderRenderings', () => {
    it('should return null if rendering does not have placeholders', () => {
      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
      };

      const result = getPlaceholderRenderings(rendering, 'test-placeholder', false);

      expect(result).to.deep.equal([]);
      expect(consoleWarnStub.calledOnce).to.be.true;
      expect(consoleWarnStub.firstCall.args[0]).to.include('test-placeholder');
    });

    it('should return renderings from placeholder by name', () => {
      const expectedRenderings = [
        {
          componentName: 'Component1',
          uid: 'comp1-uid',
        },
        {
          componentName: 'Component2',
          uid: 'comp2-uid',
        },
      ];

      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
        placeholders: {
          'test-placeholder': expectedRenderings,
          'other-placeholder': [{ componentName: 'OtherComponent', uid: 'other-uid' }],
        },
      };

      const result = getPlaceholderRenderings(rendering, 'test-placeholder', false);

      expect(result).to.deep.equal(expectedRenderings);
      expect(consoleWarnStub.called).to.be.false;
    });

    it('should parse dynamic SXA placeholder names correctly', () => {
      const expectedRenderings = [
        {
          componentName: 'DynamicComponent',
          uid: 'dynamic-uid',
        },
      ];

      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
        placeholders: {
          'container-{*}': expectedRenderings,
          'other-placeholder': [{ componentName: 'OtherComponent', uid: 'other-uid' }],
        },
      };

      // Test non-editing mode - should replace dynamic placeholder
      const result = getPlaceholderRenderings(rendering, 'container-1', false);
      expect(result).to.deep.equal(expectedRenderings);
      expect(rendering.placeholders['container-1']).to.deep.equal(expectedRenderings);
      expect(rendering.placeholders['container-{*}']).to.be.undefined;

      // Reset rendering for editing mode test
      rendering.placeholders = {
        'container-{*}': expectedRenderings,
        'other-placeholder': [{ componentName: 'OtherComponent', uid: 'other-uid' }],
      };

      // Test editing mode - should keep original placeholder name
      const editResult = getPlaceholderRenderings(rendering, 'container-1', true);
      expect(editResult).to.deep.equal(expectedRenderings);
      expect(rendering.placeholders['container-{*}']).to.deep.equal(expectedRenderings);
    });
  });

  describe('getSXAParams', () => {
    it('should return GridParameters and Styles when present', () => {
      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
        params: {
          GridParameters: 'col-lg-6',
          Styles: 'custom-class',
          OtherParam: 'other-value',
        },
      };

      const result = getSXAParams(rendering);

      expect(result).to.deep.equal({
        styles: 'col-lg-6 custom-class',
      });
    });

    it('should return only GridParameters when Styles not present', () => {
      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
        params: {
          GridParameters: 'col-lg-8',
          OtherParam: 'other-value',
        },
      };

      const result = getSXAParams(rendering);

      expect(result).to.deep.equal({
        styles: 'col-lg-8 ',
      });
    });

    it('should return only Styles when GridParameters not present', () => {
      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
        params: {
          Styles: 'custom-styles',
          OtherParam: 'other-value',
        },
      };

      const result = getSXAParams(rendering);

      expect(result).to.deep.equal({
        styles: ' custom-styles',
      });
    });

    it('should return empty object when no params', () => {
      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
      };

      const result = getSXAParams(rendering);

      expect(result).to.deep.equal({});
    });
  });

  describe('wrapErrorBoundary', () => {
    it('should wrap components in ErrorBoundary and correctly apply props to it', () => {
      const TestComponent = () => <div className="test-component">Test</div>;
      const errorComponent = () => <div className="error-component">Error</div>;

      const placeholderProps: PlaceholderProps = {
        name: 'test-placeholder',
        rendering: { componentName: 'Test', uid: 'test-uid' },
        page: {
          layout: {},
          locale: 'en',
          mode: {
            name: 'normal',
            isNormal: true,
            isPreview: false,
            isEditing: false,
            isDesignLibrary: false,
            designLibrary: { isVariantGeneration: false },
          },
        },
        errorComponent,
        componentLoadingMessage: 'Loading...',
        disableSuspense: true,
      };

      const rendered = <TestComponent />;
      const renderingKey = 'test-key';

      const result = wrapErrorBoundary(rendered, placeholderProps, renderingKey, true);

      expect(result.type).to.equal(ErrorBoundary);
      expect(result.key).to.equal(renderingKey);
      expect(result.props['data-testid']).to.equal('error-boundary');
      expect(result.props.errorComponent).to.equal(errorComponent);
      expect(result.props.componentLoadingMessage).to.equal('Loading...');
      expect(result.props.isDynamic).to.be.true;
      expect(result.props.disableSuspense).to.be.true;
      expect(result.props.children).to.equal(rendered);
    });

    it('should handle sitecore type correctly', () => {
      const TestComponent = () => <div className="test-component">Test</div>;

      const placeholderProps: PlaceholderProps = {
        name: 'test-placeholder',
        rendering: { componentName: 'Test', uid: 'test-uid' },
        page: {
          layout: {},
          locale: 'en',
          mode: {
            name: 'normal',
            isNormal: true,
            isPreview: false,
            isEditing: false,
            isDesignLibrary: false,
            designLibrary: { isVariantGeneration: false },
          },
        },
      };

      const rendered = <TestComponent type="text/sitecore" />;
      const renderingKey = 'test-key';

      const result = wrapErrorBoundary(rendered, placeholderProps, renderingKey);

      expect(result.props.type).to.equal('text/sitecore');
    });

    it('should default disableSuspense to false when not provided', () => {
      const TestComponent = () => <div className="test-component">Test</div>;

      const placeholderProps: PlaceholderProps = {
        name: 'test-placeholder',
        rendering: { componentName: 'Test', uid: 'test-uid' },
        page: {
          layout: {},
          locale: 'en',
          mode: {
            name: 'normal',
            isNormal: true,
            isPreview: false,
            isEditing: false,
            isDesignLibrary: false,
            designLibrary: { isVariantGeneration: false },
          },
        },
      };

      const rendered = <TestComponent />;
      const renderingKey = 'test-key';

      const result = wrapErrorBoundary(rendered, placeholderProps, renderingKey);

      expect(result.props.disableSuspense).to.be.false;
    });
  });

  describe('getRenderedComponentProps', () => {
    it('should merge placeholder and rendering fields', () => {
      const placeholderProps: PlaceholderProps = {
        name: 'test-placeholder',
        rendering: { componentName: 'Test', uid: 'test-uid' },
        page: {
          layout: {},
          locale: 'en',
          mode: {
            name: 'normal',
            isNormal: true,
            isPreview: false,
            isEditing: false,
            isDesignLibrary: false,
            designLibrary: { isVariantGeneration: false },
          },
        },
        fields: {
          placeholderField: { value: 'placeholder-value' },
          sharedField: { value: 'placeholder-shared-value' },
        },
      };

      const componentRendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
        fields: {
          renderingField: { value: 'rendering-value' },
          sharedField: { value: 'rendering-shared-value' },
        },
      };

      const result = getRenderedComponentProps(placeholderProps, componentRendering, 'test-key');

      expect(result.fields).to.deep.equal({
        placeholderField: { value: 'placeholder-value' },
        renderingField: { value: 'rendering-value' },
        sharedField: { value: 'rendering-shared-value' }, // rendering should override placeholder
      });
    });

    it('should merge placeholder and rendering params', () => {
      const placeholderProps: PlaceholderProps = {
        name: 'test-placeholder',
        rendering: { componentName: 'Test', uid: 'test-uid' },
        page: {
          layout: {},
          locale: 'en',
          mode: {
            name: 'normal',
            isNormal: true,
            isPreview: false,
            isEditing: false,
            isDesignLibrary: false,
            designLibrary: { isVariantGeneration: false },
          },
        },
        params: {
          placeholderParam: 'placeholder-param-value',
          sharedParam: 'placeholder-shared-param',
        },
      };

      const componentRendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
        params: {
          renderingParam: 'rendering-param-value',
          sharedParam: 'rendering-shared-param',
          GridParameters: 'col-lg-6',
          Styles: 'custom-class',
        },
      };

      const result = getRenderedComponentProps(placeholderProps, componentRendering, 'test-key');

      expect(result.params).to.deep.equal({
        placeholderParam: 'placeholder-param-value',
        renderingParam: 'rendering-param-value',
        sharedParam: 'rendering-shared-param', // rendering should override placeholder
        GridParameters: 'col-lg-6',
        Styles: 'custom-class',
        styles: 'col-lg-6 custom-class', // SXA styles should be added
      });
    });

    it('should return composite props object', () => {
      const placeholderProps: PlaceholderProps = {
        name: 'test-placeholder',
        rendering: { componentName: 'Test', uid: 'test-uid' },
        page: {
          layout: {},
          locale: 'en',
          mode: {
            name: 'normal',
            isNormal: true,
            isPreview: false,
            isEditing: false,
            isDesignLibrary: false,
            designLibrary: { isVariantGeneration: false },
          },
        },
        componentMap: new Map(),
        customProp: 'custom-value',
        missingComponentComponent: MissingComponent,
        hiddenRenderingComponent: HiddenRendering,
      };

      const componentRendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
        fields: {
          testField: { value: 'test-value' },
        },
        params: {
          testParam: 'test-param',
        },
      };

      const result = getRenderedComponentProps(placeholderProps, componentRendering, 'test-key');

      expect(result.key).to.equal('test-key');
      expect(result.rendering).to.equal(componentRendering);
      expect(result.customProp).to.equal('custom-value');
      expect(result.componentMap).to.equal(placeholderProps.componentMap);

      // These props should be removed from the result
      expect(result.missingComponentComponent).to.be.undefined;
      expect(result.hiddenRenderingComponent).to.be.undefined;
      expect(result.name).to.be.undefined;

      expect(result.fields).to.deep.equal({
        testField: { value: 'test-value' },
      });
      expect(result.params).to.deep.equal({
        testParam: 'test-param',
      });
    });
  });

  describe('getComponentForRendering', () => {
    let componentMap: ComponentMap;
    const TestComponent = () => <div>Test Component</div>;
    const CustomMissingComponent = () => <div>Custom Missing</div>;
    const CustomHiddenComponent = () => <div>Custom Hidden</div>;

    beforeEach(() => {
      componentMap = new Map();
    });

    it('should return null when componentMap is empty', () => {
      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
      };

      const result = getComponentForRendering(rendering, 'test-placeholder');

      expect(result?.component).to.equal(MissingComponent);
      expect(result?.isEmpty).to.be.true;
      expect(consoleWarnStub.calledOnce).to.be.true;
    });

    it('should return null when componentMap is not provided', () => {
      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', undefined);

      expect(result?.component).to.equal(MissingComponent);
      expect(result?.isEmpty).to.be.true;
      expect(consoleWarnStub.calledOnce).to.be.true;
    });

    it('should return default export from componentMap entry when exportName not specified', () => {
      const module: ReactModule = {
        default: TestComponent,
      };
      componentMap.set('TestComponent', module);

      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.component).to.equal(TestComponent);
      expect(result?.dynamic).to.be.false;
      expect(result?.isClient).to.be.false;
    });

    it('should return Default export when default not available', () => {
      const module: ReactModule = {
        Default: TestComponent,
      };
      componentMap.set('TestComponent', module);

      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.component).to.equal(TestComponent);
    });

    it('should return component directly when it is not a module', () => {
      componentMap.set('TestComponent', TestComponent);

      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.component).to.equal(TestComponent);
    });

    it('should return custom export by exportName from componentMap, when exportName specified', () => {
      const CustomExport = () => <div>Custom Export</div>;
      const module: ReactModule = {
        default: TestComponent,
        CustomVariant: CustomExport,
      };
      componentMap.set('TestComponent', module);

      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
        params: {
          FieldNames: 'CustomVariant',
        },
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.component).to.equal(CustomExport);
    });

    it('should mark returned component isClient, when isClient export present', () => {
      const module: ReactModule & { isClient: boolean } = {
        default: TestComponent,
        isClient: true,
      };
      componentMap.set('TestComponent', module);

      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.component).to.equal(TestComponent);
      expect(result?.isClient).to.be.true;
    });

    it('should mark returned component dynamic when it is lazy', () => {
      const lazyComponent = {
        ...TestComponent,
        render: { preload: () => {} },
      };
      const module: ReactModule = {
        default: lazyComponent,
      };
      componentMap.set('TestComponent', module);

      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.component).to.equal(lazyComponent);
      expect(result?.dynamic).to.be.true;
    });

    it('should return fallback implementation for FEaaSComponent', () => {
      // Add a dummy entry so componentMap is not empty
      componentMap.set('DummyComponent', () => <div>Dummy</div>);

      const rendering: ComponentRendering = {
        componentName: FEAAS_COMPONENT_RENDERING_NAME,
        uid: 'test-uid',
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.component).to.equal(FEaaSComponent);
      expect(result?.isEmpty).to.be.undefined;
    });

    it('should return fallback implementation for FEaaSWrapper', () => {
      // Add a dummy entry so componentMap is not empty
      componentMap.set('DummyComponent', () => <div>Dummy</div>);

      const rendering: ComponentRendering = {
        componentName: FEAAS_WRAPPER_RENDERING_NAME,
        uid: 'test-uid',
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.component).to.equal(FEaaSWrapper);
      expect(result?.isEmpty).to.be.undefined;
    });

    it('should return fallback implementation for BYOCComponent', () => {
      // Add a dummy entry so componentMap is not empty
      componentMap.set('DummyComponent', () => <div>Dummy</div>);

      const rendering: ComponentRendering = {
        componentName: BYOC_COMPONENT_RENDERING_NAME,
        uid: 'test-uid',
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.component).to.equal(BYOCComponent);
      expect(result?.isEmpty).to.be.undefined;
    });

    it('should return fallback implementation for BYOCWrapper', () => {
      // Add a dummy entry so componentMap is not empty
      componentMap.set('DummyComponent', () => <div>Dummy</div>);

      const rendering: ComponentRendering = {
        componentName: BYOC_WRAPPER_RENDERING_NAME,
        uid: 'test-uid',
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.component).to.equal(BYOCWrapper);
      expect(result?.dynamic).to.be.true;
      expect(result?.isEmpty).to.be.undefined;
    });

    it('should return default missing component when component not found in component map', () => {
      // Add a dummy entry so componentMap is not empty
      componentMap.set('DummyComponent', () => <div>Dummy</div>);

      const rendering: ComponentRendering = {
        componentName: 'NonExistentComponent',
        uid: 'test-uid',
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.component).to.equal(MissingComponent);
      expect(result?.isEmpty).to.be.true;
    });

    it('should return custom missing component when specified and component not found in component map', () => {
      // Add a dummy entry so componentMap is not empty
      componentMap.set('DummyComponent', () => <div>Dummy</div>);

      const rendering: ComponentRendering = {
        componentName: 'NonExistentComponent',
        uid: 'test-uid',
      };

      const result = getComponentForRendering(
        rendering,
        'test-placeholder',
        componentMap,
        undefined,
        CustomMissingComponent
      );

      expect(result?.component).to.equal(CustomMissingComponent);
      expect(result?.isEmpty).to.be.true;
    });

    it('should return hiddenRenderingComponent when component is hidden', () => {
      const rendering: ComponentRendering = {
        componentName: constants.HIDDEN_RENDERING_NAME,
        uid: 'test-uid',
      };

      const result = getComponentForRendering(
        rendering,
        'test-placeholder',
        componentMap,
        CustomHiddenComponent
      );

      expect(result?.component).to.equal(CustomHiddenComponent);
      expect(result?.isEmpty).to.be.true;
    });

    it('should return default HiddenRendering when component is hidden and no custom hidden component provided', () => {
      const rendering: ComponentRendering = {
        componentName: constants.HIDDEN_RENDERING_NAME,
        uid: 'test-uid',
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.component).to.equal(HiddenRendering);
      expect(result?.isEmpty).to.be.true;
    });

    it('should handle rendering without componentName', () => {
      const rendering: ComponentRendering = {
        componentName: '',
        uid: 'test-uid',
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.isEmpty).to.be.true;
      expect(consoleErrorStub.calledOnce).to.be.true;
    });
  });
});
