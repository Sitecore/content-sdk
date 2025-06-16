import { expect } from 'chai';
import sinon from 'sinon';
import { validateAuthInfo, validateAndRenewAuthIfExpired, renewClientToken } from './renewal';
import * as jwtUtils from './tenant-store';
import * as authFlow from './flow';
import * as tenantStore from './tenant-store';
import * as tenantState from './tenant-state';
import * as encryptionUtil from './encryption';
import * as renewalUtils from './renewal';

describe('Auth Token Renewal Utilities', () => {
  const futureDate = new Date(Date.now() + 3600 * 1000).toISOString();
  const pastDate = new Date(Date.now() - 3600 * 1000).toISOString();

  const authMock = {
    clientSecret: 'secret',
    access_token: 'token',
    expires_in: 3600,
    expires_at: futureDate,
  };

  const tenantMock = {
    tenantId: 'tenant1',
    tenantName: 'DemoTenant',
    organizationId: 'org1',
    clientId: 'cid',
    audience: 'audience',
    authority: 'auth',
    baseUrl: 'https://fake.base.url',
  };

  const fakeRefreshTokenResponseData = {
    access_token: 'fake-access-token',
    refresh_token: 'new-refresh-token',
    expires_in: 3600,
    token_type: 'Bearer',
  };

  let clientCredentialsFlowStub: sinon.SinonStub;
  let writeStub: sinon.SinonStub;
  let readAuthStub: sinon.SinonStub;
  let readTenantInfoStub: sinon.SinonStub;
  let getTenantStub: sinon.SinonStub;
  let deleteAuthStub: sinon.SinonStub;
  let clearActiveStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;
  let deleteKeyStub: sinon.SinonStub;
  let refreshTokenStub: sinon.SinonStub;

  beforeEach(() => {
    clientCredentialsFlowStub = sinon.stub().resolves({
      data: {
        access_token: 'new-token',
        expires_in: 3600,
      },
      tokenOrgId: 'org1',
      tokenTenantId: 'tenant1',
      tokenTenantName: 'DemoTenant',
    });

    writeStub = sinon.stub().resolves();
    readAuthStub = sinon.stub();
    readTenantInfoStub = sinon.stub();
    deleteAuthStub = sinon.stub().resolves();
    deleteKeyStub = sinon.stub().resolves();
    clearActiveStub = sinon.stub().resolves();
    getTenantStub = sinon.stub();
    refreshTokenStub = sinon.stub().resolves({
      data: fakeRefreshTokenResponseData,
      tenantName: 'DemoTenant',
    });

    sinon.replace.usingAccessor(tenantStore.unitMocks, 'writeTenantAuthInfo', writeStub);
    sinon.replace.usingAccessor(tenantStore.unitMocks, 'readTenantAuthInfo', readAuthStub);
    sinon.replace.usingAccessor(tenantStore.unitMocks, 'readTenantInfo', readTenantInfoStub);
    sinon.replace.usingAccessor(tenantStore.unitMocks, 'deleteTenantAuthInfo', deleteAuthStub);
    sinon.replace.usingAccessor(encryptionUtil.unitMocks, 'deleteKey', deleteKeyStub);
    sinon.replace.usingAccessor(tenantState.unitMocks, 'getActiveTenant', getTenantStub);
    sinon.replace.usingAccessor(tenantState.unitMocks, 'clearActiveTenant', clearActiveStub);
    sinon.replace.usingAccessor(
      authFlow.unitMocks,
      'clientCredentialsFlow',
      clientCredentialsFlowStub
    );
    sinon.replace.usingAccessor(renewalUtils.unitMocks, 'getRefreshAccessToken', refreshTokenStub);

    consoleLogStub = sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('validateAuthInfo', () => {
    it('should return true if token is not expired', () => {
      const result = validateAuthInfo({ ...authMock, expires_at: futureDate });
      expect(result).to.be.true;
    });

    it('should return false if token is expired', () => {
      const result = validateAuthInfo({ ...authMock, expires_at: pastDate });
      expect(result).to.be.false;
    });
  });

  describe('renewClientToken', () => {
    it('should call flow and update auth file with new token', async () => {
      await renewClientToken(authMock, tenantMock);

      expect(clientCredentialsFlowStub.calledOnce).to.be.true;
      expect(writeStub.calledOnce).to.be.true;
      expect(writeStub.firstCall.args[0]).to.equal('tenant1');

      const writtenAuth = writeStub.firstCall.args[1];
      expect(writtenAuth).to.deep.include({
        clientSecret: authMock.clientSecret,
        access_token: 'new-token',
        expires_in: 3600,
      });
      expect(writtenAuth.expires_at).to.be.a('string');
    });
  });

  describe('validateAndRenewAuthIfExpired', () => {
    it('should return null if no active tenant', async () => {
      getTenantStub.returns(null);

      const result = await validateAndRenewAuthIfExpired();
      expect(result).to.be.null;
    });

    it('should return null if no auth config is found', async () => {
      getTenantStub.returns('tenant1');
      readAuthStub.resolves(null);

      const result = await validateAndRenewAuthIfExpired();
      expect(result).to.be.null;
    });

    it('should return null if tenant info cannot be read', async () => {
      getTenantStub.returns('tenant1');
      readAuthStub.resolves({ ...authMock, expires_at: pastDate });
      readTenantInfoStub.resolves(null);

      const result = await validateAndRenewAuthIfExpired();

      expect(result).to.be.null;
    });

    it('should return tenantId if auth is still valid', async () => {
      getTenantStub.returns('tenant1');
      readAuthStub.resolves({ ...authMock, expires_at: futureDate });

      const result = await validateAndRenewAuthIfExpired();
      expect(result).to.deep.equal({ tenantId: 'tenant1' });
    });

    it('should renew token using client credentials flow if clientSecret is present', async () => {
      getTenantStub.returns('tenant1');
      readAuthStub.resolves({ ...authMock, expires_at: pastDate });
      readTenantInfoStub.resolves(tenantMock);

      const result = await validateAndRenewAuthIfExpired();

      expect(clientCredentialsFlowStub.calledOnce).to.be.true;
      expect(result).to.deep.equal({ tenantId: 'tenant1' });
    });

    it('should renew token using refresh token if present', async () => {
      getTenantStub.returns('tenant1');
      readAuthStub.resolves({ refresh_token: 'test-refresh-token', expires_at: pastDate });
      readTenantInfoStub.resolves(tenantMock);

      const result = await validateAndRenewAuthIfExpired();

      expect(writeStub.calledOnce).to.be.true;
      expect(writeStub.firstCall.args[0]).to.equal('tenant1');
      expect(writeStub.firstCall.args[1]).to.have.property('access_token', 'fake-access-token');
      expect(result).to.deep.equal({ tenantId: 'tenant1' });
    });

    it('should exit if no valid credentials for renewal are present', async () => {
      getTenantStub.returns('tenant1');
      readAuthStub.resolves({ expires_at: pastDate }); // no clientSecret or refresh_token
      readTenantInfoStub.resolves(tenantMock);

      const exitStub = sinon.stub(process, 'exit').callsFake(() => {
        throw new Error('EXIT_CALLED');
      });

      try {
        await validateAndRenewAuthIfExpired();
        throw new Error('Test failed');
      } catch (err) {
        expect((err as Error).message).to.equal('EXIT_CALLED');
      }

      expect(consoleErrorStub.calledWithMatch(/No valid credentials/)).to.be.true;
    });

    it('should exit if token renewal fails unexpectedly', async () => {
      getTenantStub.returns('tenant1');
      readAuthStub.resolves({ ...authMock, expires_at: pastDate });
      readTenantInfoStub.resolves(tenantMock);
      clientCredentialsFlowStub.rejects(new Error('Unexpected failure'));

      const exitStub = sinon.stub(process, 'exit').callsFake(() => {
        throw new Error('EXIT_CALLED');
      });

      try {
        await validateAndRenewAuthIfExpired();
        throw new Error('Test failed: process.exit not triggered');
      } catch (err) {
        if (err instanceof Error) {
          expect(err.message).to.equal('EXIT_CALLED');
        } else {
          throw err;
        }
      }

      expect(consoleErrorStub.calledWithMatch(/Failed to renew token/)).to.be.true;
      expect(consoleLogStub.calledWithMatch(/Cleaning up stale/)).to.be.true;
      expect(deleteAuthStub.calledOnce).to.be.true;
      expect(deleteKeyStub.calledOnceWithExactly('tenant1')).to.be.true;
      expect(clearActiveStub.calledOnce).to.be.true;
      expect(exitStub.calledOnceWith(1)).to.be.true;
    });
  });
});

describe('getRefreshAccessToken', () => {
  const fakeRefreshTokenInput = {
    clientId: 'test-client-id',
    refreshToken: 'test-refresh-token',
    tenantId: 'test-tenant-id',
    organizationId: 'test-org-id',
    authority: 'https://auth.example.com',
  };

  const fakeRefreshTokenResponseData = {
    access_token: 'fake-access-token',
    refresh_token: 'new-refresh-token',
    expires_in: 3600,
    token_type: 'Bearer',
  };

  let fetchStub: sinon.SinonStub;
  let decodeStub: sinon.SinonStub;

  beforeEach(() => {
    decodeStub = sinon.stub().returns(fakeRefreshTokenResponseData);
    fetchStub = sinon.stub(global, 'fetch');

    sinon.replace.usingAccessor(jwtUtils.unitMocks, 'decodeJwtPayload', decodeStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return token data with tenantName on success', async () => {
    fetchStub.resolves({
      ok: true,
      json: async () => fakeRefreshTokenResponseData,
    } as Response);

    decodeStub.returns({ tenantName: 'DemoTenant' });

    const result = await renewalUtils.getRefreshAccessToken(fakeRefreshTokenInput);

    expect(result).to.deep.equal({
      ...fakeRefreshTokenResponseData,
      tenantName: 'DemoTenant',
    });

    expect(fetchStub.calledOnce).to.be.true;
    const [url, options] = fetchStub.firstCall.args;
    expect(url).to.equal(`${fakeRefreshTokenInput.authority}/oauth/token`);
    expect(options.method).to.equal('POST');

    expect(decodeStub.calledOnceWith(fakeRefreshTokenResponseData.access_token)).to.be.true;
  });

  it('should throw with error_description on failure', async () => {
    fetchStub.resolves({
      ok: false,
      json: async () => ({
        error: 'invalid_request',
        error_description: 'Invalid refresh token',
      }),
    } as Response);

    try {
      await renewalUtils.getRefreshAccessToken(fakeRefreshTokenInput);
      expect.fail('Expected function to throw');
    } catch (err) {
      expect(err).to.be.instanceOf(Error);
      expect((err as Error).message).to.equal('Invalid refresh token');
    }
  });

  it('should throw with error message on failure if error_description is missing', async () => {
    fetchStub.resolves({
      ok: false,
      json: async () => ({
        error: 'unauthorized_client',
      }),
    } as Response);

    try {
      await renewalUtils.getRefreshAccessToken(fakeRefreshTokenInput);
      expect.fail('Expected function to throw');
    } catch (err) {
      expect(err).to.be.instanceOf(Error);
      expect((err as Error).message).to.equal('unauthorized_client');
    }
  });

  it('should throw generic error when no error info is available', async () => {
    fetchStub.resolves({
      ok: false,
      json: async () => ({}),
    } as Response);

    try {
      await renewalUtils.getRefreshAccessToken(fakeRefreshTokenInput);
      expect.fail('Expected function to throw');
    } catch (err) {
      expect(err).to.be.instanceOf(Error);
      expect((err as Error).message).to.equal('Error refreshing access token');
    }
  });
});
