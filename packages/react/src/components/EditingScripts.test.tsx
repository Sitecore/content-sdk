/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  LayoutServiceData,
  LayoutServicePageState,
  RenderingType,
} from '@sitecore-content-sdk/core/layout';
import { EditingScripts } from './EditingScripts';
import { SitecoreProvider } from './SitecoreProvider';
import {
  getContentSdkPagesClientData,
  getDesignLibraryScriptLink,
  DesignLibraryMode,
} from '@sitecore-content-sdk/core/editing';
import { PageMode } from '@sitecore-content-sdk/core/client';

describe('<EditingScripts />', () => {
  const mockComponentMap = new Map();

  const mode: PageMode = {
    name: LayoutServicePageState.Edit,
    isEditing: true,
  };

  const getLayoutData = ({
    pageState,
    pageEditing,
    clientData,
    clientScripts,
    renderingType,
  }: {
    pageEditing: boolean;
    pageState?: LayoutServicePageState;
    clientData?: Record<string, Record<string, unknown>>;
    clientScripts?: string[];
    renderingType?: RenderingType;
  }): LayoutServiceData => ({
    sitecore: {
      context: {
        pageState,
        pageEditing,
        renderingType,
        site: {
          name: 'ContentSdkTestWeb',
        },
        language: 'en',
        clientData: clientData || {
          foo: {
            x: 1,
            y: '1',
            z: true,
          },
          bar: {
            a: 2,
            b: '2',
            c: false,
          },
        },
        clientScripts: clientScripts || [
          'http://test.foo/script1.js',
          'http://test.foo/script2.js',
        ],
      },
      route: null,
    },
  });

  it('should render nothing when not in editing', () => {
    const mode: PageMode = {
      name: LayoutServicePageState.Normal,
      isNormal: true,
      isPreview: false,
      isEditing: false,
      isDesignLibrary: false,
      designLibrary: {
        isVariantGeneration: false,
      },
    };

    const page = {
      locale: 'en',
      layout: {
        sitecore: {
          context: {},
          route: null,
        },
      },
      mode,
    };

    const component = render(
      <SitecoreProvider componentMap={mockComponentMap} page={page}>
        <EditingScripts />
      </SitecoreProvider>,
      { container: document.body }
    );

    expect(component.baseElement.innerHTML).to.be.empty;
    expect(component.container.querySelectorAll('script')).to.have.length(0);
  });

  describe('should render Pages scripts when in Edit mode', () => {
    it('should render scripts', () => {
      const layoutData = getLayoutData({
        pageState: LayoutServicePageState.Edit,
        pageEditing: true,
      });

      const page = {
        locale: 'en',
        layout: layoutData,
        mode,
      };

      const component = render(
        <SitecoreProvider componentMap={mockComponentMap} page={page}>
          <EditingScripts />
        </SitecoreProvider>
      );

      const scripts = component.baseElement;
      const contentSdkScriptsLength = Object.keys(getContentSdkPagesClientData()).length;

      expect(scripts?.querySelectorAll('script')).to.have.length(4 + contentSdkScriptsLength);

      const script1 = scripts?.querySelectorAll('script')[0];
      expect(script1?.getAttribute('src')).to.equal('http://test.foo/script1.js');

      const script2 = scripts?.querySelectorAll('script')[1];
      expect(script2?.getAttribute('src')).to.equal('http://test.foo/script2.js');

      const script3 = scripts?.querySelectorAll('script')[2];
      expect(script3?.getAttribute('id')).to.equal('foo');
      expect(script3?.getAttribute('type')).to.equal('application/json');
      expect(script3?.outerHTML).to.equal(
        '<script id="foo" type="application/json">{"x":1,"y":"1","z":true}</script>'
      );

      const script4 = scripts?.querySelectorAll('script')[3];
      expect(script4?.getAttribute('id')).to.equal('bar');
      expect(script4?.getAttribute('type')).to.equal('application/json');
      expect(script4?.outerHTML).to.equal(
        '<script id="bar" type="application/json">{"a":2,"b":"2","c":false}</script>'
      );
    });

    it('should render content sdk pages script elements when data is not provided', () => {
      const layoutData = getLayoutData({
        pageState: LayoutServicePageState.Edit,
        pageEditing: true,
        clientData: {},
        clientScripts: [],
      });

      const page = {
        locale: 'en',
        layout: layoutData,
        mode,
      };

      const component = render(
        <SitecoreProvider componentMap={mockComponentMap} page={page}>
          <EditingScripts />
        </SitecoreProvider>
      );

      const scripts = component.baseElement;
      const ids = Object.keys(getContentSdkPagesClientData());
      ids.forEach((id) => {
        expect(component.container.querySelector(`#${id}`)).to.not.be.null;
      });
      expect(scripts.querySelectorAll('script')).to.have.length(ids.length);
    });
  });

  describe('Design Library scripts', () => {
    const mode: PageMode = {
      name: DesignLibraryMode.Normal,
      isDesignLibrary: true,
    };

    it('should render Design Library script when rendering type is component', () => {
      const layoutData = getLayoutData({
        pageEditing: false,
        pageState: LayoutServicePageState.Normal,
        renderingType: RenderingType.Component,
        clientData: {},
        clientScripts: [],
      });

      const page = {
        locale: 'en',
        layout: layoutData,
        mode,
      };

      const component = render(
        <SitecoreProvider componentMap={mockComponentMap} page={page}>
          <EditingScripts />
        </SitecoreProvider>
      );

      const scripts = component.baseElement;
      expect(scripts.querySelectorAll('script')).to.have.length(1);
      const script1 = scripts?.querySelectorAll('script')[0];
      expect(script1.getAttribute('src')).to.contain(`${getDesignLibraryScriptLink()}?cb=`);
    });

    it('should render Design Library script with custom design library url when rendering type is component', () => {
      const layoutData = getLayoutData({
        pageEditing: false,
        pageState: LayoutServicePageState.Normal,
        renderingType: RenderingType.Component,
        clientData: {},
        clientScripts: [],
      });

      const page = {
        locale: 'en',
        layout: layoutData,
        mode,
      };

      const stagingEdgeUrl = 'http://edge-staging';

      const component = render(
        <SitecoreProvider
          componentMap={mockComponentMap}
          page={page}
          api={{ edge: { edgeUrl: stagingEdgeUrl, contextId: 'id' } }}
        >
          <EditingScripts />
        </SitecoreProvider>
      );

      const scripts = component.baseElement;
      expect(scripts.querySelectorAll('script')).to.have.length(1);
      const script1 = scripts?.querySelectorAll('script')[0];
      expect(script1.getAttribute('src')).to.contain(
        `${getDesignLibraryScriptLink(stagingEdgeUrl)}?cb=`
      );
    });
  });
});
