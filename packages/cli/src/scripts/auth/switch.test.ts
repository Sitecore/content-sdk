import { expect } from 'chai';
import sinon from 'sinon';
import { switchTenant, unitMock } from './switch';

describe('switch tenant command', () => {
  let sandbox: sinon.SinonSandbox;
  let readTenantAuthInfoStub: sinon.SinonStub;
  let setActiveTenantStub: sinon.SinonStub;
  let validateAndRenewAuthIfExpiredStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;

  const tenantId = 'old-tenant';
  const otherTenantId = 'new-tenant';
  const currentContext = { tenantId };
  const newTenantInfo = { tenantId: otherTenantId };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    readTenantAuthInfoStub = sandbox.stub().resolves(newTenantInfo);
    setActiveTenantStub = sandbox.stub();
    validateAndRenewAuthIfExpiredStub = sandbox.stub();
    consoleLogStub = sandbox.stub(console, 'log');
    consoleErrorStub = sandbox.stub(console, 'error');
    unitMock({
      readTenantAuthInfo: readTenantAuthInfoStub,
      setActiveTenant: setActiveTenantStub,
      validateAndRenewAuthIfExpired: validateAndRenewAuthIfExpiredStub,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should switch to new tenant when tenant info found', async () => {
    validateAndRenewAuthIfExpiredStub.onFirstCall().resolves(currentContext);
    validateAndRenewAuthIfExpiredStub.onSecondCall().returns({ tenantId: otherTenantId });

    await switchTenant.handler({ tenantId: otherTenantId } as any);

    expect(readTenantAuthInfoStub.calledWith(otherTenantId)).to.be.true;
    expect(setActiveTenantStub.calledWith(otherTenantId)).to.be.true;
    expect(consoleLogStub.calledWith(`Switched to tenant: ${otherTenantId}`)).to.be.true;
  });

  it('should log error and abort if renewing current login fails', async () => {
    validateAndRenewAuthIfExpiredStub.resolves(null);

    await switchTenant.handler({ tenantId: otherTenantId } as any);

    expect(consoleErrorStub.calledWith('\nNo valid authentication found. Please login.')).to.be
      .true;
    expect(setActiveTenantStub.notCalled).to.be.true;
  });

  it('should log error and abort if already in specified tenant', async () => {
    validateAndRenewAuthIfExpiredStub.resolves({ tenantId: otherTenantId });

    await switchTenant.handler({ tenantId: otherTenantId } as any);

    expect(consoleLogStub.calledWith(`Already in tenant: ${otherTenantId}`)).to.be.true;
    expect(setActiveTenantStub.notCalled).to.be.true;
  });

  it('should log error and abort if tenant info is not found for provided tenantId', async () => {
    validateAndRenewAuthIfExpiredStub.resolves(currentContext);
    readTenantAuthInfoStub.resolves(undefined);

    await switchTenant.handler({ tenantId: otherTenantId } as any);

    expect(
      consoleErrorStub.calledWith(
        `Tenant info for ID '${otherTenantId}' not found in local storage.`
      )
    ).to.be.true;
    expect(consoleErrorStub.calledWithMatch(/Please ensure you have logged into the tenant/)).to.be
      .true;
    expect(setActiveTenantStub.notCalled).to.be.true;
  });

  it('should log error, stay in current tenant and abort if logging into new tenant fails', async () => {
    validateAndRenewAuthIfExpiredStub.onFirstCall().resolves(currentContext);
    validateAndRenewAuthIfExpiredStub.onSecondCall().returns(null);
    readTenantAuthInfoStub.resolves(newTenantInfo);

    await switchTenant.handler({ tenantId: otherTenantId } as any);

    expect(setActiveTenantStub.calledWith(otherTenantId)).to.be.true;
    expect(
      consoleErrorStub.calledWith(
        `Failed to switch to tenant '${otherTenantId}', remaining in tenant '${tenantId}'.`
      )
    ).to.be.true;
    expect(setActiveTenantStub.calledWith(tenantId)).to.be.true;
  });
});
