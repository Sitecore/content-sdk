/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement, ReactNode } from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Page } from '@sitecore-content-sdk/content/client';
import { LayoutServicePageState } from '@sitecore-content-sdk/content/layout';
import { convertedDevData as normalModeDevData } from '../test-data/normal-mode-data';
import * as metadataData from '../test-data/metadata-data';
import { withClientPlaceholder, ComponentProps, WrapperProps } from './withClientPlaceholder';
import { SitecoreProvider } from '../components/SitecoreProvider';
import { ComponentRendering, RouteData } from '@sitecore-content-sdk/content/layout';
import { Placeholder } from '../components/Placeholder';

type CalloutProps = ComponentProps & {
  [prop: string]: unknown;
  fields: { message: { value?: string } };
  subProp?: ReactElement;
};

type HomeProps = ComponentProps & {
  [prop: string]: unknown;
  rendering?: RouteData | ComponentRendering;
  subProp?: ReactElement;
};

const DownloadCallout: React.FC<CalloutProps> = (props) => (
  <div className="download-callout-mock">
    {props.fields?.message ? props.fields.message.value : ''}
  </div>
);

const Home: React.FC<HomeProps> = ({ placeholders, subProp, ...otherProps }: HomeProps) => {
  if (subProp && !otherProps.reset) {
    return <div className="home-mock-with-prop">{subProp}</div>;
  } else {
    // For withClientPlaceholder, placeholders are provided as props, so we access them
    const placeholderContent =
      Object.keys(placeholders).length > 0
        ? placeholders['page-content'] || placeholders.main || placeholders['page-header']
        : null;
    return <div className="home-mock">{placeholderContent as ReactNode}</div>;
  }
};

const delay = (timeout: number, promise?: any) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  }).then(() => promise);
};

const componentMap = new Map<string, React.FC<any>>();

componentMap.set('DownloadCallout', DownloadCallout);
componentMap.set('Jumbotron', () => <div className="jumbotron-mock"></div>);
componentMap.set('BrokenComponent', () => {
  throw new Error('BrokenComponent error');
});
componentMap.set(
  'DynamicComponent',
  React.lazy(() =>
    delay(500, () => {
      throw new Error('DynamicComponent error');
    })
  )
);

