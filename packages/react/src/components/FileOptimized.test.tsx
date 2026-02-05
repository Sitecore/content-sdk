/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { FileOptimized } from './FileOptimized';
import { FileField, FileFieldValue } from './File';

describe('<FileOptimized />', () => {
  it('should render nothing with missing field', () => {
    const field = (null as unknown) as FileField;
    const rendered = render(<FileOptimized field={field} />);
    expect(rendered.container.innerHTML).to.equal('');
  });

  it('should render nothing with missing value', () => {
    const field = ({} as unknown) as FileField;
    const rendered = render(<FileOptimized field={field} />);
    expect(rendered.container.innerHTML).to.equal('');
  });

  it('should render nothing with empty value', () => {
    const field = { value: {} } as FileField;
    const rendered = render(<FileOptimized field={field} />);
    expect(rendered.container.innerHTML).to.equal('');
  });

  it('should render with href and title', () => {
    const field: FileField = {
      value: {
        src: '/lorem.pdf',
        title: 'ipsum',
      },
    };
    const rendered = render(<FileOptimized field={field} />).container.querySelector('a');
    expect(rendered?.outerHTML).to.contain('<a href="/lorem.pdf">ipsum</a>');
  });

  it('should render with href and displayName', () => {
    const field: FileField = {
      value: {
        src: '/lorem.pdf',
        displayName: 'ipsum',
      },
    };
    const rendered = render(<FileOptimized field={field} />).container.querySelector('a');
    expect(rendered?.outerHTML).to.contain('<a href="/lorem.pdf">ipsum</a>');
  });

  it('should prefer title over displayName', () => {
    const field: FileField = {
      value: {
        src: '/lorem.pdf',
        title: 'title-value',
        displayName: 'displayName-value',
      },
    };
    const rendered = render(<FileOptimized field={field} />).container.querySelector('a');
    expect(rendered?.outerHTML).to.contain('<a href="/lorem.pdf">title-value</a>');
  });

  it('should render with children', () => {
    const field: FileField = {
      value: {
        src: '/lorem.pdf',
        title: 'ipsum',
      },
    };
    const rendered = render(
      <FileOptimized field={field}>
        <span>dolor</span>
      </FileOptimized>
    ).container.querySelector('a');

    expect(rendered?.innerHTML).to.contain('<span>dolor</span>');
    expect(rendered?.innerHTML).to.not.contain('ipsum');
  });

  it('should render other attributes', () => {
    const field: FileField = {
      value: {
        src: '/lorem.pdf',
        title: 'ipsum',
      },
    };
    const rendered = render(
      <FileOptimized field={field} id="my-file" className="file-link" />
    ).container.querySelector('a');
    expect(rendered?.outerHTML).to.contain(
      '<a href="/lorem.pdf" id="my-file" class="file-link">ipsum</a>'
    );
  });

  it('should render when file data provided directly', () => {
    const field: FileFieldValue = {
      src: '/lorem.pdf',
      title: 'ipsum',
    };
    const rendered = render(<FileOptimized field={field} />).container.querySelector('a');
    expect(rendered?.outerHTML).to.contain('<a href="/lorem.pdf">ipsum</a>');
  });
});
