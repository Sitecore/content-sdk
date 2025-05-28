import { expect } from 'chai';
import sinon from 'sinon';
import { status } from './status';
import * as auth from '../../utils/auth/renewal';
import * as tenantStore from './../../utils/auth/tenant-store';

describe('status command', () => {
  let renewStub: sinon.SinonStub;
  let readTenantInfoStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;

  beforeEach(() => {
    consoleLogStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should prompt login if no valid auth is found', async () => {
    renewStub = sinon.stub(auth, 'renewAuthIfExpired').resolves(null);

    await status.handler({} as any);

    expect(consoleLogStub.calledOnce).to.be.true;
    expect(consoleLogStub.firstCall.args[0]).to.include('No valid authentication found');
  });

  it('should show tenant info if valid auth is present', async () => {
    const fakeTenantId = 'tenant-123';
    const fakeTenantInfo = {
      tenantId: fakeTenantId,
      tenantName: 'DemoTenant',
      organizationId: 'org-001',
      clientId: 'client-abc',
      authority: 'https://auth.example.com',
      audience: 'https://api.example.com',
      baseUrl: 'https://sitecore.example.com',
    };

    renewStub = sinon.stub(auth, 'renewAuthIfExpired').resolves({ tenantId: fakeTenantId });
    readTenantInfoStub = sinon.stub(tenantStore, 'readTenantInfo').resolves(fakeTenantInfo);

    await status.handler({} as any);

    const expectedLines = [
      '\n Active tenant:',
      '  Tenant ID       : tenant-123',
      '  Tenant Name     : DemoTenant',
      '  Organization ID : org-001',
      '  Client ID       : client-abc',
      '  Authority       : https://auth.example.com',
      '  Audience        : https://api.example.com',
      '  Base URL        : https://sitecore.example.com',
    ];

    expectedLines.forEach((line) => {
      expect(consoleLogStub.calledWithMatch(line)).to.be.true;
    });
  });
});
