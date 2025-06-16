import { expect } from 'chai';
import sinon from 'sinon';
import { login, unitMock } from './login';

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

  const fakeClientAuthResponse = {
    data: {
      access_token: 'test-access-token',
      expires_in: 3600,
    },
    tokenTenantId: 'test-tenant-id',
    tokenOrgId: 'test-org-id',
    tokenTenantName: 'TestTenant',
  };

  const fakeDeviceAuthResponse = {
    deviceCode: 'device-code-123',
    userCode: 'user-code-456',
    verificationUri: 'https://verify.example.com',
    verificationUriComplete: 'https://verify.example.com/complete',
    expiresIn: 900,
    interval: 5,
  };

  const fakePolledTokenResponse = {
    access_token: 'access-token-from-poll',
    refresh_token: 'refresh-token-from-poll',
    expires_in: 3600,
    token_type: 'Bearer',
  };

  const fakeRefreshedTokenResponse = {
    access_token: 'refreshed-access-token',
    refresh_token: 'refreshed-refresh-token',
    expires_in: 3600,
    token_type: 'Bearer',
    tenantName: 'TestTenant',
  };

  let clientCredentialsStub: sinon.SinonStub;
  let startDeviceAuthStub: sinon.SinonStub;
  let pollForTokenStub: sinon.SinonStub;
  let refreshAccessTokenStub: sinon.SinonStub;

  let writeTenantAuthStub: sinon.SinonStub;
  let writeTenantInfoStub: sinon.SinonStub;
  let setActiveTenantStub: sinon.SinonStub;
  let processExitStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;

  beforeEach(() => {
    clientCredentialsStub = sinon.stub().resolves(fakeClientAuthResponse);
    startDeviceAuthStub = sinon.stub().resolves(fakeDeviceAuthResponse);
    pollForTokenStub = sinon.stub().resolves(fakePolledTokenResponse);
    refreshAccessTokenStub = sinon.stub().resolves(fakeRefreshedTokenResponse);
    writeTenantAuthStub = sinon.stub().resolves();
    writeTenantInfoStub = sinon.stub().resolves();
    setActiveTenantStub = sinon.stub();
    unitMock({
      clientCredentialsFlow: clientCredentialsStub,
      writeTenantAuthInfo: writeTenantAuthStub,
      writeTenantInfo: writeTenantInfoStub,
      setActiveTenant: setActiveTenantStub,
      startDeviceAuthFlow: startDeviceAuthStub,
      pollForDeviceToken: pollForTokenStub,
      getRefreshAccessToken: refreshAccessTokenStub,
    });

    processExitStub = sinon.stub(process, 'exit');
    consoleErrorStub = sinon.stub(console, 'error');
    consoleLogStub = sinon.stub(console, 'log');
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
    expect(setActiveTenantStub.calledWith(fakeClientAuthResponse.tokenTenantId)).to.be.true;
    expect(consoleLogStub.calledWithMatch(/Logged in successfully/)).to.be.true;
  });

  it('should perform login using device flow and refresh token', async () => {
    const deviceFlowArgs = {
      clientId: 'test-client-id',
      tenantId: 'test-tenant-id',
      organizationId: 'test-org-id',
      authority: 'https://auth.example.com',
      audience: 'https://api.example.com',
      baseUrl: 'https://api.example.com',
    };

    await login.handler(deviceFlowArgs as any);

    expect(startDeviceAuthStub.calledOnce).to.be.true;
    expect(
      pollForTokenStub.calledWith({
        clientId: deviceFlowArgs.clientId,
        deviceCode: fakeDeviceAuthResponse.deviceCode,
        authority: deviceFlowArgs.authority,
        interval: fakeDeviceAuthResponse.interval,
      })
    ).to.be.true;

    expect(
      refreshAccessTokenStub.calledWith({
        clientId: deviceFlowArgs.clientId,
        refreshToken: fakePolledTokenResponse.refresh_token,
        tenantId: deviceFlowArgs.tenantId,
        organizationId: deviceFlowArgs.organizationId,
        authority: deviceFlowArgs.authority,
      })
    ).to.be.true;

    expect(writeTenantAuthStub.calledOnce).to.be.true;
    expect(writeTenantInfoStub.calledOnce).to.be.true;
    expect(setActiveTenantStub.calledWith(deviceFlowArgs.tenantId)).to.be.true;
    expect(consoleLogStub.calledWithMatch(/Logged in successfully/)).to.be.true;
  });

  it('should exit if tenantId is missing in device flow', async () => {
    const args = {
      clientId: 'test-client-id',
      organizationId: 'test-org-id',
    };

    processExitStub.callsFake(() => {
      throw new Error('EXIT_CALLED');
    });

    try {
      await login.handler(args as any);
      throw new Error('Test failed: process.exit was not called');
    } catch (err) {
      expect((err as Error).message).to.equal('EXIT_CALLED');
      expect(consoleErrorStub.calledWithMatch(/Tenant ID is required/)).to.be.true;
    }

    expect(processExitStub.calledOnceWith(1)).to.be.true;
  });

  it('should exit if organizationId is missing in device flow', async () => {
    const args = {
      clientId: 'test-client-id',
      tenantId: 'test-tenant-id',
    };

    processExitStub.callsFake(() => {
      throw new Error('EXIT_CALLED');
    });

    try {
      await login.handler(args as any);
      throw new Error('Test failed: process.exit was not called');
    } catch (err) {
      expect((err as Error).message).to.equal('EXIT_CALLED');
      expect(consoleErrorStub.calledWithMatch(/Organization ID is required/)).to.be.true;
    }

    expect(processExitStub.calledOnceWith(1)).to.be.true;
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
