/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { Page } from '@sitecore-content-sdk/content/client';
import { LayoutServicePageState } from '@sitecore-content-sdk/content/layout';
import { JsonLdSchema } from './JsonLdSchema';

describe('<JsonLdSchema />', () => {
  afterEach(() => {
    cleanup();
  });

  const schemas = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: 'Page1-title' },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: 'RT DS - Text' },
  ];

  const buildPage = (isNormal: boolean, schemas?: Record<string, unknown>[]): Page =>
    ({
      locale: 'en',
      layout: {
        sitecore: {
          context: { schemas },
          route: null,
        },
      },
      mode: {
        name: isNormal ? LayoutServicePageState.Normal : LayoutServicePageState.Edit,
        isNormal,
        isEditing: !isNormal,
        isPreview: false,
        isDesignLibrary: false,
        designLibrary: { isVariantGeneration: false },
      },
    } as Page);

  it('renders nothing when there are no schemas', () => {
    const { container } = render(<JsonLdSchema page={buildPage(true)} />);
    expect(container.querySelector('script')).to.be.null;
  });

  it('renders nothing when page is undefined', () => {
    const { container } = render(<JsonLdSchema />);
    expect(container.querySelector('script')).to.be.null;
  });

  it('renders a single application/ld+json script with all schemas as a JSON array', () => {
    const { container } = render(<JsonLdSchema page={buildPage(true, schemas)} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script).to.not.be.null;
    expect(container.querySelectorAll('script')).to.have.lengthOf(1);
    expect(JSON.parse(script?.innerHTML ?? '')).to.deep.equal(schemas);
  });

  it('renders when page.mode.isNormal is true', () => {
    const { container } = render(<JsonLdSchema page={buildPage(true, schemas)} />);
    expect(container.querySelector('script')).to.not.be.null;
  });

  it('renders nothing when page.mode.isNormal is false (e.g. editing)', () => {
    const { container } = render(<JsonLdSchema page={buildPage(false, schemas)} />);
    expect(container.querySelector('script')).to.be.null;
  });
});

