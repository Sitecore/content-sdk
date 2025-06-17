import { expect } from 'chai';
import sinon from 'sinon';
import { logout, unitMock } from './logout';

describe('logout command', () => {
  let getActiveTenantStub: sinon.SinonStub;
  let clearActiveTenantStub: sinon.SinonStub;
  let deleteTenantAuthInfoStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;
  let deleteKeyStub: sinon.SinonStub;

  beforeEach(() => {
    consoleLogStub = sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');
    clearActiveTenantStub = sinon.stub();
    deleteTenantAuthInfoStub = sinon.stub();
    deleteKeyStub = sinon.stub().resolves();
    unitMock({
      clearActiveTenant: clearActiveTenantStub,
      deleteTenantAuthInfo: deleteTenantAuthInfoStub,
      deleteKey: deleteKeyStub,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should show error if no active tenant is found', async () => {
    getActiveTenantStub = sinon.stub().returns(null);
    unitMock({ getActiveTenant: getActiveTenantStub });

    await logout.handler({} as any);

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.include('No active tenant found');
    expect(clearActiveTenantStub.notCalled).to.be.true;
    expect(deleteTenantAuthInfoStub.notCalled).to.be.true;
    expect(deleteKeyStub.notCalled).to.be.true;
  });

  it('should logout and clean up when active tenant exists', async () => {
    const mockTenantId = 'mock-tenant-id';
    getActiveTenantStub = sinon.stub().returns(mockTenantId);
    unitMock({ getActiveTenant: getActiveTenantStub });

    await logout.handler({} as any);

    expect(clearActiveTenantStub.calledOnce).to.be.true;
    expect(deleteTenantAuthInfoStub.calledWith(mockTenantId)).to.be.true;
    expect(deleteKeyStub.calledWith(mockTenantId)).to.be.true;
    expect(consoleLogStub.calledWithMatch(`Logged out from tenant ${mockTenantId}`)).to.be.true;
  });
});
