import { expect } from 'chai';
import sinon from 'sinon';
import { clientCredentialsFlow } from './flow';
import * as jwtUtil from './tenant-store';
import { DEFAULT_SITECORE_AUTH_AUDIENCE, DEFAULT_SITECORE_AUTH_BASE_URL } from '../../constants';

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
  let consoleErrorStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(global, 'fetch' as any).resolves(fetchResponse as any);
    decodeStub = sinon.stub().returns(fakeDecoded);
    sinon.replace.usingAccessor(jwtUtil.unitMocks, 'decodeJwtPayload', decodeStub);
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should succeed when tenantId and organizationId are not passed and grab them from token claims', async () => {
    const result = await clientCredentialsFlow({
      clientId: 'id',
      clientSecret: 'secret',
    });

    expect(result.data.access_token).to.equal(fakeToken);
    expect(result.tokenTenantId).to.equal(fakeDecoded.tokenTenantId);
    expect(result.tokenOrgId).to.equal(fakeDecoded.tokenOrgId);
    expect(result.tokenTenantName).to.equal(fakeDecoded.tokenTenantName);
  });

  it('should succeed only if passed tenantId and organizationId match token claims', async () => {
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
      return fetchResponse as any;
    });

    await clientCredentialsFlow({
      clientId: 'id',
      clientSecret: 'secret',
    });

    expect(actualRequestBody).to.equal(expectedParams);
  });

  it('should override defaults when custom audience, authority, and baseUrl are provided', async () => {
    const customAuthority = 'https://custom-authority.io';
    const customAudience = 'https://custom-api.io';
    const customBaseUrl = 'https://custom-base.io';

    const expectedParams = new URLSearchParams({
      client_id: 'id',
      client_secret: 'secret',
      organization_id: '',
      tenant_id: '',
      audience: customAudience,
      grant_type: 'client_credentials',
      baseUrl: customBaseUrl,
    }).toString();

    let actualUrl: string = '';
    let actualRequestBody: string = '';

    fetchStub.callsFake(async (url: string, options: any) => {
      actualUrl = url;
      actualRequestBody = options.body;
      return fetchResponse as any;
    });

    await clientCredentialsFlow({
      clientId: 'id',
      clientSecret: 'secret',
      authority: customAuthority,
      audience: customAudience,
      baseUrl: customBaseUrl,
    });

    expect(actualUrl).to.equal(`${customAuthority}/oauth/token`);
    expect(actualRequestBody).to.equal(expectedParams);
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

  it('should throw and log error on non-OK response', async () => {
    fetchStub.resolves({
      ok: false,
      json: async () => ({ error: 'unauthorized' }),
    });

    try {
      await clientCredentialsFlow({
        clientId: 'id',
        clientSecret: 'secret',
        tenantId: 'tenant123',
        organizationId: 'org456',
      });
    } catch (err) {
      expect((err as Error).message).to.include('unauthorized');
    }
  });
});
