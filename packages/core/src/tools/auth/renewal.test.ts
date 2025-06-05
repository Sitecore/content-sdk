import { expect } from 'chai';
import sinon from 'sinon';
import { validateAuthInfo, renewClientToken, validateAndRenewAuthIfExpired } from './renewal';

import * as authFlow from './flow';
import * as tenantStore from './tenant-store';
import * as tenantState from './tenant-state';
import * as encryptionUtil from './encryption';

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
  let consoleWarnStub: sinon.SinonStub;
  let deleteKeyStub: sinon.SinonStub;

  beforeEach(() => {
    flowStub = sinon.stub().resolves({
      data: {
        access_token: 'new-token',
        expires_in: 3600,
      },
      tokenOrgId: 'org1',
      tokenTenantId: 'tenant1',
      tokenTenantName: 'DemoTenant',
    });
    sinon.replace.usingAccessor(authFlow.unitMocks, 'clientCredentialsFlow', flowStub);

    writeStub = sinon.stub().resolves();
    readAuthStub = sinon.stub();
    readTenantInfoStub = sinon.stub();
    deleteAuthStub = sinon.stub().resolves();
    deleteKeyStub = sinon.stub().resolves();

    sinon.replace.usingAccessor(tenantStore.unitMocks, 'writeTenantAuthInfo', writeStub);
    sinon.replace.usingAccessor(tenantStore.unitMocks, 'readTenantAuthInfo', readAuthStub);
    sinon.replace.usingAccessor(tenantStore.unitMocks, 'readTenantInfo', readTenantInfoStub);
    sinon.replace.usingAccessor(tenantStore.unitMocks, 'deleteTenantAuthInfo', deleteAuthStub);
    sinon.replace.usingAccessor(encryptionUtil.unitMocks, 'deleteKey', deleteKeyStub);

    getTenantStub = sinon.stub();
    clearActiveStub = sinon.stub().resolves();

    sinon.replace.usingAccessor(tenantState.unitMocks, 'getActiveTenant', getTenantStub);
    sinon.replace.usingAccessor(tenantState.unitMocks, 'clearActiveTenant', clearActiveStub);

    consoleInfoStub = sinon.stub(console, 'info');
    consoleErrorStub = sinon.stub(console, 'error');
    consoleWarnStub = sinon.stub(console, 'warn');
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

    it('should exit if token renewal fails unexpectedly', async () => {
      getTenantStub.returns('tenant1');
      readAuthStub.resolves({ ...authMock, expires_at: pastDate });
      readTenantInfoStub.resolves(tenantMock);
      flowStub.rejects(new Error('Unexpected failure'));

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
      expect(consoleWarnStub.calledWithMatch(/Cleaning up stale/)).to.be.true;
      expect(deleteAuthStub.calledOnce).to.be.true;
      expect(deleteKeyStub.calledOnceWithExactly('encryptionKey-tenant1')).to.be.true;
      expect(clearActiveStub.calledOnce).to.be.true;
      expect(exitStub.calledOnceWith(1)).to.be.true;
    });
  });
});
