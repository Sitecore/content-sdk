import { expect } from 'chai';
import sinon from 'sinon';
import { login } from '../../../src/scripts/auth/login';
import * as authFlow from '../../../src/utils/auth/flow';
import * as tenantStore from '../../../src/utils/auth/tenant-store';
import * as tenantState from '../../../src/utils/auth/tenant-state';

describe('login command', () => {
  const fakeArgs = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    tenantId: 'test-tenant-id',
    organizationId: 'test-org-id',
    audience: 'https://example.com/api',
    authority: 'https://auth.example.com',
    baseUrl: 'https://api.example.com',
  };

  const fakeAuthResponse = {
    data: {
      access_token: 'test-access-token',
      expires_in: 3600,
    },
    tokenTenantId: 'test-tenant-id',
    tokenOrgId: 'test-org-id',
    tokenTenantName: 'TestTenant',
  };

  let clientCredentialsStub: sinon.SinonStub;
  let writeTenantAuthStub: sinon.SinonStub;
  let writeTenantInfoStub: sinon.SinonStub;
  let setActiveTenantStub: sinon.SinonStub;
  let consoleInfoStub: sinon.SinonStub;
  let processExitStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;

  beforeEach(() => {
    clientCredentialsStub = sinon
      .stub(authFlow, 'clientCredentialsFlow')
      .resolves(fakeAuthResponse);
    writeTenantAuthStub = sinon.stub(tenantStore, 'writeTenantAuthInfo').resolves();
    writeTenantInfoStub = sinon.stub(tenantStore, 'writeTenantInfo').resolves();
    setActiveTenantStub = sinon.stub(tenantState, 'setActiveTenant');
    consoleInfoStub = sinon.stub(console, 'info');
    processExitStub = sinon.stub(process, 'exit');
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should call clientCredentialsFlow and save tenant info', async () => {
    await login.handler(fakeArgs as any);

    expect(clientCredentialsStub.calledOnce).to.be.true;
    expect(clientCredentialsStub.firstCall.args[0]).to.include({
      clientId: fakeArgs.clientId,
      clientSecret: fakeArgs.clientSecret,
      organizationId: fakeArgs.organizationId,
      tenantId: fakeArgs.tenantId,
      audience: fakeArgs.audience,
      authority: fakeArgs.authority,
      baseUrl: fakeArgs.baseUrl,
    });

    expect(writeTenantAuthStub.calledOnce).to.be.true;
    expect(writeTenantInfoStub.calledOnce).to.be.true;
    expect(setActiveTenantStub.calledWith(fakeAuthResponse.tokenTenantId)).to.be.true;
    expect(consoleInfoStub.calledWithMatch(/Logged in successfully/)).to.be.true;
  });

  it('should exit when clientCredentialsFlow throws', async () => {
    clientCredentialsStub.rejects(new Error('invalid'));

    processExitStub.callsFake(() => {
      throw new Error('EXIT_CALLED');
    });

    const argv = {
      clientId: 'test-client-id',
      clientSecret: 'valid-secret',
    };

    try {
      await login.handler(argv as any);
      throw new Error('Test failed: process.exit was not called');
    } catch (err) {
      expect((err as Error).message).to.equal('EXIT_CALLED');
    }

    expect(consoleErrorStub.calledWithMatch('Login failed')).to.be.true;
    expect(processExitStub.calledOnceWith(1)).to.be.true;
  });
});
