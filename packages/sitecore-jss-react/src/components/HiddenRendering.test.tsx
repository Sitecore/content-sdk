import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { HiddenRendering } from './HiddenRendering';

describe('<HiddenRendering />', () => {
  // TODO: figure out why background-image is not present
  xit('should render', () => {
    const rendered = render(<HiddenRendering />, { container: document.body });
    expect(document.querySelectorAll('body > *')).to.have.length(1);
    expect(rendered.baseElement.innerHTML).to.equal('123');
    const style = rendered.container
      .querySelector('div')
      ?.getAttribute('style')
      ?.trim()
      ?.split(';')
      .reduce<Record<string, string>>((acc, style) => {
        if (style.split(':')[0]) acc[style.split(':')[0].trim()] = style.split(':')[1].trim();
        return acc;
      }, {});
    expect(style).to.deep.equal({
      'background-image':
        'linear-gradient(45deg, #ffffff 25%, #dcdcdc 25%, #dcdcdc 50%, #ffffff 50%, #ffffff 75%, #dcdcdc 75%, #dcdcdc 100%)',
      'background-size': '3px 3px',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      padding: '30px',
      color: 'rgb(170, 170, 170)',
    });
    expect(rendered.container.outerHTML).to.equal(
      '<div style="background-size: 3px 3px; display: flex; justify-content: center; align-items: center; padding: 30px; color: rgb(170, 170, 170);">The component is hidden</div>'
    );
  });
});
