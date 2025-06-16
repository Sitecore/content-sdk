import { expect } from 'chai';
import sinon from 'sinon';
import { list, unitMock } from './list';

describe('list command', () => {
  let getAllTenantsStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let logs: string[];
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    logs = [];
    consoleLogStub = sandbox.stub(console, 'log').callsFake((msg) => {
      logs.push(String(msg));
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should log message if no tenants are found', async () => {
    getAllTenantsStub = sandbox.stub().returns([]);
    unitMock({ getAllTenantsInfo: getAllTenantsStub });
    await list.handler({} as any);

    expect(consoleLogStub.calledOnce).to.be.true;
    expect(logs[0]).to.include('No tenant information found');
  });

  it('should log all tenant properties line by line', async () => {
    const mockTenants = [
      {
        tenantId: 't1',
        tenantName: 'Tenant One',
        organizationId: 'org1',
        clientId: 'client1',
        authority: 'auth1',
        audience: 'aud1',
        baseUrl: 'base1',
      },
    ];

    getAllTenantsStub = sandbox.stub().returns(mockTenants);
    unitMock({ getAllTenantsInfo: getAllTenantsStub });

    await list.handler({} as any);

    const expectedLogs = [
      '\nKnown tenants:\n',
      'Tenant 1:',
      '  Tenant ID       : t1',
      '  Tenant Name     : Tenant One',
      '  Organization ID : org1',
      '  Client ID       : client1',
      '  Authority       : auth1',
      '  Audience        : aud1',
      '  Base URL        : base1',
    ];

    expectedLogs.forEach((expectedLine) => {
      expect(logs).to.include(expectedLine);
    });
  });
});
