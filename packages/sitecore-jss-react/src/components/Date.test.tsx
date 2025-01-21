/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { render } from '@testing-library/react';
import React from 'react';
import { DateField } from './Date';
import { EMPTY_DATE_FIELD_VALUE } from '@sitecore-jss/sitecore-jss/layout';

describe('<DateField />', () => {
  it('should return null if no value', () => {
    const p = {
      field: {},
    };

    const c = render(<DateField {...p} />);
    expect(c.baseElement.innerHTML).to.equal('');
  });

  it('should render value', () => {
    const p = {
      field: {
        value: '23-11-2001',
      },
    };

    const c = render(<DateField {...p} />, { container: document.body });

    expect(c.baseElement.innerHTML).equal('23-11-2001');
  });

  it('should render value using render prop function', () => {
    const renderDate = (date: Date | null) => <p>{date ? date.toDateString() : ''}</p>;
    const p = {
      field: {
        value: '11-23-2001',
      },
      renderDate,
    };

    const c = render(<DateField {...p} />, { container: document.body });

    expect(c.baseElement.innerHTML).equal('<p>Fri Nov 23 2001</p>');
  });

  it('should render value with provided tag', () => {
    const p = {
      field: {
        value: '11-23-2001',
      },
      tag: 'h3',
    };

    const c = render(<DateField {...p} />, { container: document.body });

    expect(c.baseElement.innerHTML).equal('<h3>11-23-2001</h3>');
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
      rawValue: 'Test1',
    };

    it('should render field metadata component when metadata property is present', () => {
      const props = {
        field: {
          value: '23-11-2001',
          metadata: testMetadata,
        },
      };

      const rendered = render(<DateField {...props} />, { container: document.body });

      expect(rendered.baseElement.innerHTML).to.equal(
        [
          `<code type="text/sitecore" chrometype="field" class="scpm" kind="open">${JSON.stringify(
            testMetadata
          )}</code>`,
          '23-11-2001',
          '<code type="text/sitecore" chrometype="field" class="scpm" kind="close"></code>',
        ].join('')
      );
    });

    describe('empty value', () => {
      describe('Should render default component', () => {
        it('field value is empty string', () => {
          const field = {
            value: '',
            metadata: testMetadata,
          };

          const rendered = render(<DateField field={field} />, { container: document.body });

          expect(rendered.baseElement.innerHTML).to.equal(
            [
              `<code type="text/sitecore" chrometype="field" class="scpm" kind="open">${JSON.stringify(
                testMetadata
              )}</code>`,
              '<span>[No text in field]</span>',
              '<code type="text/sitecore" chrometype="field" class="scpm" kind="close"></code>',
            ].join('')
          );
        });

        it('field value is default empty date value', () => {
          const field = {
            value: EMPTY_DATE_FIELD_VALUE,
            metadata: testMetadata,
          };

          const rendered = render(<DateField field={field} />, { container: document.body });

          expect(rendered.baseElement.innerHTML).to.equal(
            [
              `<code type="text/sitecore" chrometype="field" class="scpm" kind="open">${JSON.stringify(
                testMetadata
              )}</code>`,
              '<span>[No text in field]</span>',
              '<code type="text/sitecore" chrometype="field" class="scpm" kind="close"></code>',
            ].join('')
          );
        });
      });

      describe('Should render custom component', () => {
        it('field value is empty string', () => {
          const field = {
            value: '',
            metadata: testMetadata,
          };

          const EmptyFieldEditingComponent = () => (
            <span className="empty-field-value-placeholder">Custom Empty field value</span>
          );

          const rendered = render(
            <DateField field={field} emptyFieldEditingComponent={EmptyFieldEditingComponent} />,
            { container: document.body }
          );

          expect(rendered.baseElement.innerHTML).to.equal(
            [
              `<code type="text/sitecore" chrometype="field" class="scpm" kind="open">${JSON.stringify(
                testMetadata
              )}</code>`,
              '<span class="empty-field-value-placeholder">Custom Empty field value</span>',
              '<code type="text/sitecore" chrometype="field" class="scpm" kind="close"></code>',
            ].join('')
          );
        });

        it('field value is defaule empty date value', () => {
          const field = {
            value: EMPTY_DATE_FIELD_VALUE,
            metadata: testMetadata,
          };

          const EmptyFieldEditingComponent = () => (
            <span className="empty-field-value-placeholder">Custom Empty field value</span>
          );

          const rendered = render(
            <DateField field={field} emptyFieldEditingComponent={EmptyFieldEditingComponent} />,
            { container: document.body }
          );

          expect(rendered.baseElement.innerHTML).to.equal(
            [
              `<code type="text/sitecore" chrometype="field" class="scpm" kind="open">${JSON.stringify(
                testMetadata
              )}</code>`,
              '<span class="empty-field-value-placeholder">Custom Empty field value</span>',
              '<code type="text/sitecore" chrometype="field" class="scpm" kind="close"></code>',
            ].join('')
          );
        });
      });
    });

    it('should render nothing when field value is empty, when editing is explicitly disabled ', () => {
      const field = {
        value: '',
        metadata: testMetadata,
      };

      const rendered = render(<DateField field={field} editable={false} />, {
        container: document.body,
      });

      expect(rendered.baseElement.innerHTML).to.equal('');
    });
  });
});
