import { expect } from 'chai';
import sinon from 'sinon';
import { clientCredentialsFlow, startDeviceAuthFlow, pollForDeviceToken } from './flow';
import * as jwtUtil from './tenant-store';
import { DEFAULT_SITECORE_AUTH_AUDIENCE, DEFAULT_SITECORE_AUTH_BASE_URL } from '../../constants';

describe('Auth flows', () => {
  const fakeToken = 'fake.jwt.token';
  const fakeDecoded = {
    tokenTenantId: 'tenant123',
    tokenOrgId: 'org456',
    tokenTenantName: 'FakeTenant',
  };

  const tokenResponse = {
    access_token: 'access123',
    refresh_token: 'refresh123',
    expires_in: 3600,
    token_type: 'Bearer',
  };

  const deviceAuthMock = {
    device_code: 'device123',
    user_code: 'user123',
    verification_uri: 'https://verify.uri',
    verification_uri_complete: 'https://verify.uri/complete',
    expires_in: 900,
    interval: 5,
  };

  const fetchClientResponse = {
    ok: true,
    json: async () => ({
      access_token: fakeToken,
      expires_in: 3600,
    }),
  };

  let fetchStub: sinon.SinonStub;
  let decodeStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    fetchStub = sinon.stub(global, 'fetch' as any).resolves(fetchClientResponse as any);
    decodeStub = sinon.stub().returns(fakeDecoded);
    sinon.replace.usingAccessor(jwtUtil.unitMocks, 'decodeJwtPayload', decodeStub);

    consoleErrorStub = sinon.stub(console, 'error');
    consoleLogStub = sinon.stub(console, 'log');
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('clientCredentialsFlow', () => {
    it('should succeed without tenantId/orgId using token claims', async () => {
      fetchStub.resolves({
        ok: true,
        json: async () => ({ access_token: fakeToken, expires_in: 3600 }),
      });

      const result = await clientCredentialsFlow({ clientId: 'id', clientSecret: 'secret' });

      expect(result.data.access_token).to.equal(fakeToken);
      expect(result.tokenTenantId).to.equal(fakeDecoded.tokenTenantId);
    });

    it('should succeed if tenantId/orgId match token', async () => {
      decodeStub.returns({
        tokenTenantId: 'tenant123',
        tokenOrgId: 'org456',
        tokenTenantName: 'FakeTenant',
      });

      const result = await clientCredentialsFlow({
        clientId: 'id',
        clientSecret: 'secret',
        tenantId: 'tenant123',
        organizationId: 'org456',
      });

      expect(result.data.access_token).to.equal(fakeToken);
      expect(result.tokenTenantId).to.equal('tenant123');
      expect(result.tokenOrgId).to.equal('org456');
      expect(result.tokenTenantName).to.equal('FakeTenant');
    });

    it('should use default values when audience, authority, and baseUrl are not provided', async () => {
      const expectedParams = new URLSearchParams({
        client_id: 'id',
        client_secret: 'secret',
        organization_id: '',
        tenant_id: '',
        audience: DEFAULT_SITECORE_AUTH_AUDIENCE,
        grant_type: 'client_credentials',
        baseUrl: DEFAULT_SITECORE_AUTH_BASE_URL,
      }).toString();

      let actualRequestBody: string = '';

      fetchStub.callsFake(async (_url: string, options: any) => {
        actualRequestBody = options.body;
        return fetchClientResponse as any;
      });

      await clientCredentialsFlow({
        clientId: 'id',
        clientSecret: 'secret',
      });

      expect(actualRequestBody).to.equal(expectedParams);
    });

    it('should override defaults with custom values', async () => {
      const authority = 'https://custom-authority';
      const audience = 'https://custom-audience';
      const baseUrl = 'https://custom-base';

      let actualUrl = '';
      let actualBody = '';
      fetchStub.callsFake(async (url: string, options: any) => {
        actualUrl = url;
        actualBody = options.body;
        return { ok: true, json: async () => ({ access_token: fakeToken, expires_in: 3600 }) };
      });

      await clientCredentialsFlow({
        clientId: 'id',
        clientSecret: 'secret',
        authority,
        audience,
        baseUrl,
      });

      expect(actualUrl).to.equal(`${authority}/oauth/token`);
      expect(actualBody).to.include(`audience=${encodeURIComponent(audience)}`);
    });

    it('should throw if token is missing required claims', async () => {
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

    it('should throw if tenantId/orgId do not match token', async () => {
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

    it('should throw if fetch fails', async () => {
      fetchStub.resolves({ ok: false, json: async () => ({ error: 'unauthorized' }) });

      try {
        await clientCredentialsFlow({
          clientId: 'id',
          clientSecret: 'secret',
        });
      } catch (err) {
        expect((err as Error).message).to.equal('unauthorized');
      }
    });
  });

  describe('startDeviceAuthFlow', () => {
    it('should return expected values on success', async () => {
      fetchStub.resolves({ ok: true, json: async () => deviceAuthMock });

      const result = await startDeviceAuthFlow({
        clientId: 'abc',
        authority: 'https://auth.example.com',
        audience: 'https://api.example.com',
        baseUrl: 'https://api.example.com',
      });

      expect(result).to.deep.equal({
        deviceCode: 'device123',
        userCode: 'user123',
        verificationUri: 'https://verify.uri',
        verificationUriComplete: 'https://verify.uri/complete',
        expiresIn: 900,
        interval: 5,
      });
    });

    it('should throw if response is not ok', async () => {
      fetchStub.resolves({
        ok: false,
        json: async () => ({ error_description: 'Invalid client ID' }),
      });

      try {
        await startDeviceAuthFlow({
          clientId: 'abc',
          authority: 'https://auth.example.com',
          audience: 'https://api.example.com',
          baseUrl: 'https://api.example.com',
        });
      } catch (err) {
        expect((err as Error).message).to.equal('Invalid client ID');
      }
    });
  });

  describe('pollForDeviceToken', () => {
    it('should return token on first success', async () => {
      fetchStub.resolves({ ok: true, json: async () => tokenResponse });

      const result = await pollForDeviceToken({
        clientId: 'client123',
        deviceCode: 'device456',
      });

      expect(result).to.deep.equal(tokenResponse);
    });

    it('should poll through authorization_pending and return token', async () => {
      fetchStub
        .onCall(0)
        .resolves({ ok: false, json: async () => ({ error: 'authorization_pending' }) })
        .onCall(1)
        .resolves({ ok: true, json: async () => tokenResponse });

      const promise = pollForDeviceToken({
        clientId: 'client123',
        deviceCode: 'device456',
        interval: 1,
      });

      await clock.tickAsync(1000);
      await clock.tickAsync(1000);

      const result = await promise;
      expect(result).to.deep.equal(tokenResponse);
    });

    it('should increase interval on slow_down', async () => {
      fetchStub
        .onCall(0)
        .resolves({ ok: false, json: async () => ({ error: 'slow_down' }) })
        .onCall(1)
        .resolves({ ok: true, json: async () => tokenResponse });

      const promise = pollForDeviceToken({
        clientId: 'client123',
        deviceCode: 'device456',
        interval: 1,
      });

      await clock.tickAsync(1000);
      await clock.tickAsync(6000);

      const result = await promise;
      expect(result).to.deep.equal(tokenResponse);
    });

    it('should throw for unknown error', async () => {
      fetchStub.resolves({ ok: false, json: async () => ({ error: 'invalid_grant' }) });

      try {
        await pollForDeviceToken({ clientId: 'client123', deviceCode: 'device456' });
      } catch (err) {
        expect((err as Error).message).to.equal('invalid_grant');
      }
    });

    it('should throw timeout error after polling', async () => {
      fetchStub.resolves({ ok: false, json: async () => ({ error: 'authorization_pending' }) });

      const promise = pollForDeviceToken({
        clientId: 'client123',
        deviceCode: 'device456',
        interval: 1,
      });

      await clock.tickAsync(601000);

      try {
        await promise;
      } catch (err) {
        expect((err as Error).message).to.equal(
          '⏳ Timeout: User did not complete authorization in time.'
        );
      }
    });
  });
});
