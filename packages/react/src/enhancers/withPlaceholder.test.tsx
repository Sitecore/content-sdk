/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement, ReactNode } from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Page, PageMode } from '@sitecore-content-sdk/core/client';
import { LayoutServicePageState } from '@sitecore-content-sdk/core/layout';
import { convertedDevData as normalModeDevData } from '../test-data/normal-mode-data';
import * as metadataData from '../test-data/metadata-data';
import { withPlaceholder } from '../enhancers/withPlaceholder';
import { SitecoreProvider } from '../components/SitecoreProvider';
import { PlaceholderProps } from '../components/PlaceholderCommon';
import {
  ComponentRendering,
  LayoutServiceData,
  RouteData,
} from '@sitecore-content-sdk/core/layout';
import { Placeholder } from '../components/Placeholder';
import { EnhancedOmit } from '@sitecore-content-sdk/core/utils';

type CalloutProps = PlaceholderProps & {
  [prop: string]: unknown;
  fields: { message: { value?: string } };
  subProp?: ReactElement;
};

type HomeProps = PlaceholderProps & {
  [prop: string]: unknown;
  rendering?: RouteData | ComponentRendering;
  subProp?: ReactElement;
};

const DownloadCallout: React.FC<CalloutProps> = (props) => (
  <div className="download-callout-mock">
    {props.fields?.message ? props.fields.message.value : ''}
  </div>
);

const Home: React.FC<HomeProps> = ({ rendering, name, subProp, ...otherProps }: HomeProps) => {
  if (subProp && !otherProps.reset) {
    return <div className="home-mock-with-prop">{subProp}</div>;
  } else {
    return <div className="home-mock">{otherProps[name] as ReactNode}</div>;
  }
};

const ErrorComponent: React.FC = () => {
  throw 'Error!';
};

const ErrorMessageComponent: React.FC = () => (
  <div className="error-handled">Your error has been... dealt with.</div>
);

