/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { secretsEqual } from './secure-compare';

describe('secretsEqual', () => {
  it('should return true for equal secrets', () => {
    expect(secretsEqual('my-secret', 'my-secret')).to.be.true;
  });

  it('should return false for different secrets of the same length', () => {
    expect(secretsEqual('my-secreT', 'my-secret')).to.be.false;
  });

  it('should return false (and not throw) for secrets of different length', () => {
    expect(secretsEqual('short', 'a-much-longer-secret')).to.be.false;
    expect(secretsEqual('a-much-longer-secret', 'short')).to.be.false;
  });

  it('should return false when the received secret is missing or empty', () => {
    expect(secretsEqual(undefined, 'my-secret')).to.be.false;
    expect(secretsEqual(null, 'my-secret')).to.be.false;
    expect(secretsEqual('', 'my-secret')).to.be.false;
  });

  it('should return false when the received secret is not a string', () => {
    expect(secretsEqual(['my-secret'], 'my-secret')).to.be.false;
    expect(secretsEqual(123, '123')).to.be.false;
  });

  it('should return false when the expected secret is missing or empty', () => {
    expect(secretsEqual('my-secret', undefined)).to.be.false;
    expect(secretsEqual('my-secret', null)).to.be.false;
    expect(secretsEqual('my-secret', '')).to.be.false;
    expect(secretsEqual(undefined, undefined)).to.be.false;
    expect(secretsEqual('', '')).to.be.false;
  });

  it('should handle multi-byte characters', () => {
    expect(secretsEqual('sécret-✓', 'sécret-✓')).to.be.true;
    expect(secretsEqual('sécret-✓', 'secret-✓')).to.be.false;
  });
});
