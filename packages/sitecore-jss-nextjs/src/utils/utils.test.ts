/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { getJssEditingSecret } from './utils';

describe('utils', () => {
  describe('getJssEditingSecret', () => {
    after(() => {
      delete process.env.JSS_EDITING_SECRET;
    });

    it('should throw if env variable missing', () => {
      expect(() => getJssEditingSecret()).to.throw();
    });

    it('should return env variable', () => {
      const secret = '1234abcd';
      process.env.JSS_EDITING_SECRET = secret;
      const result = getJssEditingSecret();
      expect(result).to.equal(secret);
    });
  });
});
