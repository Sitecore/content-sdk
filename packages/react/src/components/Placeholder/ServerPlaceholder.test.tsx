/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import {
  ComponentRendering,
  LayoutServicePageState,
  RouteData,
} from '@sitecore-content-sdk/core/layout';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import React from 'react';
import { createSandbox, SinonSandbox } from 'sinon';
import {
  byocWrapperData,
  feaasWrapperData,
  convertedDevData as normalModeDevData,
  convertedLayoutServiceData as normalModeLsData,
  sxaRenderingColumnSplitterVariant,
  sxaRenderingVariantDataWithCommonContainerName as sxaRenderingCommonContainerName,
  sxaRenderingVariantData,
  sxaRenderingVariantDoubleDigitDynamicPlaceholder as sxaRenderingDoubleDigitContainerName,
  sxaRenderingVariantDataWithoutCommonContainerName as sxaRenderingWithoutContainerName,
} from '../../test-data/normal-mode-data';
import * as metadataData from '../../test-data/metadata-data';
import * as SxaRichText from '../../test-data/sxa-rich-text';
import * as BYOCComponent from '../BYOCComponent';
import * as BYOCWrapper from '../BYOCWrapper';
import * as FEAASComponent from '../FEaaSComponent';
import * as FEAASWrapper from '../FEaaSWrapper';
import * as HiddenRendering from '../HiddenRendering';
import * as ErrorBoundary from '../ErrorBoundary';
import { MissingComponent, MissingComponentProps } from '../MissingComponent';
import { ServerPlaceholder } from './ServerPlaceholder';
import { ComponentProps } from './models';
import { Page, PageMode } from '@sitecore-content-sdk/core/client';

