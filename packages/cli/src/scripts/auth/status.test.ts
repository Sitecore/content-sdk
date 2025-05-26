import { expect } from 'chai';
import sinon from 'sinon';
import { status } from './status';
import * as auth from '../../utils/auth/renewal';
import * as tenantStore from './../../utils/auth/tenant-store';

describe('status command', () => {
  let renewStub: sinon.SinonStub;
  let readTenantInfoStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let consoleInfoStub: sinon.SinonStub;
  let consoleTableStub: sinon.SinonStub;

  beforeEach(() => {
    consoleLogStub = sinon.stub(console, 'log');
    consoleInfoStub = sinon.stub(console, 'info');
    consoleTableStub = sinon.stub(console, 'table');
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
    };

    renewStub = sinon.stub(auth, 'renewAuthIfExpired').resolves({ tenantId: fakeTenantId });
    readTenantInfoStub = sinon.stub(tenantStore, 'readTenantInfo').resolves(fakeTenantInfo);

    await status.handler({} as any);

    expect(consoleInfoStub.calledWithMatch('Active tenant')).to.be.true;
    expect(consoleTableStub.calledOnce).to.be.true;

    const outputRow = consoleTableStub.firstCall.args[0][0];
    expect(outputRow.tenant_id).to.equal(fakeTenantId);
    expect(outputRow.tenant_name).to.equal('DemoTenant');
    expect(outputRow.organization_id).to.equal('org-001');
    expect(outputRow.client_id).to.equal('client-abc');
  });
});
