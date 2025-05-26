import { expect } from 'chai';
import sinon from 'sinon';
import { clientCredentialsFlow } from './flow';
import * as jwtUtil from './tenant-store';

describe('clientCredentialsFlow', () => {
  const fakeToken = 'fake.jwt.token';
  const fakeDecoded = {
    tokenTenantId: 'tenant123',
    tokenOrgId: 'org456',
    tokenTenantName: 'FakeTenant',
  };

  const fetchResponse = {
    ok: true,
    json: async () => ({
      access_token: fakeToken,
      expires_in: 3600,
    }),
  };

  let fetchStub: sinon.SinonStub;
  let decodeStub: sinon.SinonStub;
  let processExitStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(global, 'fetch' as any).resolves(fetchResponse as any);
    decodeStub = sinon.stub(jwtUtil, 'decodeJwtPayload').returns(fakeDecoded);
    processExitStub = sinon.stub(process, 'exit');
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should succeed when tenantId and organizationId are not passed', async () => {
    const result = await clientCredentialsFlow({
      clientId: 'id',
      clientSecret: 'secret',
    });

    expect(result.data.access_token).to.equal(fakeToken);
    expect(result.tokenTenantId).to.equal(fakeDecoded.tokenTenantId);
    expect(result.tokenOrgId).to.equal(fakeDecoded.tokenOrgId);
    expect(result.tokenTenantName).to.equal(fakeDecoded.tokenTenantName);
  });

  it('should succeed when tenantId and organizationId are passed', async () => {
    const result = await clientCredentialsFlow({
      clientId: 'id',
      clientSecret: 'secret',
      tenantId: 'tenant123',
      organizationId: 'org456',
    });

    expect(result.data.access_token).to.equal(fakeToken);
    expect(result.tokenTenantId).to.equal(fakeDecoded.tokenTenantId);
    expect(result.tokenOrgId).to.equal(fakeDecoded.tokenOrgId);
    expect(result.tokenTenantName).to.equal(fakeDecoded.tokenTenantName);
  });

  it('should throw if token has missing claims', async () => {
    decodeStub.returns({});

    try {
      await clientCredentialsFlow({
        clientId: 'id',
        clientSecret: 'secret',
        tenantId: 'tenant123',
        organizationId: 'org456',
      });
    } catch (err) {
      expect((err as Error).message).to.include('Token is missing required claims');
    }
  });

  it('should throw if tenantId does not match token', async () => {
    decodeStub.returns({ ...fakeDecoded, tokenTenantId: 'wrong-id' });

    try {
      await clientCredentialsFlow({
        clientId: 'id',
        clientSecret: 'secret',
        tenantId: 'tenant123',
        organizationId: 'org456',
      });
    } catch (err) {
      expect((err as Error).message).to.include('tenant ID does not match');
    }
  });

  it('should throw if organizationId does not match token', async () => {
    decodeStub.returns({ ...fakeDecoded, tokenOrgId: 'wrong-org' });

    try {
      await clientCredentialsFlow({
        clientId: 'id',
        clientSecret: 'secret',
        tenantId: 'tenant123',
        organizationId: 'org456',
      });
    } catch (err) {
      expect((err as Error).message).to.include('organization ID does not match');
    }
  });

  it('should exit process and log error on non-OK response', async () => {
    fetchStub.resolves({
      ok: false,
      json: async () => ({ error: 'unauthorized' }),
    });

    await clientCredentialsFlow({
      clientId: 'id',
      clientSecret: 'secret',
      tenantId: 'tenant123',
      organizationId: 'org456',
    });

    expect(consoleErrorStub.called).to.be.true;
    expect(processExitStub.calledOnce).to.be.true;
  });
});
