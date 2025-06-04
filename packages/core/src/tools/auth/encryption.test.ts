import { expect } from 'chai';
import sinon from 'sinon';
import * as crypto from 'crypto';
import proxyquire from 'proxyquire';

const dummyKey = crypto.randomBytes(32).toString('base64');

const getPasswordStub = sinon.stub().resolves(dummyKey);
const setPasswordStub = sinon.stub().resolves();
const deletePasswordStub = sinon.stub().resolves(true);

const encryption = proxyquire('./encryption', {
  keytar: {
    getPassword: getPasswordStub,
    setPassword: setPasswordStub,
    deletePassword: deletePasswordStub,
  },
});

const tenantId = 'tenant-abc';
const account = `encryptionKey-${tenantId}`;
const SERVICE = 'sitecore-tools-cli';

describe('Encryption Utilities', () => {
  let consoleErrorStub: sinon.SinonStub;
  let consoleWarnStub: sinon.SinonStub;

  beforeEach(() => {
    consoleErrorStub = sinon.stub(console, 'error');
    consoleWarnStub = sinon.stub(console, 'warn');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getKey', () => {
    it('should return key from keytar if available', async () => {
      const key = await encryption.getKey(tenantId);
      expect(key).to.be.instanceOf(Buffer);
      expect(key.toString('base64')).to.equal(dummyKey);
      expect(getPasswordStub.calledOnceWithExactly(SERVICE, account)).to.be.true;
      expect(setPasswordStub.notCalled).to.be.true;
    });

    it('should generate and save new key if not present', async () => {
      getPasswordStub.resetHistory();
      getPasswordStub.resolves(null);

      const key = await encryption.getKey(tenantId);
      expect(key).to.be.instanceOf(Buffer);
      expect(key.length).to.equal(32);
      expect(setPasswordStub.calledOnceWithExactly(SERVICE, account, sinon.match.string)).to.be
        .true;
    });
  });

  describe('encryptData / decryptData', () => {
    it('encrypts and decrypts round-trip successfully', async () => {
      getPasswordStub.resetHistory();
      getPasswordStub.resolves(dummyKey);

      const plaintext = 'super-secret';
      const encrypted = await encryption.encryptData(plaintext, tenantId);
      const decrypted = await encryption.decryptData(encrypted, tenantId);

      expect(decrypted).to.equal(plaintext);
    });

    it('should throw on bad decryption input when cleanupOnFailure is false', async () => {
      const fakePayload = {
        iv: crypto.randomBytes(12).toString('base64'),
        authTag: crypto.randomBytes(16).toString('base64'),
        encryptedData: crypto.randomBytes(32).toString('base64'),
      };

      const tenantId = 'tenant-abc';

      try {
        await encryption.decryptData(fakePayload, tenantId, false);
        expect.fail('Expected decryption to throw');
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        if (err instanceof Error) {
          expect(err.message).to.include('unable to authenticate data');
        }
      }
    });
  });

  describe('deleteKey', () => {
    it('should delete encryption key', async () => {
      await encryption.deleteKey(tenantId);
      expect(deletePasswordStub.calledOnceWithExactly(SERVICE, account)).to.be.true;
    });
  });
});