const delay = (timeout, promise?) => {
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

const testData = [{ label: 'Dev data', data: normalModeDevData }];

describe('withPlaceholder HOC', () => {
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

  describe('Error handling', () => {
    before(() => {
      // Set to development mode to show error details
      process.env.NODE_ENV = 'development';
    });

    it('should render default error component on wrapped component error', () => {
      const phKey = 'page-content';
      const props: EnhancedOmit<PlaceholderProps, 'page'> = {
        name: phKey,
        rendering: null as unknown as ComponentRendering,
      };
      const Element = withPlaceholder(phKey)(ErrorComponent);
      const renderedComponent = render(
        <SitecoreProvider api={api} componentMap={componentMap} page={getPage()}>
          <Element {...props} />
        </SitecoreProvider>
      );
      expect(
        renderedComponent.container.querySelectorAll('.sc-content-sdk-placeholder-error').length
      ).to.equal(1);
    });

    it('should render custom component error on wrapped component error, when provided', () => {
      const phKey = 'page-content';
      const props: EnhancedOmit<PlaceholderProps, 'page'> = {
        name: phKey,
        rendering: null as unknown as ComponentRendering,
        errorComponent: ErrorMessageComponent,
      };
      const Element = withPlaceholder(phKey)(ErrorComponent);
      const renderedComponent = render(
        <SitecoreProvider api={api} componentMap={componentMap} page={getPage()}>
          <Element {...props} />
        </SitecoreProvider>
      );
      expect(renderedComponent.container.querySelectorAll('.error-handled').length).to.equal(1);
    });

    it('should render nested broken component', () => {
      const component = (
        normalModeDevData.sitecore.route?.placeholders.main as (ComponentRendering | RouteData)[]
      ).find((c) => (c as ComponentRendering).componentName) as ComponentRendering;
      const phKey = 'page-content';
      const props: EnhancedOmit<PlaceholderProps, 'page'> = {
        name: phKey,
        rendering: component,
      };
      const Element = withPlaceholder(phKey)(Home);
      const renderedComponent = render(
        <SitecoreProvider api={api} componentMap={componentMap} page={getPage()}>
          <Element {...props} />
        </SitecoreProvider>
      );

      expect(
        renderedComponent.container.querySelectorAll('.download-callout-mock').length
      ).to.equal(1);
      expect(
        renderedComponent.container.querySelectorAll('.sc-content-sdk-placeholder-error').length
      ).to.equal(1);
      expect(renderedComponent.container.querySelectorAll('h4').length).to.equal(1);
      expect(renderedComponent.container.querySelector('h4')?.outerHTML).to.equal(
        '<h4>Loading component...</h4>'
      );
    });

    it('should render nested components using custom error component', () => {
      const component = (
        normalModeDevData.sitecore.route?.placeholders.main as (ComponentRendering | RouteData)[]
      ).find((c) => (c as ComponentRendering).componentName) as ComponentRendering;
      const phKey = 'page-content';
      const props: EnhancedOmit<PlaceholderProps, 'page'> = {
        name: phKey,
        rendering: component,
        errorComponent: ErrorMessageComponent,
        componentLoadingMessage: 'Custom loading message...',
      };
      const Element = withPlaceholder(phKey)(Home);
      const renderedComponent = render(
        <SitecoreProvider api={api} componentMap={componentMap} page={getPage()}>
          <Element {...props} />
        </SitecoreProvider>
      );

      expect(
        renderedComponent.container.querySelectorAll('.download-callout-mock').length
      ).to.equal(1);
      expect(renderedComponent.container.querySelectorAll('.error-handled').length).to.equal(1);
      expect(renderedComponent.container.querySelectorAll('h4').length).to.equal(1);
      expect(renderedComponent.container.querySelector('h4')?.outerHTML).to.equal(
        '<h4>Custom loading message...</h4>'
      );
    });
  });

  testData.forEach((dataSet) => {
    describe(`with ${dataSet.label}`, () => {
      it('should render a placeholder with given key', () => {
        const component = (
          dataSet.data.sitecore.route?.placeholders.main as (ComponentRendering | RouteData)[]
        ).find((c) => (c as ComponentRendering).componentName) as ComponentRendering;
        const phKey = 'page-content';
        const props: EnhancedOmit<PlaceholderProps, 'page'> = {
          name: phKey,
          rendering: component,
        };
        const Element = withPlaceholder(phKey)(Home);
        const renderedComponent = render(
          <SitecoreProvider api={api} componentMap={componentMap} page={getPage()}>
            <Element {...props} />
          </SitecoreProvider>
        );
        expect(
          renderedComponent.container.querySelectorAll('.download-callout-mock').length
        ).to.equal(1);
      });

      it('should render a placeholder with given key and prop', () => {
        const component = (
          dataSet.data.sitecore.route?.placeholders.main as (ComponentRendering | RouteData)[]
        ).find((c) => (c as ComponentRendering).componentName) as ComponentRendering;
        const phKeyAndProp = {
          placeholder: 'page-header',
          prop: 'subProp',
        };
        const props: EnhancedOmit<PlaceholderProps, 'page'> = {
          name: 'page-header',
          rendering: component,
        };
        const Element = withPlaceholder(phKeyAndProp)(Home);
        const renderedComponent = render(
          <SitecoreProvider api={api} componentMap={componentMap} page={getPage()}>
            <Element {...props} />
          </SitecoreProvider>
        );
        expect(
          renderedComponent.container.querySelectorAll('.home-mock-with-prop').length
        ).to.not.equal(0);
        expect(renderedComponent.container.querySelectorAll('.jumbotron-mock').length).to.equal(1);
      });

      it('should use propsTransformer method when provided', () => {
        const component = (
          dataSet.data.sitecore.route?.placeholders.main as (ComponentRendering | RouteData)[]
        ).find((c) => (c as ComponentRendering).componentName) as ComponentRendering;
        const phKeyAndProp = {
          placeholder: 'page-header',
          prop: 'subProp',
        };
        const phOptions = {
          propsTransformer: (props) => {
            return { ...props, reset: true };
          },
        };
        const props: EnhancedOmit<PlaceholderProps, 'page'> = {
          name: 'page-header',
          rendering: component,
        };
        const Element = withPlaceholder(phKeyAndProp, phOptions)(Home);
        const renderedComponent = render(
          <SitecoreProvider api={api} componentMap={componentMap} page={getPage()}>
            <Element {...props} />
          </SitecoreProvider>
        );
        expect(
          renderedComponent.container.querySelectorAll('.home-mock-with-prop').length
        ).to.equal(0);
        expect(renderedComponent.container.querySelectorAll('.home-mock').length).to.not.equal(0);
      });
    });
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

    const componentMap = new Map<string, React.FC>();

    componentMap.set('Header', () => (
      <div className="header-wrapper">
        <Placeholder
          name="logo"
          rendering={metadataData.layoutData.sitecore.route.placeholders.main[0]}
        />
      </div>
    ));
    componentMap.set('Logo', () => <div className="Logo-mock" />);

    it('should render a placeholder with given key', () => {
      const component = layoutData.sitecore.route;
      const phKey = 'main';
      const props: EnhancedOmit<PlaceholderProps, 'page'> = {
        name: phKey,
        rendering: component,
      };
      const Element = withPlaceholder(phKey)(Home);
      const renderedComponent = render(
        <SitecoreProvider api={api} componentMap={componentMap} page={editModePage}>
          <Element {...props} />
        </SitecoreProvider>
      );
      expect(renderedComponent?.container.innerHTML).to.equal(
        [
          '<div class="home-mock">',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="main_00000000-0000-0000-0000-000000000000"></code>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="nested123"></code>',
          '<div class="header-wrapper">',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="logo_nested123"></code>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="deep123"></code>',
          '<div class="Logo-mock"></div>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
          '</div>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
          '</div>',
        ].join('')
      );
    });

    it('should render a placeholder with given key and prop', () => {
      const component = layoutData.sitecore.route;
      const phKey = 'main';
      const phKeyAndProp = {
        placeholder: phKey,
        prop: 'subProp',
      };
      const props: EnhancedOmit<PlaceholderProps, 'page'> = {
        name: phKey,
        rendering: component,
      };
      const Element = withPlaceholder(phKeyAndProp)(Home);
      const renderedComponent = render(
        <SitecoreProvider api={api} componentMap={componentMap} page={editModePage}>
          <Element {...props} />
        </SitecoreProvider>
      );

      expect(renderedComponent?.container.innerHTML).to.equal(
        [
          '<div class="home-mock-with-prop">',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="main_00000000-0000-0000-0000-000000000000"></code>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="nested123"></code>',
          '<div class="header-wrapper">',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="logo_nested123"></code>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="deep123"></code>',
          '<div class="Logo-mock"></div>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
          '</div>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
          '</div>',
        ].join('')
      );
    });

    it('should render code blocks even if placeholder is empty', () => {
      const component = layoutDataWithEmptyPlaceholder.sitecore.route;
      const phKey = 'main';
      const props: EnhancedOmit<PlaceholderProps, 'page'> = {
        name: phKey,
        rendering: component,
      };
      const Element = withPlaceholder(phKey)(Home);
      const renderedComponent = render(
        <SitecoreProvider api={api} componentMap={componentMap} page={editModePage}>
          <Element {...props} />
        </SitecoreProvider>
      );

      expect(renderedComponent?.container.innerHTML).to.equal(
        [
          '<div class="home-mock">',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="main_00000000-0000-0000-0000-000000000000"></code>',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
          '</div>',
        ].join('')
      );
    });

    it('should render missing component with code blocks if component is not registered', () => {
      const component = layoutDataWithUnknownComponent.sitecore.route;
      const phKey = 'main';
      const props: EnhancedOmit<PlaceholderProps, 'page'> = {
        name: phKey,
        rendering: component,
      };
      const Element = withPlaceholder(phKey)(Home);
      const renderedComponent = render(
        <SitecoreProvider api={api} componentMap={componentMap} page={editModePage}>
          <Element {...props} />
        </SitecoreProvider>
      );

      expect(renderedComponent?.container.innerHTML).to.equal(
        [
          '<div class="home-mock">',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="main_00000000-0000-0000-0000-000000000000"></code>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="123"></code>',
          '<div style="background: darkorange; outline: 5px solid orange; padding: 10px; color: white; max-width: 500px;"><h2>Unknown</h2><p>Content SDK component is missing React implementation. See the developer console for more information.</p></div>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
          '</div>',
        ].join('')
      );
    });

    it('should render dynamic placeholder', () => {
      const phKey = 'container-1';
      const layoutData = layoutDataForNestedDynamicPlaceholder('container-{*}');
      const component = layoutData.sitecore.route;
      const props: EnhancedOmit<PlaceholderProps, 'page'> = {
        name: phKey,
        rendering: component,
      };
      const Element = withPlaceholder(phKey)(Home);
      const renderedComponent = render(
        <SitecoreProvider api={api} componentMap={componentMap} page={editModePage}>
          <Element {...props} />
        </SitecoreProvider>
      );

      expect(renderedComponent?.container.innerHTML).to.equal(
        [
          '<div class="home-mock">',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="container-{*}_00000000-0000-0000-0000-000000000000"></code>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="nested123"></code>',
          '<div class="header-wrapper">',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="logo_nested123"></code>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="deep123"></code>',
          '<div class="Logo-mock"></div><code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
          '</div>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
          '</div>',
        ].join('')
      );
    });

    it('should render double digit dynamic placeholder', () => {
      const phKey = 'container-1-2';
      const layoutData = layoutDataForNestedDynamicPlaceholder('container-1-{*}');
      const component = layoutData.sitecore.route;
      const props: EnhancedOmit<PlaceholderProps, 'page'> = {
        name: phKey,
        rendering: component,
      };
      const Element = withPlaceholder(phKey)(Home);
      const renderedComponent = render(
        <SitecoreProvider api={api} componentMap={componentMap} page={editModePage}>
          <Element {...props} />
        </SitecoreProvider>
      );

      expect(renderedComponent?.container.innerHTML).to.equal(
        [
          '<div class="home-mock">',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="container-1-{*}_00000000-0000-0000-0000-000000000000"></code>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="nested123"></code>',
          '<div class="header-wrapper">',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="logo_nested123"></code>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="deep123"></code>',
          '<div class="Logo-mock"></div><code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
          '</div>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
          '</div>',
        ].join('')
      );
    });
  });
});
