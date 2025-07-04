import { expect } from 'chai';
import sinon from 'sinon';
import { tryParseEnvValue } from './env.js';

describe('env', () => {
  describe('tryParseEnvValue', () => {
    it('should return default value when value is not provided', () => {
      expect(tryParseEnvValue(undefined, {})).to.deep.equal({});
    });

    it('should parse value', () => {
      expect(tryParseEnvValue('{ "TEST": true }', {})).to.deep.equal({ TEST: true });
    });

    it('should return default value when value is not a JSON', () => {
      expect(tryParseEnvValue('test', { env: 'test' })).to.deep.equal({ env: 'test' });
    });

    it('should throw error when cant parse provided value', () => {
      const logSpy = sinon.spy(console, 'log');

      try {
        tryParseEnvValue('{ TEST: true }', {});
      } catch (err) {
        expect(err.message).to.equal('Unexpected token T in JSON at position 2');
        expect(logSpy).to.have.been.calledWith('Parsing of multivalue env variable failed');
        expect(logSpy).to.have.been.calledWith('Attempted to parse { TEST: true }');

        logSpy.restore();
      }
    });
  });
});
