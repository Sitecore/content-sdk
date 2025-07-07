import { expect } from 'chai';
import sinon from 'sinon';
import { decodeJwtPayload } from './tenant-store';

describe('tenant-store utilities', () => {
  let consoleErrorStub: sinon.SinonStub;

  beforeEach(() => {
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('decodeJwtPayload', () => {
    it('should decode and return claims from token', () => {
      const payload = {
        'https://auth.sitecorecloud.io/claims/tenant_id': 'tid',
        'https://auth.sitecorecloud.io/claims/org_id': 'oid',
        'https://auth.sitecorecloud.io/claims/tenant_name': 'tname',
      };

      const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');
      const token = `abc.${base64}.xyz`;

      const result = decodeJwtPayload(token);
      expect(result?.tokenTenantId).to.equal('tid');
      expect(result?.tokenOrgId).to.equal('oid');
      expect(result?.tokenTenantName).to.equal('tname');
    });

    it('should return null and log if decoding fails', () => {
      const token = 'invalid.token.string';
      const result = decodeJwtPayload(token);
      expect(result).to.be.null;
      expect(consoleErrorStub.called).to.be.true;
    });
  });
});