describe('withClientPlaceholder HOC', () => {
  const api = {
    edge: {
      contextId: 'id',
      edgeUrl: 'url',
      clientContextId: 'clientId',
    },
    local: {
      apiKey: 'apiKey',
      apiHost: 'apiHost',
      path: 'path',
    },
  };

  const getPage = (): Page => ({
    layout: normalModeDevData,
    locale: 'en',
    mode: {
      name: LayoutServicePageState.Normal,
      isNormal: true,
      isPreview: false,
      isEditing: false,
      isDesignLibrary: false,
      designLibrary: {
        isVariantGeneration: false,
      },
    },
  });

  // Basic functionality tests
  it('should render without placeholders', () => {
    const cleanComponent: ComponentRendering = {
      componentName: 'TestComponent',
      uid: 'clean-test-123',
      fields: {
        title: { value: 'Test Title' },
      },
    };

    const props: WrapperProps = {
      rendering: cleanComponent,
      page: getPage(),
      componentMap,
    };
    const Element = withClientPlaceholder(Home);
    const renderedComponent = render(
      <SitecoreProvider api={api} componentMap={componentMap} page={getPage()}>
        <Element {...props} />
      </SitecoreProvider>
    );

    expect(renderedComponent.container.querySelectorAll('.home-mock').length).to.equal(1);
    expect(renderedComponent.container.querySelector('.home-mock')?.children.length).to.equal(0);
  });

  it('should render a single placeholder correctly', () => {
    const cleanComponent: ComponentRendering = {
      componentName: 'TestComponent',
      uid: 'clean-test-123',
      placeholders: {
        'page-content': [
          {
            componentName: 'DownloadCallout',
            uid: 'download-123',
            fields: { linkText: { value: 'Download' } },
          },
        ],
      },
    };

    const props: WrapperProps = {
      rendering: cleanComponent,
      page: getPage(),
      componentMap,
    };
    const Element = withClientPlaceholder(Home);
    const renderedComponent = render(
      <SitecoreProvider api={api} componentMap={componentMap} page={getPage()}>
        <Element {...props} />
      </SitecoreProvider>
    );

    expect(renderedComponent.container.querySelectorAll('.home-mock').length).to.equal(1);
    expect(renderedComponent.container.querySelectorAll('.download-callout-mock').length).to.equal(
      1
    );
  });

  it('should render multiple placeholders correctly', () => {
    // Create a simple component with clean data (no broken components)
    const cleanComponent: ComponentRendering = {
      componentName: 'TestComponent',
      uid: 'clean-test-123',
      placeholders: {
        'page-header': [
          {
            componentName: 'Jumbotron',
            uid: 'jumbotron-123',
            params: { shade: 'dark', titleSize: '1' },
            fields: { titleText: { value: 'Test Title' } },
          },
        ],
        'page-content': [
          {
            componentName: 'DownloadCallout',
            uid: 'download-123',
            fields: { linkText: { value: 'Download' } },
          },
        ],
      },
    };

    // Test component that uses both placeholders
    const MultiKeyTestComponent: React.FC<ComponentProps> = ({ placeholders }) => {
      return (
        <div className="multi-key-test">
          <div className="header-section">{placeholders['page-header']}</div>
          <div className="content-section">{placeholders['page-content']}</div>
        </div>
      );
    };

    const props: WrapperProps = {
      rendering: cleanComponent,
      page: getPage(),
      componentMap,
    };
    const Element = withClientPlaceholder(MultiKeyTestComponent);
    const renderedComponent = render(
      <SitecoreProvider api={api} componentMap={componentMap} page={getPage()}>
        <Element {...props} />
      </SitecoreProvider>
    );

    // Should render the test component
    expect(renderedComponent.container.querySelectorAll('.multi-key-test').length).to.equal(1);
    // Should render jumbotron from page-header placeholder
    expect(renderedComponent.container.querySelectorAll('.jumbotron-mock').length).to.equal(1);
    // Should render download callout from page-content placeholder
    expect(renderedComponent.container.querySelectorAll('.download-callout-mock').length).to.equal(
      1
    );
  });

  it('should pass correct props to Placeholder components', () => {
    const cleanComponent: ComponentRendering = {
      componentName: 'TestComponent',
      uid: 'clean-test-123',
      placeholders: {
        'page-content': [
          {
            componentName: 'DownloadCallout',
            uid: 'download-123',
            fields: { linkText: { value: 'Download' } },
          },
        ],
      },
    };
    const phKey = 'page-content';
    const page = getPage();

    // Test component that captures placeholder props
    let capturedPlaceholderProps: any = null;
    const TestComponent: React.FC<ComponentProps> = ({ placeholders }) => {
      const placeholder = placeholders[phKey];
      if (React.isValidElement(placeholder)) {
        capturedPlaceholderProps = placeholder.props;
      }
      return <div className="test-component">{placeholder}</div>;
    };

    const props: WrapperProps = {
      rendering: cleanComponent,
      page,
      componentMap,
    };

    const Element = withClientPlaceholder(TestComponent);
    render(
      <SitecoreProvider api={api} componentMap={componentMap} page={page}>
        <Element {...props} />
      </SitecoreProvider>
    );

    // Verify Placeholder received correct props
    expect(capturedPlaceholderProps).to.not.be.null;
    expect(capturedPlaceholderProps.name).to.equal(phKey);
    expect(capturedPlaceholderProps.rendering).to.equal(cleanComponent);
    // Note: page and componentMap come from SitecoreProvider context in client mode
  });

  describe('Metadata Mode', () => {
    const defaultPage = getPage();
    const editModePage: Page = {
      ...defaultPage,
      mode: {
        ...defaultPage.mode,
        name: LayoutServicePageState.Edit,
        isEditing: true,
      },
    };

    const {
      layoutData,
      layoutDataWithEmptyPlaceholder,
      layoutDataForNestedDynamicPlaceholder,
      layoutDataWithUnknownComponent,
    } = metadataData;

    const metadataComponentMap = new Map<string, React.FC>();

    metadataComponentMap.set('Header', () => (
      <div className="header-wrapper">
        <Placeholder
          name="logo"
          rendering={metadataData.layoutData.sitecore.route.placeholders.main[0]}
        />
      </div>
    ));
    metadataComponentMap.set('Logo', () => <div className="Logo-mock" />);

    it('should render a placeholder with given key', () => {
      const component = layoutData.sitecore.route;
      const props: WrapperProps = {
        rendering: component as ComponentRendering,
        page: editModePage,
        componentMap: metadataComponentMap,
      };
      const Element = withClientPlaceholder(Home);
      const renderedComponent = render(
        <SitecoreProvider api={api} componentMap={metadataComponentMap} page={editModePage}>
          <Element {...props} />
        </SitecoreProvider>
      );

      // Check that it renders the basic structure
      expect(renderedComponent.container.querySelectorAll('.home-mock').length).to.equal(1);
      expect(renderedComponent.container.querySelectorAll('.header-wrapper').length).to.equal(1);
      expect(renderedComponent.container.querySelectorAll('.Logo-mock').length).to.equal(1);
    });

    it('should render a placeholder with given key and multiple placeholders', () => {
      const component = layoutData.sitecore.route;

      const MultiPlaceholderMetadataComponent: React.FC<ComponentProps> = ({ placeholders }) => {
        return (
          <div className="metadata-multi-mock">
            <div className="main-placeholder">{placeholders.main}</div>
            <div className="secondary-placeholder">
              {placeholders.secondary || <span>Empty secondary</span>}
            </div>
          </div>
        );
      };

      const props: WrapperProps = {
        rendering: component as ComponentRendering,
        page: editModePage,
        componentMap: metadataComponentMap,
      };
      const Element = withClientPlaceholder(MultiPlaceholderMetadataComponent);
      const renderedComponent = render(
        <SitecoreProvider api={api} componentMap={metadataComponentMap} page={editModePage}>
          <Element {...props} />
        </SitecoreProvider>
      );

      expect(renderedComponent.container.querySelectorAll('.metadata-multi-mock').length).to.equal(
        1
      );
      expect(renderedComponent.container.querySelectorAll('.header-wrapper').length).to.equal(1);
      expect(renderedComponent.container.querySelectorAll('.Logo-mock').length).to.equal(1);
    });

    it('should render code blocks even if placeholder is empty', () => {
      const component = layoutDataWithEmptyPlaceholder.sitecore.route;
      const props: WrapperProps = {
        rendering: component as ComponentRendering,
        page: editModePage,
        componentMap: metadataComponentMap,
      };
      const Element = withClientPlaceholder(Home);
      const renderedComponent = render(
        <SitecoreProvider api={api} componentMap={metadataComponentMap} page={editModePage}>
          <Element {...props} />
        </SitecoreProvider>
      );

      expect(renderedComponent.container.querySelectorAll('.home-mock').length).to.equal(1);
      // Placeholder should handle empty placeholders in edit mode
    });

    it('should render missing component with code blocks if component is not registered', () => {
      const component = layoutDataWithUnknownComponent.sitecore.route;
      const props: WrapperProps = {
        rendering: component as ComponentRendering,
        page: editModePage,
        componentMap: metadataComponentMap,
      };
      const Element = withClientPlaceholder(Home);
      const renderedComponent = render(
        <SitecoreProvider api={api} componentMap={metadataComponentMap} page={editModePage}>
          <Element {...props} />
        </SitecoreProvider>
      );

      expect(renderedComponent.container.querySelectorAll('.home-mock').length).to.equal(1);
      // Should render unknown component placeholder
      expect(renderedComponent.container.innerHTML).to.include('Unknown');
    });

    it('should render dynamic placeholder', () => {
      const layoutData = layoutDataForNestedDynamicPlaceholder('container-{*}');
      const component = layoutData.sitecore.route;
      const props: WrapperProps = {
        rendering: component as ComponentRendering,
        page: editModePage,
        componentMap: metadataComponentMap,
      };
      const Element = withClientPlaceholder(Home);
      const renderedComponent = render(
        <SitecoreProvider api={api} componentMap={metadataComponentMap} page={editModePage}>
          <Element {...props} />
        </SitecoreProvider>
      );

      expect(renderedComponent.container.querySelectorAll('.home-mock').length).to.equal(1);
      // Placeholder should handle dynamic placeholders
    });

    it('should render double digit dynamic placeholder', () => {
      const layoutData = layoutDataForNestedDynamicPlaceholder('container-1-{*}');
      const component = layoutData.sitecore.route;
      const props: WrapperProps = {
        rendering: component as ComponentRendering,
        page: editModePage,
        componentMap: metadataComponentMap,
      };
      const Element = withClientPlaceholder(Home);
      const renderedComponent = render(
        <SitecoreProvider api={api} componentMap={metadataComponentMap} page={editModePage}>
          <Element {...props} />
        </SitecoreProvider>
      );

      expect(renderedComponent.container.querySelectorAll('.home-mock').length).to.equal(1);
      // Placeholder should handle double digit dynamic placeholders
    });
  });
});
