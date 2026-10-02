/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { LayoutServicePageState } from '@sitecore-content-sdk/content/layout';
import { PageMode } from '@sitecore-content-sdk/content/client';
import { THEME_PREVIEW_STYLE_ID } from '@sitecore-content-sdk/content/editing';
import { ThemePreviewEvents } from './ThemePreviewEvents';
import { SitecoreProvider } from './SitecoreProvider';

describe('<ThemePreviewEvents />', () => {
  const mockComponentMap = new Map();

  const getPage = (mode: PageMode) => ({
    locale: 'en',
    layout: {
      sitecore: {
        context: {},
        route: null,
      },
    },
    mode,
  });

  const dispatchThemeUpdate = (css: string) => {
    window.dispatchEvent(
      new window.MessageEvent('message', {
        origin: window.location.origin,
        data: { name: 'theme-update', message: { css } },
      })
    );
  };

  afterEach(() => {
    cleanup();
    document.getElementById(THEME_PREVIEW_STYLE_ID)?.remove();
  });

  it('should not attach a listener when not in editing mode', () => {
    const mode: PageMode = {
      name: LayoutServicePageState.Normal,
      isNormal: true,
      isPreview: false,
      isEditing: false,
      isDesignLibrary: false,
      designLibrary: { isVariantGeneration: false, isLowCode: false },
    };

    render(
      <SitecoreProvider componentMap={mockComponentMap} page={getPage(mode)}>
        <ThemePreviewEvents />
      </SitecoreProvider>
    );

    dispatchThemeUpdate('body { color: red; }');

    expect(document.getElementById(THEME_PREVIEW_STYLE_ID)).to.be.null;
  });

  it('should not attach a listener when theming.mode is none', () => {
    const mode: PageMode = {
      name: LayoutServicePageState.Edit,
      isNormal: false,
      isPreview: false,
      isEditing: true,
      isDesignLibrary: false,
      designLibrary: { isVariantGeneration: false, isLowCode: false },
    };

    render(
      <SitecoreProvider
        componentMap={mockComponentMap}
        page={getPage(mode)}
        theming={{ mode: 'none' }}
      >
        <ThemePreviewEvents />
      </SitecoreProvider>
    );

    dispatchThemeUpdate('body { color: red; }');

    expect(document.getElementById(THEME_PREVIEW_STYLE_ID)).to.be.null;
  });

  it('should inject the css from a theme-update message while in editing mode', () => {
    const mode: PageMode = {
      name: LayoutServicePageState.Edit,
      isNormal: false,
      isPreview: false,
      isEditing: true,
      isDesignLibrary: false,
      designLibrary: { isVariantGeneration: false, isLowCode: false },
    };

    render(
      <SitecoreProvider componentMap={mockComponentMap} page={getPage(mode)}>
        <ThemePreviewEvents />
      </SitecoreProvider>
    );

    dispatchThemeUpdate('body { color: blue; }');

    expect(document.getElementById(THEME_PREVIEW_STYLE_ID)?.textContent).to.equal(
      'body { color: blue; }'
    );
  });

  it('should clear the previewed theme when message css is an empty string', () => {
    const mode: PageMode = {
      name: LayoutServicePageState.Edit,
      isNormal: false,
      isPreview: false,
      isEditing: true,
      isDesignLibrary: false,
      designLibrary: { isVariantGeneration: false, isLowCode: false },
    };

    render(
      <SitecoreProvider componentMap={mockComponentMap} page={getPage(mode)}>
        <ThemePreviewEvents />
      </SitecoreProvider>
    );

    dispatchThemeUpdate('body { color: blue; }');
    dispatchThemeUpdate('');

    expect(document.getElementById(THEME_PREVIEW_STYLE_ID)?.textContent).to.equal('');
  });

  it('should stop listening after unmount', () => {
    const mode: PageMode = {
      name: LayoutServicePageState.Edit,
      isNormal: false,
      isPreview: false,
      isEditing: true,
      isDesignLibrary: false,
      designLibrary: { isVariantGeneration: false, isLowCode: false },
    };

    const component = render(
      <SitecoreProvider componentMap={mockComponentMap} page={getPage(mode)}>
        <ThemePreviewEvents />
      </SitecoreProvider>
    );

    component.unmount();
    dispatchThemeUpdate('body { color: purple; }');

    expect(document.getElementById(THEME_PREVIEW_STYLE_ID)).to.be.null;
  });
});

