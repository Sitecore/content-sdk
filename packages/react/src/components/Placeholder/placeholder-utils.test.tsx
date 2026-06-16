/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import {
  getPlaceholderRenderings,
  getSXAParams,
  getChildComponentProps,
  getComponentForRendering,
} from './placeholder-utils';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import { ComponentType, PlaceholderProps } from './models';
import { ComponentMap, ReactModule } from '../sharedTypes';
import { HIDDEN_RENDERING_NAME } from '@sitecore-content-sdk/content';
import { MissingComponent } from '../MissingComponent';
import { HiddenRendering } from '../HiddenRendering';
import {
  FEaaSComponent,
  FEAAS_COMPONENT_RENDERING_NAME,
  FEaaSWrapper,
  FEAAS_WRAPPER_RENDERING_NAME,
  BYOCComponent,
  BYOC_COMPONENT_RENDERING_NAME,
  BYOCWrapper,
  BYOC_WRAPPER_RENDERING_NAME,
} from '../FEaaS';

describe('placeholder-utils', () => {
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
        styles: 'col-lg-8',
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
        styles: 'custom-styles',
      });
    });

    it('should return empty styles string when no params', () => {
      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
      };

      const result = getSXAParams(rendering);

      expect(result).to.deep.equal({ styles: '' });
    });

    it('should extract styles from DetailedRenderingParams object', () => {
      const rendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
        params: {
          Styles: {
            Value: { value: 'White-Background' },
          },
        },
      } as unknown as ComponentRendering;

      const result = getSXAParams(rendering);

      expect(result).to.deep.equal({
        styles: 'White-Background',
      });
    });

    it('should combine object GridParameters and Styles params', () => {
      const rendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
        params: {
          GridParameters: { Value: { value: 'col-lg-6' } },
          Styles: { Value: { value: 'White-Background' } },
        },
      } as unknown as ComponentRendering;

      const result = getSXAParams(rendering);

      expect(result).to.deep.equal({
        styles: 'col-lg-6 White-Background',
      });
    });
  });

  describe('getChildComponentProps', () => {
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

      const result = getChildComponentProps(placeholderProps, componentRendering);

      expect(result.fields).to.deep.equal({
        placeholderField: { value: 'placeholder-value' },
        renderingField: { value: 'rendering-value' },
        sharedField: { value: 'rendering-shared-value' }, // rendering should override placeholder
      });
      expect(result.rendering).to.equal(componentRendering);
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

      const result = getChildComponentProps(placeholderProps, componentRendering);

      expect(result.params).to.deep.equal({
        placeholderParam: 'placeholder-param-value',
        renderingParam: 'rendering-param-value',
        sharedParam: 'rendering-shared-param', // rendering should override placeholder
        GridParameters: 'col-lg-6',
        Styles: 'custom-class',
        styles: 'col-lg-6 custom-class', // SXA styles should be added
      });
      expect(result.rendering).to.equal(componentRendering);
    });

    it('should return minimal child component props object', () => {
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

      const result = getChildComponentProps(placeholderProps, componentRendering);

      // getChildComponentProps returns only fields, params, and rendering
      expect(result.rendering).to.equal(componentRendering);
      expect(result.fields).to.deep.equal({
        testField: { value: 'test-value' },
      });
      expect(result.params).to.deep.equal({
        testParam: 'test-param',
      });

      // getChildComponentProps does not include these props
      expect((result as any).key).to.be.undefined;
      expect((result as any).customProp).to.be.undefined;
      expect((result as any).componentMap).to.be.undefined;
      expect((result as any).missingComponentComponent).to.be.undefined;
      expect((result as any).hiddenRenderingComponent).to.be.undefined;
      expect((result as any).name).to.be.undefined;
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

    it('should return StudioComponentServerWrapper when ComponentRef is in params', () => {
      const rendering: ComponentRendering = {
        componentName: 'Sample',
        uid: 'test-uid',
        params: {
          ComponentRef: 'api/media/v2/delivery/abc/component/def/default',
          fieldNames: 'default',
        },
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.component).to.be.a('function');
      expect(result?.isEmpty).to.be.false;
      expect(result?.componentType).to.equal('server');
    });

    it('should return StudioComponentServerWrapper when ComponentRef is in params without fieldNames', () => {
      const rendering: ComponentRendering = {
        componentName: 'Sample',
        uid: 'test-uid',
        params: {
          ComponentRef:
            'api/media/v2/delivery/abc/component/def/default|api/media/v2/delivery/abc/component/def/sample',
        },
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.component).to.be.a('function');
      expect(result?.isEmpty).to.be.false;
      expect(result?.componentType).to.equal('server');
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
      expect(!!result?.componentType).to.be.false;
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

    it('should mark returned component as client, when componentType export present and is client', () => {
      const module: ReactModule & { componentType: ComponentType } = {
        default: TestComponent,
        componentType: 'client',
      };
      componentMap.set('TestComponent', module);

      const rendering: ComponentRendering = {
        componentName: 'TestComponent',
        uid: 'test-uid',
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.component).to.equal(TestComponent);
      expect(result?.componentType).to.equal('client');
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
      expect(result?.isEmpty).to.be.false;
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
      expect(result?.isEmpty).to.be.false;
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
      expect(result?.isEmpty).to.be.false;
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
      expect(result?.isEmpty).to.be.false;
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

    it('should return missing component when component variant is not found', () => {
      // Add a dummy entry so componentMap is not empty
      componentMap.set('DummyComponent', {
        default: () => <div>Dummy</div>,
        CustomVariant: () => <div>Custom Variant</div>,
      });

      const rendering: ComponentRendering = {
        componentName: 'DummyComponent',
        uid: 'test-uid',
        params: {
          FieldNames: 'NonExistentVariant',
        },
      };

      const result = getComponentForRendering(rendering, 'test-placeholder', componentMap);

      expect(result?.component).to.equal(MissingComponent);
      expect(result?.isEmpty).to.be.true;
      expect(consoleErrorStub.calledOnce).to.be.true;
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
        componentName: HIDDEN_RENDERING_NAME,
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
        componentName: HIDDEN_RENDERING_NAME,
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
    });
  });
});
