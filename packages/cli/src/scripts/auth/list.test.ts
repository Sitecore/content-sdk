﻿import { expect } from 'chai';
import sinon from 'sinon';
import { list } from './list';
import * as tenantStore from '../../../src/utils/auth/tenant-store';

describe('list command', () => {
  let getAllTenantsStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let logs: string[];

  beforeEach(() => {
    logs = [];
    consoleLogStub = sinon.stub(console, 'log').callsFake((msg) => {
      logs.push(String(msg));
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should log message if no tenants are found', async () => {
    getAllTenantsStub = sinon.stub(tenantStore, 'getAllTenantsInfo').returns([]);

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

    getAllTenantsStub = sinon.stub(tenantStore, 'getAllTenantsInfo').returns(mockTenants);

    await list.handler({} as any);

    const expectedLogs = [
      '\n Known tenants:\n',
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
