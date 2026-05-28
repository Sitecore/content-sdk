import { use } from 'chai';
import chaiString from 'chai-string';
import { SuccessfulProxyExecution, FailedProxyExecution } from './types';
import { isSuccessfulProxyExecution } from './utils';

describe('isSuccessfulProxyExecution', () => {
  const expect = use(chaiString).expect;

  it('should return true for successful execution info', () => {
    const info: SuccessfulProxyExecution & { foo: string } = {
      executedSuccessfully: true,
      error: null,
      foo: 'bar',
    };

    expect(isSuccessfulProxyExecution(info)).to.equal(true);
    if (isSuccessfulProxyExecution<{ foo: string }>(info)) {
      expect(info.foo).to.equal('bar');
    }
  });

  it('should return false for failed execution info', () => {
    const info: FailedProxyExecution = {
      executedSuccessfully: false,
      error: new Error('failed'),
    };

    expect(isSuccessfulProxyExecution(info)).to.equal(false);
  });

  it('should return false when info is undefined', () => {
    expect(isSuccessfulProxyExecution(undefined)).to.equal(false);
  });
});

