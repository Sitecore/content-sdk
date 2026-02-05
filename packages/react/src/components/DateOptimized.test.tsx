/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DateFieldOptimized } from './DateOptimized';
import { DateFieldProps } from './Date';

describe('<DateFieldOptimized />', () => {
  it('should render nothing with missing field', () => {
    const field = (null as unknown) as DateFieldProps['field'];
    const rendered = render(<DateFieldOptimized field={field} />);
    expect(rendered.container.innerHTML).to.equal('');
  });

  it('should render nothing with empty value', () => {
    const field = {
      value: '',
    };
    const rendered = render(<DateFieldOptimized field={field} />);
    expect(rendered.container.innerHTML).to.equal('');
  });

  it('should render nothing with missing value', () => {
    const field = {};
    const rendered = render(<DateFieldOptimized field={field} />);
    expect(rendered.container.innerHTML).to.equal('');
  });

  it('should render date value', () => {
    const field = {
      value: '2023-01-15T10:30:00Z',
    };
    const rendered = render(<DateFieldOptimized field={field} />);
    expect(rendered.container.innerHTML).to.contain('2023-01-15T10:30:00Z');
  });

  it('should render with tag provided', () => {
    const field = {
      value: '2023-01-15T10:30:00Z',
    };
    const rendered = render(<DateFieldOptimized field={field} tag="div" />).container.querySelector(
      'div'
    );
    expect(rendered?.innerHTML).to.contain('2023-01-15T10:30:00Z');
  });

  it('should render without tag', () => {
    const field = {
      value: '2023-01-15T10:30:00Z',
    };
    const rendered = render(<DateFieldOptimized field={field} />);
    expect(rendered.container.innerHTML).to.contain('2023-01-15T10:30:00Z');
  });

  it('should render with custom render function', () => {
    const field = {
      value: '2023-01-15T10:30:00Z',
    };
    const customRender = (date: Date | null) => {
      if (!date) return null;
      return <span>Custom: {date.toISOString()}</span>;
    };
    const rendered = render(<DateFieldOptimized field={field} render={customRender} />);
    expect(rendered.container.innerHTML).to.contain('Custom: 2023-01-15T10:30:00.000Z');
  });

  it('should render with custom render function and tag', () => {
    const field = {
      value: '2023-01-15T10:30:00Z',
    };
    const customRender = (date: Date | null) => {
      if (!date) return null;
      return date.toLocaleDateString();
    };
    const rendered = render(
      <DateFieldOptimized field={field} tag="div" render={customRender} />
    ).container.querySelector('div');
    expect(rendered).to.not.be.null;
  });

  it('should render other attributes', () => {
    const field = {
      value: '2023-01-15T10:30:00Z',
    };
    const rendered = render(
      <DateFieldOptimized field={field} tag="span" className="date-field" id="test-date" />
    ).container.querySelector('span');
    expect(rendered?.outerHTML).to.contain('class="date-field"');
    expect(rendered?.outerHTML).to.contain('id="test-date"');
  });

  describe('edit mode', () => {
    const testMetadata = {
      contextItem: {
        id: '{09A07660-6834-476C-B93B-584248D3003B}',
        language: 'en',
        revision: 'a0b36ce0a7db49418edf90eb9621e145',
        version: 1,
      },
      fieldId: '{414061F4-FBB1-4591-BC37-BFFA67F745EB}',
      fieldType: 'date',
      rawValue: '2023-01-15T10:30:00Z',
    };

    it('should render field metadata component when metadata property is present', () => {
      const field = {
        value: '2023-01-15T10:30:00Z',
        metadata: testMetadata,
      };

      const rendered = render(<DateFieldOptimized field={field} tag="span" />);

      expect(rendered.container.innerHTML).to.contain(
        `<code type="text/sitecore" chrometype="field" class="scpm" kind="open">${JSON.stringify(
          testMetadata
        )}</code>`
      );
      expect(rendered.container.innerHTML).to.contain('2023-01-15T10:30:00Z');
      expect(rendered.container.innerHTML).to.contain(
        '<code type="text/sitecore" chrometype="field" class="scpm" kind="close"></code>'
      );
    });

    it('should render default empty field component when field value is empty in edit mode metadata', () => {
      const field = {
        value: '',
        metadata: testMetadata,
      };

      const rendered = render(<DateFieldOptimized field={field} />);

      expect(rendered.container.innerHTML).to.equal(
        [
          `<code type="text/sitecore" chrometype="field" class="scpm" kind="open">${JSON.stringify(
            testMetadata
          )}</code>`,
          '<span>[No text in field]</span>',
          '<code type="text/sitecore" chrometype="field" class="scpm" kind="close"></code>',
        ].join('')
      );
    });

    it('should render nothing when field value is empty, when editing is explicitly disabled in edit mode metadata', () => {
      const field = {
        value: '',
        metadata: testMetadata,
      };

      const rendered = render(<DateFieldOptimized field={field} editable={false} />);

      expect(rendered.container.innerHTML).to.equal('');
    });
  });
});