describe('Server Placeholder logic', () => {
  // Global sinon sandbox for all tests
  let sandbox: SinonSandbox;

  const componentMap = new Map<string, React.FC>();
  // Mock dynamic component for testing
  const MockDynamicComponent: React.FC = () => <div className="dynamic-component">No error</div>;
  const dynamicComponent = React.lazy(() => Promise.resolve({ default: MockDynamicComponent }));

  const getPage = (): Page => ({
    locale: 'en',
    layout: {
      sitecore: {
        context: {},
        route: null,
      },
    },
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

  // pass otherProps to page-content to test property cascading through the ServerPlaceholder
  const Home: React.FC<{ [prop: string]: unknown; rendering?: RouteData | ComponentRendering }> = ({
    rendering,
    render,
    renderEach,
    renderEmpty,
    ...otherProps
  }) => (
    <div className="home-mock">
      <ServerPlaceholder
        name="page-header"
        rendering={rendering}
        componentMap={componentMap}
        page={getPage()}
      />
      <ServerPlaceholder
        name="page-content"
        rendering={rendering}
        componentMap={componentMap}
        page={getPage()}
        {...otherProps}
      />
    </div>
  );

  componentMap.set('Home', Home);

  const DownloadCallout: React.FC<{
    [prop: string]: unknown;
    fields?: { message?: { value?: string } };
    extraDiv?: boolean;
  }> = (props) => (
    <div className="download-callout-mock">
      {props.fields?.message ? props.fields.message.value : ''}
      {props.extraDiv ? <div className="extra">extra!</div> : null}
    </div>
  );

  componentMap.set('DownloadCallout', DownloadCallout);
  componentMap.set('Jumbotron', () => <div className="jumbotron-mock" />);
  componentMap.set('DynamicComponent', dynamicComponent);

  // Global setup and teardown for sinon sandbox
  beforeEach(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('<ServerPlaceholder />', () => {
    const testData = [
      { label: 'Dev data', data: normalModeDevData },
      { label: 'LayoutService data - Editing off', data: normalModeLsData },
    ];

    testData.forEach((dataSet) => {
      describe(`with ${dataSet.label}`, () => {
        it('should render a placeholder with given key', () => {
          const page = getPage();
          page.layout = dataSet.data;
          const component = (
            dataSet.data.sitecore.route.placeholders.main as (ComponentRendering | RouteData)[]
          ).find((c) => (c as ComponentRendering).componentName);
          const phKey = 'page-content';

          const renderedComponent = render(
            <ServerPlaceholder
              name={phKey}
              rendering={component}
              componentMap={componentMap}
              page={page}
            />
          );

          expect(
            renderedComponent.container.querySelectorAll('.download-callout-mock').length
          ).to.equal(1);
        });

        it('should render nested placeholders', () => {
          const page = getPage();
          page.layout = dataSet.data;
          const component = dataSet.data.sitecore.route as RouteData;
          const phKey = 'main';

          const renderedComponent = render(
            <ServerPlaceholder
              name={phKey}
              rendering={component}
              componentMap={componentMap}
              page={page}
            />
          );

          expect(
            renderedComponent.container.querySelectorAll('.download-callout-mock').length
          ).to.equal(1);
        });

        it('should render components based on the renderEach function', () => {
          const page = getPage();
          page.layout = dataSet.data;
          const component = dataSet.data.sitecore.route as RouteData;
          const phKey = 'main';

          const renderedComponent = render(
            <ServerPlaceholder
              name={phKey}
              rendering={component}
              componentMap={componentMap}
              page={page}
              renderEach={(comp) => <div className="wrapper">{comp}</div>}
            />
          );

          expect(renderedComponent.container.querySelectorAll('.wrapper').length).to.equal(1);
        });

        it('should render components based on the render function', () => {
          const page = getPage();
          page.layout = dataSet.data;
          const component = dataSet.data.sitecore.route as RouteData;
          const phKey = 'main';

          const renderedComponent = render(
            <ServerPlaceholder
              name={phKey}
              rendering={component}
              componentMap={componentMap}
              page={page}
              render={(comp) => <div className="wrapper">{comp}</div>}
            />
          );

          expect(renderedComponent.container.querySelectorAll('.wrapper').length).to.equal(1);
        });

        it('should render empty placeholder', () => {
          const page = getPage();
          page.layout = dataSet.data;
          const component = dataSet.data.sitecore.route as RouteData;
          const phKey = 'mainEmpty';

          const renderedComponent = render(
            <ServerPlaceholder
              name={phKey}
              rendering={component}
              componentMap={componentMap}
              page={page}
              render={() => null}
            />
          );

          expect(renderedComponent.container.innerHTML).to.be.equal('');
        });
      });

      it('should render output based on the renderEmpty function in case of no renderings', () => {
        const page = getPage();
        page.layout = dataSet.data;
        const component = dataSet.data.sitecore.route as RouteData;
        const renderings = component.placeholders.main.filter(
          (c) => !(c as ComponentRendering).componentName
        );
        const myComponent = {
          ...component,
          placeholders: {
            ...component.placeholders,
            main: [...renderings],
          },
        };

        const phKey = 'main';

        const renderedComponent = render(
          <ServerPlaceholder
            name={phKey}
            rendering={myComponent}
            componentMap={componentMap}
            page={page}
            renderEmpty={(comp) => <div className="wrapper">{comp}</div>}
          />
        );

        expect(renderedComponent.container.querySelectorAll('.wrapper').length).to.equal(1);
        expect(
          renderedComponent.container.querySelectorAll('.download-callout-mock').length
        ).to.equal(0);
        expect(renderedComponent.container.querySelectorAll('.home-mock').length).to.equal(0);
        expect(renderedComponent.container.querySelectorAll('.jumbotron-mock').length).to.equal(0);
      });

      it('should pass properties to nested components', () => {
        const page = getPage();
        page.layout = dataSet.data;
        const component = dataSet.data.sitecore.route as any;
        const phKey = 'main';
        const expectedMessage = (component.placeholders.main as any[]).find((c) => c.componentName)
          .fields.message;

        const renderedComponent = render(
          <ServerPlaceholder
            name={phKey}
            rendering={component}
            componentMap={componentMap}
            page={page}
          />
        );

        expect(
          renderedComponent.container
            .querySelector('.download-callout-mock')
            ?.innerHTML.indexOf(expectedMessage.value) !== -1
        ).to.be.true;
      });

      it('should apply modifyComponentProps to the final props', () => {
        const page = getPage();
        page.layout = dataSet.data;
        const component = dataSet.data.sitecore.route as any;
        const phKey = 'main';
        const expectedMessage = (component.placeholders.main as any[]).find((c) => c.componentName)
          .fields.message;

        const modifyComponentProps = (props: ComponentProps) => {
          if (props.rendering?.componentName === 'DownloadCallout') {
            return {
              ...props,
              extraDiv: true,
            };
          }

          return props;
        };

        const renderedComponent = render(
          <ServerPlaceholder
            name={phKey}
            rendering={component}
            componentMap={componentMap}
            page={page}
            modifyComponentProps={modifyComponentProps}
          />
        );

        expect(
          renderedComponent.container
            .querySelector('.download-callout-mock')
            ?.innerHTML.indexOf(expectedMessage.value) !== -1
        ).to.be.true;
        expect(renderedComponent.container.querySelectorAll('div.extra').length).to.equal(1);
      });
    });
  });

  describe('ServerPlaceholder SXA rendering variants', () => {
    const componentMap = new Map();

    componentMap.set('RichText', SxaRichText);

    it('should render', () => {
      const page = getPage();
      page.layout = sxaRenderingVariantData;
      const component = sxaRenderingVariantData.sitecore.route as RouteData;
      const phKey = 'main';

      const renderedComponent = render(
        <ServerPlaceholder
          name={phKey}
          rendering={component}
          componentMap={componentMap}
          page={page}
        />
      );

      expect(renderedComponent.container.querySelectorAll('.rendering-variant').length).to.equal(1);
      expect(
        renderedComponent.container.querySelector('.rendering-variant')?.getAttribute('class')
      ).to.equal(
        'rendering-variant col-9|col-sm-10|col-md-12|col-lg-6|col-xl-7|col-xxl-8 test-css-class-x'
      );
      expect(renderedComponent.container.querySelectorAll('.title').length).to.equal(1);
      expect(renderedComponent.container.querySelector('.title')?.textContent).to.equal(
        'Rich Text Rendering Variant'
      );
      expect(renderedComponent.container.querySelectorAll('.text').length).to.equal(1);
      expect(renderedComponent.container.querySelector('.text')?.textContent).to.equal(
        'Test RichText'
      );
    });

    it('should render with container-{*} type dynamic placeholder', () => {
      const page = getPage();
      page.layout = sxaRenderingCommonContainerName;
      const component = sxaRenderingCommonContainerName.sitecore.route as RouteData;
      const phKey = 'container-1';

      const renderedComponent = render(
        <ServerPlaceholder
          name={phKey}
          rendering={component}
          componentMap={componentMap}
          page={page}
        />
      );

      expect(renderedComponent.container.querySelectorAll('.rendering-variant').length).to.equal(1);
      expect(
        renderedComponent.container.querySelector('.rendering-variant')?.getAttribute('class')
      ).to.equal(
        'rendering-variant col-9|col-sm-10|col-md-12|col-lg-6|col-xl-7|col-xxl-8 test-css-class-x'
      );
      expect(renderedComponent.container.querySelectorAll('.title').length).to.equal(1);
      expect(renderedComponent.container.querySelector('.title')?.textContent).to.equal(
        'Rich Text Rendering Variant'
      );
    });

    it('should not render without container-{*} type dynamic placeholder', () => {
      const page = getPage();
      page.layout = sxaRenderingWithoutContainerName;
      const component = sxaRenderingWithoutContainerName.sitecore.route as RouteData;
      const phKey = 'richText';

      const renderedComponent = render(
        <ServerPlaceholder
          name={phKey}
          rendering={component}
          componentMap={componentMap}
          page={page}
        />
      );

      expect(renderedComponent.container.querySelectorAll('.rendering-variant').length).to.equal(0);
      expect(renderedComponent.container.querySelectorAll('.title').length).to.equal(0);
    });

    it('should render with dynamic-1-{*} type dynamic placeholder', () => {
      const page = getPage();
      page.layout = sxaRenderingDoubleDigitContainerName;
      const component = sxaRenderingDoubleDigitContainerName.sitecore.route as RouteData;
      const phKey = 'dynamic-1-{*}';

      const renderedComponent = render(
        <ServerPlaceholder
          name={phKey}
          rendering={component}
          componentMap={componentMap}
          page={page}
        />
      );

      expect(renderedComponent.container.querySelectorAll('.rendering-variant').length).to.equal(1);
      expect(
        renderedComponent.container.querySelector('.rendering-variant')?.getAttribute('class')
      ).to.equal(
        'rendering-variant col-9|col-sm-10|col-md-12|col-lg-6|col-xl-7|col-xxl-8 test-css-class-x'
      );
      expect(renderedComponent.container.querySelectorAll('.title').length).to.equal(1);
      expect(renderedComponent.container.querySelector('.title')?.textContent).to.equal(
        'Rich Text Rendering Variant'
      );
    });

    it('should render another rendering variant', () => {
      const page = getPage();
      page.layout = sxaRenderingVariantData;
      const component = sxaRenderingVariantData.sitecore.route as RouteData;
      const phKey = 'main-second';

      const renderedComponent = render(
        <ServerPlaceholder
          name={phKey}
          rendering={component}
          componentMap={componentMap}
          page={page}
        />
      );

      expect(renderedComponent.container.querySelectorAll('.rendering-variant').length).to.equal(1);
      expect(
        renderedComponent.container.querySelector('.rendering-variant')?.getAttribute('class')
      ).to.equal(
        'rendering-variant col-9|col-sm-10|col-md-12|col-lg-6|col-xl-7|col-xxl-8 test-css-class-y'
      );
      expect(renderedComponent.container.querySelectorAll('.default').length).to.equal(1);
    });

    it('should render column splitter rendering variant', () => {
      const page = getPage();
      page.layout = sxaRenderingColumnSplitterVariant;
      const component = sxaRenderingColumnSplitterVariant.sitecore.route as RouteData;
      const phKey = 'column-1-{*}';

      const renderedComponent = render(
        <ServerPlaceholder
          name={phKey}
          rendering={component}
          componentMap={componentMap}
          page={page}
        />
      );

      expect(renderedComponent.container.querySelectorAll('.rendering-variant').length).to.equal(1);
      expect(
        renderedComponent.container.querySelector('.rendering-variant')?.getAttribute('class')
      ).to.equal(
        'rendering-variant col-9|col-sm-10|col-md-12|col-lg-6|col-xl-7|col-xxl-8 test-css-class-y'
      );
      expect(renderedComponent.container.querySelectorAll('.default').length).to.equal(1);
    });
  });

  describe('ServerPlaceholder BYOC fallback', () => {
    let byocComponentStub;
    let byocWrapperStub;

    const componentMap = new Map();

    xit('should render', () => {
      const page = getPage();
      page.layout = byocWrapperData;
      const component = byocWrapperData.sitecore.route as RouteData;
      const phKey = 'main';

      byocComponentStub = sandbox
        .stub(BYOCComponent, 'BYOCComponent')
        .callsFake(() => <p className="byoc-component">Foo</p>);

      byocWrapperStub = sandbox.stub(BYOCWrapper, 'BYOCWrapper').callsFake(() => (
        <div className="byoc-wrapper">
          <BYOCComponent.BYOCComponent />
        </div>
      ));

      const renderedComponent = render(
        <ServerPlaceholder
          name={phKey}
          rendering={component}
          componentMap={componentMap}
          page={page}
        />
      );

      expect(renderedComponent.container.querySelectorAll('.byoc-component').length).to.equal(2);
      expect(renderedComponent.container.querySelectorAll('.byoc-wrapper').length).to.equal(1);
    });

    xit('should render ErrorBoundary without Suspense for byoc wrapper', () => {
      const page = getPage();
      page.layout = byocWrapperData;
      const component = byocWrapperData.sitecore.route as RouteData;
      const phKey = 'main';

      byocComponentStub = sandbox
        .stub(BYOCComponent, 'BYOCComponent')
        .callsFake(() => <p className="byoc-component">Foo</p>);

      byocWrapperStub = sandbox.stub(BYOCWrapper, 'BYOCWrapper').callsFake(() => (
        <div className="byoc-wrapper">
          <BYOCComponent.BYOCComponent />
        </div>
      ));

      const errorBoundarySpy = sandbox.spy(ErrorBoundary, 'default');

      const renderedComponent = render(
        <ServerPlaceholder
          name={phKey}
          rendering={component}
          componentMap={componentMap}
          page={page}
        />
      );

      expect(errorBoundarySpy.calledWithMatch({ isDynamic: true })).to.be.true;
      expect(renderedComponent.container.innerHTML).to.not.contain('Loading component...');

      expect(renderedComponent.container.querySelectorAll('.byoc-wrapper').length).to.equal(1);

      const components = renderedComponent.container.querySelectorAll('.byoc-component');

      expect(components.length).to.equal(2);

      expect(components[0].textContent).to.equal('Foo');
      expect(components[1].textContent).to.equal('Foo');
    });
  });

  describe('ServerPlaceholder FEaaS fallback', () => {
    let feaasComponentStub;
    let feaasWrapperStub;

    const componentMap = new Map();

    xit('should render', () => {
      const page = getPage();
      page.layout = feaasWrapperData;
      const component = feaasWrapperData.sitecore.route as RouteData;
      const phKey = 'main';

      feaasComponentStub = sandbox
        .stub(FEAASComponent, 'FEaaSComponent')
        .callsFake(() => <p className="feaas-component">Foo</p>);

      feaasWrapperStub = sandbox.stub(FEAASWrapper, 'FEaaSWrapper').callsFake(() => (
        <div className="feaas-wrapper">
          <FEAASComponent.FEaaSComponent />
        </div>
      ));

      const renderedComponent = render(
        <ServerPlaceholder
          name={phKey}
          rendering={component}
          componentMap={componentMap}
          page={page}
        />
      );

      expect(renderedComponent.container.querySelectorAll('.feaas-component').length).to.equal(2);
      expect(renderedComponent.container.querySelectorAll('.feaas-wrapper').length).to.equal(1);
    });
  });

  xit('should render Suspense when disableSuspense is false', () => {
    const page = getPage();
    page.layout = normalModeDevData;
    const component = normalModeDevData.sitecore.route as RouteData;
    const phKey = 'main';

    const renderedComponent = render(
      <ServerPlaceholder
        name={phKey}
        disableSuspense={false}
        rendering={component}
        componentMap={componentMap}
        page={page}
      />
    );

    expect(renderedComponent.container.innerHTML).to.contain('Loading component...');

    expect(renderedComponent.container.querySelector('.dynamic-component')).to.not.be.null;
  });

  xit('should not render Suspense when disableSuspense is true', () => {
    const page = getPage();
    page.layout = normalModeDevData;
    const component = normalModeDevData.sitecore.route as RouteData;
    const phKey = 'main';

    const renderedComponent = render(
      <ServerPlaceholder
        name={phKey}
        disableSuspense={true}
        rendering={component}
        componentMap={componentMap}
        page={page}
      />
    );

    expect(renderedComponent.container.innerHTML).to.not.contain('Loading component...');

    expect(renderedComponent.container.querySelector('.dynamic-component')).to.not.be.null;
  });

  it('should render null for unknown placeholder', () => {
    const page = getPage();
    const route = {
      placeholders: {
        main: [
          {
            componentName: 'Home',
          },
        ],
      },
    } as unknown as RouteData;
    page.layout = {
      sitecore: {
        context: {},
        route,
      },
    };
    const phKey = 'unknown';

    const renderedComponent = render(
      <ServerPlaceholder name={phKey} rendering={route} componentMap={componentMap} page={page} />
    );
    expect(renderedComponent?.container.innerHTML).to.be.empty;
  });

  xit('should handle component errors through ErrorBoundary', () => {
    const components = new Map<string, React.FC>();

    const Home: React.FC<{ rendering?: RouteData }> = ({ rendering }) => (
      <div className="home-mock">
        <ServerPlaceholder
          name="main"
          rendering={rendering}
          componentMap={components}
          page={getPage()}
        />
      </div>
    );

    components.set('Home', Home);
    components.set('ThrowError', () => {
      throw Error('an error occured');
    });

    const route = {
      placeholders: {
        main: [
          {
            componentName: 'ThrowError',
          },
        ],
      },
    } as unknown as RouteData;
    const page = getPage();
    page.layout = {
      sitecore: {
        context: {},
        route,
      },
    };
    const phKey = 'main';

    const renderedComponent = render(
      <ServerPlaceholder name={phKey} rendering={route} componentMap={components} page={page} />
    );

    // ServerPlaceholder uses ErrorBoundary for error handling
    expect(
      renderedComponent.container.querySelectorAll('[data-testid="error-boundary"]').length
    ).to.be.greaterThan(0);
  });

  xit('should render error message on error, only for the errored component', () => {
    const components = new Map<string, React.FC>();

    const Home: React.FC<{ rendering?: RouteData }> = ({ rendering }) => (
      <div className="home-mock">
        <ServerPlaceholder
          name="main"
          rendering={rendering}
          componentMap={components}
          page={getPage()}
        />
      </div>
    );

    components.set('Home', Home);
    components.set('ThrowError', () => {
      throw Error('an error occured');
    });
    components.set('Foo', () => <div className="foo-class">foo</div>);

    const route = {
      placeholders: {
        main: [
          {
            componentName: 'ThrowError',
          },
          {
            componentName: 'Foo',
          },
        ],
      },
    } as unknown as RouteData;
    const page = getPage();
    page.layout = {
      sitecore: {
        context: {},
        route,
      },
    };
    const phKey = 'main';

    const renderedComponent = render(
      <ServerPlaceholder name={phKey} rendering={route} componentMap={components} page={page} />
    );

    // The Foo component should still render even if ThrowError fails
    expect(renderedComponent.container.querySelectorAll('div.foo-class').length).to.equal(1);
  });

  xit('should render custom errorComponent on error, if provided', () => {
    const page = getPage();
    const components = new Map<string, React.FC<{ [key: string]: unknown }>>();

    const Home: React.FC<{ rendering?: RouteData }> = ({ rendering }) => (
      <div className="home-mock">
        <ServerPlaceholder
          name="main"
          rendering={rendering}
          componentMap={componentMap}
          page={page}
        />
      </div>
    );

    components.set('Home', Home);
    components.set('ThrowError', () => {
      throw Error('an error occured');
    });

    const CustomError: React.FC = () => <div className="custom-error">Custom Error</div>;

    const route = {
      placeholders: {
        main: [
          {
            componentName: 'ThrowError',
          },
        ],
      },
    } as unknown as RouteData;
    page.layout = {
      sitecore: {
        context: {},
        route,
      },
    };
    const phKey = 'main';

    const renderedComponent = render(
      <ServerPlaceholder
        name={phKey}
        rendering={route}
        componentMap={components}
        page={page}
        errorComponent={CustomError}
      />
    );

    // ServerPlaceholder passes errorComponent to ErrorBoundary
    expect(
      renderedComponent.container.querySelectorAll('[data-testid="error-boundary"]').length
    ).to.be.greaterThan(0);
  });

  it('should render MissingComponent for unknown rendering', () => {
    const page = getPage();
    const route: any = {
      placeholders: {
        main: [
          {
            componentName: 'Unknown',
          },
        ],
      },
    };
    page.layout = {
      sitecore: {
        context: {},
        route,
      },
    };
    const phKey = 'main';

    const CustomMissingComponent: React.FC<MissingComponentProps> = (props) => (
      <div className="missing-component">
        <MissingComponent {...props} />
      </div>
    );

    const renderedComponent = render(
      <ServerPlaceholder
        name={phKey}
        rendering={route}
        componentMap={componentMap}
        page={page}
        missingComponentComponent={CustomMissingComponent}
      />
    );
    expect(renderedComponent.container.querySelectorAll('.missing-component').length).to.equal(1);
  });

  it('should render nothing for rendering without a name', () => {
    const page = getPage();
    const componentMap = new Map<string, React.FC<{ [key: string]: unknown }>>();

    const Home: React.FC<{ rendering?: RouteData }> = () => <div className="home-mock"></div>;

    componentMap.set('Home', Home);

    const route: any = {
      placeholders: {
        main: [
          {
            componentName: 'Home',
          },
          {
            componentName: null,
          },
        ],
      },
    };
    page.layout = {
      sitecore: {
        context: {},
        route,
      },
    };
    const phKey = 'main';

    const renderedComponent = render(
      <div className="empty-test">
        <ServerPlaceholder name={phKey} rendering={route} componentMap={componentMap} page={page} />
      </div>
    );
    expect(renderedComponent.container.children.length).to.equal(1);
  });

  it('should render HiddenRendering when rendering is hidden', () => {
    const page = getPage();
    const route: any = {
      placeholders: {
        main: [
          {
            componentName: 'Hidden Rendering',
          },
        ],
      },
    };
    page.layout = {
      sitecore: {
        context: {},
        route,
      },
    };
    const phKey = 'main';

    const renderedComponent = render(
      <ServerPlaceholder name={phKey} rendering={route} componentMap={componentMap} page={page} />
    );
    expect(renderedComponent.getAllByText('The component is hidden').length).to.equal(1);
  });

  it('should render custom HiddenRendering when rendering is hidden', () => {
    const page = getPage();
    sandbox.spy(HiddenRendering, 'HiddenRendering');

    const route: any = {
      placeholders: {
        main: [
          {
            componentName: 'Hidden Rendering',
          },
        ],
      },
    };
    page.layout = {
      sitecore: {
        context: {},
        route,
      },
    };
    const phKey = 'main';

    const CustomHiddenRendering: React.FC<any> = (props) => (
      <div className="hidden-rendering">
        <HiddenRendering.HiddenRendering />
        <p>{props.rendering.componentName}</p>
      </div>
    );

    const renderedComponent = render(
      <ServerPlaceholder
        name={phKey}
        rendering={route}
        componentMap={componentMap}
        page={page}
        hiddenRenderingComponent={CustomHiddenRendering}
      />
    );
    expect(renderedComponent.container.querySelectorAll('.hidden-rendering').length).to.equal(1);
    expect(
      expect(
        renderedComponent.container.querySelector('.hidden-rendering p')?.textContent
      ).to.equal('Hidden Rendering')
    );
  });

  it('should require componentMap prop', () => {
    const page = getPage();
    const route: any = {
      placeholders: {
        main: [
          {
            componentName: 'Home',
          },
        ],
      },
    };
    page.layout = {
      sitecore: {
        context: {},
        route,
      },
    };

    expect(() => {
      render(
        <ServerPlaceholder
          name="main"
          rendering={route}
          componentMap={undefined as any}
          page={page}
        />
      );
    }).to.throw('Component map is required for ServerPlaceholder');
  });

  // Additional test cases specific to ServerPlaceholder
  describe('ServerPlaceholder specific functionality', () => {
    it('should exclude non-serializable props when rendering client component', () => {
      const page = getPage();
      let receivedProps: any = null;

      const TestClientComponent: React.FC<any> = (props) => {
        receivedProps = props;
        return <div className="test-client-component">Test Client Component</div>;
      };

      // Mark as client component
      (TestClientComponent as any).componentType = 'client';

      const localComponentMap = new Map();
      localComponentMap.set('TestClientComponent', TestClientComponent);

      const route: any = {
        placeholders: {
          main: [
            {
              componentName: 'TestClientComponent',
            },
          ],
        },
      };

      page.layout = {
        sitecore: {
          context: {},
          route,
        },
      };

      const renderedComponent = render(
        <ServerPlaceholder
          name="main"
          rendering={route}
          componentMap={localComponentMap}
          page={page}
        />
      );

      // Check that the client component was called and received props
      expect(receivedProps).to.not.be.null;

      // Check that non-serializable props are excluded from client component
      expect(receivedProps.componentMap).to.be.undefined;

      // Note: Currently the rendering prop is still passed to client components.
      // This may be expected behavior or a separate issue.
      // For now, we're just verifying that we can check the props the component receives.
      expect(receivedProps.rendering).to.not.be.undefined;
    });

    it('should render react server component', () => {
      const page = getPage();

      const ServerComponent: React.FC<any> = (props) => {
        // Server components should receive all props including non-serializable ones
        expect(props.page).to.not.be.undefined;
        expect(props.componentMap).to.not.be.undefined;

        return <div className="server-component">Server Component</div>;
      };

      const localComponentMap = new Map();
      localComponentMap.set('ServerComponent', ServerComponent);

      const route: any = {
        placeholders: {
          main: [
            {
              componentName: 'ServerComponent',
            },
          ],
        },
      };

      page.layout = {
        sitecore: {
          context: {},
          route,
        },
      };

      const renderedComponent = render(
        <ServerPlaceholder
          name="main"
          rendering={route}
          componentMap={localComponentMap}
          page={page}
        />
      );

      expect(renderedComponent.container.querySelectorAll('.server-component').length).to.equal(1);
    });

    it('should render react client component', () => {
      const page = getPage();

      const ClientComponent: React.FC<any> = () => {
        return <div className="client-component">Client Component</div>;
      };

      // Mock this as a client component
      const localComponentMap = new Map();
      localComponentMap.set('ClientComponent', {
        default: ClientComponent,
        componentType: 'client',
      });

      const route: any = {
        placeholders: {
          main: [
            {
              componentName: 'ClientComponent',
            },
          ],
        },
      };

      page.layout = {
        sitecore: {
          context: {},
          route,
        },
      };

      const renderedComponent = render(
        <ServerPlaceholder
          name="main"
          rendering={route}
          componentMap={localComponentMap}
          page={page}
        />
      );

      expect(renderedComponent.container.querySelectorAll('.client-component').length).to.equal(1);
    });

    it('should pass props to child component', () => {
      const page = getPage();

      const TestComponent: React.FC<any> = (props) => {
        // Verify that props are passed correctly
        expect(props.customProp).to.equal('customValue');
        expect(props.fields).to.not.be.undefined;
        expect(props.params).to.not.be.undefined;
        expect(props.rendering).to.not.be.undefined;

        return <div className="test-component">Test Component</div>;
      };

      const localComponentMap = new Map();
      localComponentMap.set('TestComponent', TestComponent);

      const route: any = {
        placeholders: {
          main: [
            {
              componentName: 'TestComponent',
              fields: {
                testField: { value: 'testValue' },
              },
              params: {
                testParam: 'testParamValue',
              },
            },
          ],
        },
      };

      page.layout = {
        sitecore: {
          context: {},
          route,
        },
      };

      const renderedComponent = render(
        <ServerPlaceholder
          name="main"
          rendering={route}
          componentMap={localComponentMap}
          page={page}
          customProp="customValue"
        />
      );

      expect(renderedComponent.container.querySelectorAll('.test-component').length).to.equal(1);
    });
  });

  describe('ServerPlaceholder PlaceholderMetadata', () => {
    const {
      layoutData,
      layoutDataForNestedDynamicPlaceholder,
      layoutDataWithEmptyPlaceholder,
      layoutDataWithUnknownComponent,
    } = metadataData;

    const mode: PageMode = {
      name: LayoutServicePageState.Edit,
      isEditing: true,
      isNormal: false,
      isPreview: false,
      isDesignLibrary: false,
      designLibrary: {
        isVariantGeneration: false,
      },
    };

    let page: Page;

    beforeEach(() => {
      page = getPage();
      page.layout = layoutData;
      page.mode = mode;
    });

    const componentMap = new Map<string, React.FC>();

    componentMap.set('Header', () => (
      <div className="header-wrapper">
        <ServerPlaceholder
          name="logo"
          rendering={layoutData.sitecore.route.placeholders.main[0]}
          componentMap={componentMap}
          page={page}
        />
      </div>
    ));
    componentMap.set('Logo', () => <div className="Logo-mock" />);

    it('should render <PlaceholderMetadata> with nested placeholder components', () => {
      const wrapper = render(
        <ServerPlaceholder
          name="main"
          rendering={layoutData.sitecore.route}
          componentMap={componentMap}
          page={page}
        />,
        { container: document.body }
      );

      expect(wrapper?.baseElement.innerHTML).to.equal(
        [
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
        ].join('')
      );

      expect(wrapper?.container.querySelectorAll('.scpm').length).to.equal(8);
    });

    it('should render code blocks even if placeholder is empty', () => {
      page.layout = layoutDataWithEmptyPlaceholder;
      const wrapper = render(
        <ServerPlaceholder
          name="main"
          rendering={layoutDataWithEmptyPlaceholder.sitecore.route}
          componentMap={componentMap}
          page={page}
        />,
        { container: document.body }
      );

      expect(wrapper.baseElement?.innerHTML).to.equal(
        [
          '<div class="sc-jss-empty-placeholder">',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="main_00000000-0000-0000-0000-000000000000"></code>',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
          '</div>',
        ].join('')
      );
    });

    it('should render missing component with code blocks if component is not registered', () => {
      page.layout = layoutDataWithUnknownComponent;

      const wrapper = render(
        <ServerPlaceholder
          name="main"
          rendering={layoutDataWithUnknownComponent.sitecore.route}
          componentMap={componentMap}
          page={page}
        />
      );

      expect(wrapper?.container.innerHTML).to.equal(
        [
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="main_00000000-0000-0000-0000-000000000000"></code>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="123"></code>',
          '<div style="background: darkorange; outline: 5px solid orange; padding: 10px; color: white; max-width: 500px;"><h2>Unknown</h2><p>Content SDK component is missing React implementation. See the developer console for more information.</p></div>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
        ].join('')
      );
    });

    it('should render dynamic placeholder', () => {
      const phKey = 'container-1';
      const layoutData = layoutDataForNestedDynamicPlaceholder('container-{*}');
      page.layout = layoutData;

      const wrapper = render(
        <ServerPlaceholder
          name={phKey}
          rendering={layoutData.sitecore.route}
          componentMap={componentMap}
          page={page}
        />
      );

      expect(wrapper?.container.innerHTML).to.equal(
        [
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
        ].join('')
      );

      expect(wrapper?.container.querySelectorAll('.scpm')?.length).to.equal(8);
    });

    it('should render double digit dynamic placeholder', () => {
      const phKey = 'container-1-2';
      const layoutData = layoutDataForNestedDynamicPlaceholder('container-1-{*}');
      page.layout = layoutData;
      const wrapper = render(
        <ServerPlaceholder
          name={phKey}
          rendering={layoutData.sitecore.route}
          componentMap={componentMap}
          page={page}
        />
      );

      expect(wrapper?.container.innerHTML).to.equal(
        [
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
        ].join('')
      );

      // 4 placeholders in total, 8 code blocks
      expect(wrapper?.container.querySelectorAll('.scpm').length).to.equal(8);
    });
  });
});

after(() => {
  (global as any).window.close();
});
