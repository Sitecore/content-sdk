/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { handler } from './generate-sdk';

describe('generate-sdk command', () => {
  let consoleLogStub: sinon.SinonStub;

  beforeEach(() => {
    consoleLogStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should log a placeholder message', () => {
    handler();
    expect(consoleLogStub.calledOnceWith('SDK is generating')).to.be.true;
  });
});
