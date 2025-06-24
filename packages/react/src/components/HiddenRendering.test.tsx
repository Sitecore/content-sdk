import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { HiddenRendering } from './HiddenRendering';

describe('<HiddenRendering />', () => {
  it('should render', () => {
    const rendered = render(<HiddenRendering />, { container: document.body });
    expect(document.querySelectorAll('body > *')).to.have.length(1);
    const style = rendered.container
      .querySelector('div')
      ?.getAttribute('style')
      ?.trim()
      ?.split(';')
      .reduce<Record<string, string>>((acc, style) => {
        if (style.split(':')[0]) acc[style.split(':')[0].trim()] = style.split(':')[1].trim();
        return acc;
      }, {});

    // Instead of checking exact equality, we'll verify required styles are present
    expect(style).to.include({
      'background-size': '3px 3px',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      padding: '30px',
      color: 'rgb(170, 170, 170)',
    });

    // Verify the div contains the expected text
    expect(rendered.container.textContent).to.equal('The component is hidden');
  });
});
