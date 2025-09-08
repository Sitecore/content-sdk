import React, { Suspense } from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { spy } from 'sinon';
import ErrorBoundary from './ErrorBoundary';
import {
  SitecoreProvider,
  SitecoreProviderReactContext,
  SitecoreProviderState,
} from '../components/SitecoreProvider';
import { ComponentRendering, LayoutServicePageState } from '@sitecore-content-sdk/core/layout';
import { Page } from '@sitecore-content-sdk/core/client';

describe('ErrorBoundary', () => {
  const setPage = spy();
  const testComponentProps: SitecoreProviderState = {
    page: {
      locale: 'en',
      layout: {
        sitecore: {
          context: {},
          route: null,
        },
      },
      mode: {
        name: LayoutServicePageState.Normal,
        isPreview: false,
        isNormal: false,
        isEditing: false,
        isDesignLibrary: false,
        designLibrary: {
          isVariantGeneration: false,
        },
      },
    },
    setPage,
  };

  afterEach(() => {
    setPage.resetHistory();
  });

  describe('when in page editing or preview mode', () => {
    it('Should render custom error component when custom error component is provided and error is thrown', () => {
      const previewContext = { ...testComponentProps };

      previewContext.page.mode.isPreview = true;

      const testComponentName = 'Test component Name';
      const rendering: ComponentRendering = { componentName: testComponentName };

      const errorMessage = 'an error occured';
      const TestErrorComponent: React.FC = () => {
        throw Error(errorMessage);
      };

      const CustomErrorComponent: React.FC = () => {
        return <div>This is a custom error component!</div>;
      };

      const rendered = render(
        <SitecoreProviderReactContext.Provider value={previewContext}>
          <ErrorBoundary rendering={rendering} errorComponent={CustomErrorComponent}>
            <TestErrorComponent />
          </ErrorBoundary>
        </SitecoreProviderReactContext.Provider>
      );

      expect(rendered.container.querySelectorAll('div').length).to.equal(1);
      expect(rendered.container.querySelector('div')?.textContent).to.equal(
        'This is a custom error component!'
      );
    });

    it('Should render errors message and errored component name when error is thrown in edit mode', () => {
      const editingContext = {
        ...testComponentProps,
      };

      editingContext.page.mode.isEditing = true;

      const testComponentName = 'Test component Name';
      const rendering: ComponentRendering = { componentName: testComponentName };

      const errorMessage = 'an error occured';
      const TestErrorComponent: React.FC = () => {
        throw Error(errorMessage);
      };

      const rendered = render(
        <SitecoreProviderReactContext.Provider value={editingContext}>
          <ErrorBoundary rendering={rendering}>
            <TestErrorComponent />
          </ErrorBoundary>
        </SitecoreProviderReactContext.Provider>
      );
      const ems = rendered.container.querySelectorAll('em');
      expect(rendered.baseElement.innerHTML).to.contain('class="sc-content-sdk-placeholder-error"');
      expect(rendered.baseElement.innerHTML).to.contain('A rendering error occurred in component');
      expect(ems.length).to.equal(2);
      expect(ems[0].textContent).to.equal(testComponentName);
      expect(ems[1].textContent).to.equal(errorMessage);
    });

    it('Should render errors message and errored component name when error is thrown in preview mode', () => {
      const previewContext = { ...testComponentProps };

      previewContext.page.mode.isPreview = true;

      const testComponentName = 'Test component Name';
      const rendering: ComponentRendering = { componentName: testComponentName };

      const errorMessage = 'an error occured';
      const TestErrorComponent: React.FC = () => {
        throw Error(errorMessage);
      };

      const rendered = render(
        <SitecoreProviderReactContext.Provider value={testComponentProps}>
          <ErrorBoundary rendering={rendering}>
            <TestErrorComponent />
          </ErrorBoundary>
        </SitecoreProviderReactContext.Provider>
      );
      const ems = rendered.container.querySelectorAll('em');

      expect(rendered.baseElement.innerHTML).to.contain('class="sc-content-sdk-placeholder-error"');
      expect(rendered.baseElement.innerHTML).to.contain('A rendering error occurred in component');
      expect(ems.length).to.equal(2);
      expect(ems[0].textContent).to.equal(testComponentName);
      expect(ems[1].textContent).to.equal(errorMessage);
    });
  });
  describe('when in development mode', () => {
    before(() => {
      process.env.NODE_ENV = 'development';
    });

    after(() => {
      delete process.env.NODE_ENV;
    });

    it('Should render custom error component when custom error component is provided and error is thrown', () => {
      const errorMessage = 'an error occured';
      const TestErrorComponent: React.FC = () => {
        throw Error(errorMessage);
      };

      const CustomErrorComponent: React.FC = () => {
        return <div>This is a custom error component!</div>;
      };

      const rendered = render(
        <ErrorBoundary errorComponent={CustomErrorComponent}>
          <TestErrorComponent />
        </ErrorBoundary>
      );
      expect(rendered.container.querySelectorAll('div').length).to.equal(1);
      expect(rendered.container.querySelector('div')?.textContent).to.equal(
        'This is a custom error component!'
      );
    });

    it('Should render errors message and errored component name when error is thrown and is in page editing mode', () => {
      const editingContext = {
        ...testComponentProps,
      };
      editingContext.page.mode.isEditing = true;

      const testComponentName = 'Test component Name';
      const rendering: ComponentRendering = { componentName: testComponentName };

      const errorMessage = 'an error occured';
      const TestErrorComponent: React.FC = () => {
        throw Error(errorMessage);
      };

      const rendered = render(
        <SitecoreProviderReactContext.Provider value={editingContext}>
          <ErrorBoundary rendering={rendering}>
            <TestErrorComponent />
          </ErrorBoundary>
        </SitecoreProviderReactContext.Provider>
      );
      const ems = rendered.container.querySelectorAll('em');
      expect(rendered.baseElement.innerHTML).to.contain('class="sc-content-sdk-placeholder-error"');
      expect(rendered.baseElement.innerHTML).to.contain('A rendering error occurred in component');
      expect(ems.length).to.equal(2);
      expect(ems[0].textContent).to.equal(testComponentName);
      expect(ems[1].textContent).to.equal(errorMessage);
    });

    it('Should render errors message and errored component name when error is thrown and is not in page editing mode', () => {
      const normalContext = { ...testComponentProps };

      normalContext.page.mode.isNormal = true;

      const testComponentName = 'Test component Name';
      const rendering: ComponentRendering = { componentName: testComponentName };

      const errorMessage = 'an error occured';
      const TestErrorComponent: React.FC = () => {
        throw Error(errorMessage);
      };

      const rendered = render(
        <SitecoreProviderReactContext.Provider value={normalContext}>
          <ErrorBoundary rendering={rendering}>
            <TestErrorComponent />
          </ErrorBoundary>
        </SitecoreProviderReactContext.Provider>
      );
      const ems = rendered.container.querySelectorAll('em');

      expect(rendered.baseElement.innerHTML).to.contain('class="sc-content-sdk-placeholder-error"');
      expect(rendered.baseElement.innerHTML).to.contain('A rendering error occurred in component');
      expect(ems.length).to.equal(2);
      expect(ems[0].textContent).to.equal(testComponentName);
      expect(ems[1].textContent).to.equal(errorMessage);
    });
  });
  describe('when not in page editing and not in development mode', () => {
    const delay = (timeout, promise?) => {
      return new Promise((resolve) => {
        setTimeout(resolve, timeout);
      }).then(() => promise);
    };

    const ItsADynamicComponent = React.lazy(() =>
      delay(500, import('../test-data/test-dynamic-component'))
    );

    it('should render a loading message', async () => {
      const rendered = render(
        <ErrorBoundary>
          <ItsADynamicComponent />
        </ErrorBoundary>
      );
      expect(rendered.baseElement.textContent).to.equal('Loading component...');
    });

    it('should render custom loading message', async () => {
      const loading = 'I am customly loading...';
      const rendered = render(
        <ErrorBoundary componentLoadingMessage={loading}>
          <ItsADynamicComponent />
        </ErrorBoundary>
      );
      expect(rendered.baseElement.textContent).to.equal(loading);
    });

    it('should not render Suspense and default loading message when wrapping a dynamic component', async () => {
      // mount fails with lazy component and no suspense
      const rendered = render(
        <Suspense>
          <ErrorBoundary isDynamic={true}>
            <ItsADynamicComponent />
          </ErrorBoundary>
        </Suspense>
      );
      expect(rendered.baseElement.textContent).to.equal('');
      await waitFor(() => expect(rendered.getAllByText('No error').length).to.equal(1));
    });

    it('Should render custom error component when custom error component is provided and error is thrown', () => {
      const errorMessage = 'an error occured';
      const TestErrorComponent: React.FC = () => {
        throw Error(errorMessage);
      };

      const CustomErrorComponent: React.FC = () => {
        return <div>This is a custom error component!</div>;
      };

      const page: Page = {
        locale: 'en',
        layout: {
          sitecore: {
            context: {},
            route: null,
          },
        },
        mode: {
          name: LayoutServicePageState.Normal,
          isNormal: false,
          isPreview: false,
          isEditing: false,
          isDesignLibrary: false,
          designLibrary: {
            isVariantGeneration: false,
          },
        },
      };

      const rendered = render(
        <SitecoreProvider page={page}>
          <ErrorBoundary errorComponent={CustomErrorComponent}>
            <TestErrorComponent />
          </ErrorBoundary>
        </SitecoreProvider>
      );
      expect(rendered.container.querySelectorAll('div').length).to.equal(1);
      expect(rendered.container.querySelector('div')?.textContent).to.equal(
        'This is a custom error component!'
      );
    });

    it('Should render default errors message when error is thrown and custom error component is not provided', () => {
      const errorMessage = 'an error occured';
      const TestErrorComponent: React.FC = () => {
        throw Error(errorMessage);
      };

      const page: Page = {
        locale: 'en',
        layout: {
          sitecore: {
            context: {},
            route: null,
          },
        },
        mode: {
          name: LayoutServicePageState.Normal,
          isNormal: false,
          isPreview: false,
          isEditing: false,
          isDesignLibrary: false,
          designLibrary: {
            isVariantGeneration: false,
          },
        },
      };

      const rendered = render(
        <SitecoreProvider page={page}>
          <ErrorBoundary>
            <TestErrorComponent />
          </ErrorBoundary>
        </SitecoreProvider>
      );

      expect(rendered.baseElement.innerHTML).to.contain('class="sc-content-sdk-placeholder-error"');
      expect(rendered.baseElement.innerHTML).to.contain(
        'There was a problem loading this section.' // eslint-disable-line
      );
      expect(rendered.container.querySelectorAll('em').length).to.equal(0);
      expect(rendered.baseElement.innerHTML).to.not.contain(errorMessage);
    });
  });
});
