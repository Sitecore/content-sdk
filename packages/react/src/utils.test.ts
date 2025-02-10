import { expect } from 'chai';
import { addClassName, getDataFromFields } from './utils';
import { ComponentFields } from '@sitecore-content-sdk/core/layout';

describe('jss-react utils', () => {
  describe('addClassName', () => {
    it('should add class attribute value to className', () => {
      const modifiableAttrs = {
        className: 'first-class',
        class: 'second-class',
      };
      addClassName(modifiableAttrs);
      expect(modifiableAttrs).to.deep.equal({
        className: 'first-class second-class',
      });

      it('should convert class attribute value to className when className is absent', () => {
        const modifiableAttrs = {
          class: 'second-class',
        };
        addClassName(modifiableAttrs);
        expect(modifiableAttrs).to.deep.equal({
          className: 'second-class',
        });
      });
    });
  });

  describe('getDataFromFields', () => {
    it('should parse fields into JSON', () => {
      const fields: ComponentFields = {
        text: {
          value: 'we count to',
        },
        number: {
          value: 10,
        },
        message: {
          value: 'well done counting',
        },
      };
      const expectedResult = {
        text: 'we count to',
        number: 10,
        message: 'well done counting',
      };

      expect(getDataFromFields(fields)).to.deep.equal(expectedResult);
    });
  });
});
