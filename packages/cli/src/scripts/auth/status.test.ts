import { expect } from 'chai';
import sinon from 'sinon';
import { status, unitMock } from './status';

describe('status command', () => {
  let validateAndRenewAuthIfExpiredStub: sinon.SinonStub;
  let readTenantInfoStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;

  beforeEach(() => {
    validateAndRenewAuthIfExpiredStub = sinon.stub();
    consoleLogStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    sinon.restore();
  });
  it('should prompt login if no valid auth is found', async () => {
    validateAndRenewAuthIfExpiredStub.resolves(null);
    unitMock({ validateAndRenewAuthIfExpired: validateAndRenewAuthIfExpiredStub });
    unitMock({ validateAndRenewAuthIfExpired: validateAndRenewAuthIfExpiredStub });

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

    validateAndRenewAuthIfExpiredStub = sinon.stub().resolves({ tenantId: fakeTenantId });
    readTenantInfoStub = sinon.stub().resolves(fakeTenantInfo);
    unitMock({
      validateAndRenewAuthIfExpired: validateAndRenewAuthIfExpiredStub,
      readTenantInfo: readTenantInfoStub,
    });

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
