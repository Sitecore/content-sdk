/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import debug from '../debug';
import { authorizeEditingEndpointRequest } from './editing-endpoint-auth';

describe('authorizeEditingEndpointRequest', () => {
  const secret = 'jss-editing-secret-mock';
  const allowedOrigin = 'https://allowed.com';
  const headers = { origin: allowedOrigin };
  const sandbox = sinon.createSandbox();
  let debugEditingStub: sinon.SinonStub;

  beforeEach(() => {
    process.env.SITECORE_EDITING_SECRET = secret;
    process.env.JSS_ALLOWED_ORIGINS = allowedOrigin;
    debugEditingStub = sandbox.stub(debug, 'editing');
  });

  afterEach(() => {
    sandbox.restore();
    delete process.env.SITECORE_EDITING_SECRET;
    delete process.env.JSS_ALLOWED_ORIGINS;
  });

  it('should authorize a request with a valid secret', () => {
    const result = authorizeEditingEndpointRequest({ method: 'GET', headers, secret });

    expect(result.ok).to.be.true;
  });

  it('should use the first value when the secret is passed multiple times', () => {
    const result = authorizeEditingEndpointRequest({
      method: 'GET',
      headers,
      secret: [secret, 'other'],
    });

    expect(result.ok).to.be.true;
  });

  it('should reject a missing secret', () => {
    const result = authorizeEditingEndpointRequest({ method: 'GET', headers, secret: undefined });

    expect(result).to.deep.include({
      ok: false,
      status: 401,
      body: { message: 'Missing or invalid editing secret' },
    });
  });

  it('should reject an invalid secret without logging the sent or expected secret', () => {
    const sentSecret = 'wrong-secret';
    const result = authorizeEditingEndpointRequest({
      method: 'GET',
      headers,
      secret: sentSecret,
    });

    expect(result.ok).to.be.false;
    expect(debugEditingStub.calledOnce).to.be.true;
    const loggedArgs = debugEditingStub.firstCall.args.map(String);
    expect(loggedArgs.some((arg) => arg.includes(secret))).to.be.false;
    expect(loggedArgs.some((arg) => arg.includes(sentSecret))).to.be.false;
    expect(loggedArgs[0]).to.include('SITECORE_EDITING_SECRET');
  });

  it('should skip the secret check when requireSecret is false', () => {
    const result = authorizeEditingEndpointRequest({
      method: 'GET',
      headers,
      secret: 'wrong-secret',
      requireSecret: false,
    });

    expect(result.ok).to.be.true;
  });
});
