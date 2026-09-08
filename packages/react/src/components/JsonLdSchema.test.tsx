/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { JsonLdSchema } from './JsonLdSchema';

describe('<JsonLdSchema />', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders nothing when there are no schemas', () => {
    const { container } = render(<JsonLdSchema context={{}} />);
    expect(container.querySelector('script')).to.be.null;
  });

  it('renders nothing when context is undefined', () => {
    const { container } = render(<JsonLdSchema />);
    expect(container.querySelector('script')).to.be.null;
  });

  it('renders a single application/ld+json script with all schemas as a JSON array', () => {
    const schemas = [
      { '@context': 'https://schema.org', '@type': 'Article', headline: 'Page1-title' },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: 'RT DS - Text' },
    ];

    const { container } = render(<JsonLdSchema context={{ schemas }} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script).to.not.be.null;
    expect(container.querySelectorAll('script')).to.have.lengthOf(1);
    expect(JSON.parse(script?.innerHTML ?? '')).to.deep.equal(schemas);
  });
});
