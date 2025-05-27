import { expect } from 'chai';
import sinon from 'sinon';
import { list } from './list';
import * as tenantStore from '../../../src/utils/auth/tenant-store';

describe('list command', () => {
  let getAllTenantsStub: sinon.SinonStub;
  let consoleInfoStub: sinon.SinonStub;
  let consoleTableStub: sinon.SinonStub;

  beforeEach(() => {
    consoleInfoStub = sinon.stub(console, 'info');
    consoleTableStub = sinon.stub(console, 'table');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should log message if no tenants are found', async () => {
    getAllTenantsStub = sinon.stub(tenantStore, 'getAllTenantsInfo').returns([]);

    await list.handler({} as any);

    expect(consoleInfoStub.calledOnce).to.be.true;
    expect(consoleInfoStub.firstCall.args[0]).to.include('No tenant information found');
    expect(consoleTableStub.notCalled).to.be.true;
  });

  it('should list tenants in table format when tenants exist', async () => {
    const mockTenants = [
      {
        tenantId: 't1',
        tenantName: 'Tenant One',
        organizationId: 'org1',
        clientId: 'client1',
      },
      {
        tenantId: 't2',
        tenantName: 'Tenant Two',
        organizationId: 'org2',
        clientId: 'client2',
      },
    ];

    getAllTenantsStub = sinon.stub(tenantStore, 'getAllTenantsInfo').returns(mockTenants);

    await list.handler({} as any);

    expect(consoleInfoStub.calledWithMatch('Known tenants')).to.be.true;
    expect(consoleTableStub.calledOnce).to.be.true;

    const expectedTableData = mockTenants.map((t) => ({
      tenant_id: t.tenantId,
      tenant_name: t.tenantName,
      organization_id: t.organizationId,
      client_id: t.clientId,
    }));

    expect(consoleTableStub.firstCall.args[0]).to.deep.equal(expectedTableData);
  });
});
