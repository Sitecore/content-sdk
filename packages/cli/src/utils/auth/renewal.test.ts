import { expect } from 'chai';
import sinon from 'sinon';
import { validateAuthInfo, renewClientToken, renewAuthIfExpired } from './renewal';

import * as authFlow from './flow';
import * as tenantStore from './tenant-store';
import * as tenantState from './tenant-state';

describe('auth token renewal utilities', () => {
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

  let flowStub: sinon.SinonStub;
  let writeStub: sinon.SinonStub;
  let readAuthStub: sinon.SinonStub;
  let readTenantInfoStub: sinon.SinonStub;
  let getTenantStub: sinon.SinonStub;
  let deleteAuthStub: sinon.SinonStub;
  let clearActiveStub: sinon.SinonStub;
  let consoleInfoStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;

  beforeEach(() => {
    flowStub = sinon.stub(authFlow, 'clientCredentialsFlow').resolves({
      data: {
        access_token: 'new-token',
        expires_in: 3600,
      },
      tokenOrgId: 'org1',
      tokenTenantId: 'tenant1',
      tokenTenantName: 'DemoTenant',
    });

    writeStub = sinon.stub(tenantStore, 'writeTenantAuthInfo').resolves();
    readAuthStub = sinon.stub(tenantStore, 'readTenantAuthInfo');
    readTenantInfoStub = sinon.stub(tenantStore, 'readTenantInfo');
    getTenantStub = sinon.stub(tenantState, 'getActiveTenant');
    deleteAuthStub = sinon.stub(tenantStore, 'deleteTenantAuthInfo').resolves();
    clearActiveStub = sinon.stub(tenantState, 'clearActiveTenant');
    consoleInfoStub = sinon.stub(console, 'info');
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

      expect(flowStub.calledOnce).to.be.true;
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

  describe('renewAuthIfExpired', () => {
    it('should return null if no active tenant', async () => {
      getTenantStub.returns(null);

      const result = await renewAuthIfExpired();
      expect(result).to.be.null;
    });

    it('should return null if no auth config is found', async () => {
      getTenantStub.returns('tenant1');
      readAuthStub.resolves(null);

      const result = await renewAuthIfExpired();
      expect(result).to.be.null;
    });

    it('should return tenantId if auth is still valid', async () => {
      getTenantStub.returns('tenant1');
      readAuthStub.resolves({ ...authMock, expires_at: futureDate });

      const result = await renewAuthIfExpired();
      expect(result).to.deep.equal({ tenantId: 'tenant1' });
    });

    it('should renew and return tenantId if token is expired', async () => {
      getTenantStub.returns('tenant1');
      readAuthStub.resolves({ ...authMock, expires_at: pastDate });
      readTenantInfoStub.resolves(tenantMock);

      const result = await renewAuthIfExpired();

      expect(flowStub.calledOnce).to.be.true;
      expect(result).to.deep.equal({ tenantId: 'tenant1' });
    });

    it('should handle renewal error and cleanup', async () => {
      getTenantStub.returns('tenant1');
      readAuthStub.resolves({ ...authMock, expires_at: pastDate });
      readTenantInfoStub.resolves(tenantMock);
      flowStub.rejects(new Error('Network error'));

      const result = await renewAuthIfExpired();

      expect(consoleErrorStub.calledWithMatch(/Token renewal failed/)).to.be.true;
      expect(deleteAuthStub.calledOnce).to.be.true;
      expect(clearActiveStub.calledOnce).to.be.true;
      expect(result).to.be.null;
    });

    it('should error out if clientSecret is missing', async () => {
      getTenantStub.returns('tenant1');
      readAuthStub.resolves({
        access_token: 'token',
        expires_at: pastDate,
        expires_in: 3600,
      });
      readTenantInfoStub.resolves(tenantMock);

      const result = await renewAuthIfExpired();

      expect(result).to.be.null;
      expect(consoleErrorStub.calledWithMatch(/clientSecret/)).to.be.true;
      expect(deleteAuthStub.calledOnce).to.be.true;
      expect(clearActiveStub.calledOnce).to.be.true;
    });

    it('should return null if tenant info cannot be read', async () => {
      getTenantStub.returns('tenant1');
      readAuthStub.resolves({ ...authMock, expires_at: pastDate });
      readTenantInfoStub.resolves(null);

      const result = await renewAuthIfExpired();

      expect(result).to.be.null;
    });
  });
});
