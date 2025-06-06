import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  writeTenantAuthInfo,
  readTenantAuthInfo,
  writeTenantInfo,
  readTenantInfo,
  deleteTenantAuthInfo,
  getAllTenantsInfo,
  decodeJwtPayload,
} from './tenant-store';

describe('tenant-store utils', () => {
  const tenantId = 'tenant-abc';
  const tenantDir = path.join(os.homedir(), '.sitecore', 'sitecore-tools', tenantId);
  const authPath = path.join(tenantDir, 'auth.json');
  const infoPath = path.join(tenantDir, 'info.json');

  let writeFileStub: sinon.SinonStub;
  let readFileStub: sinon.SinonStub;
  let existsStub: sinon.SinonStub;
  let unlinkStub: sinon.SinonStub;
  let readdirStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;
  let statStub: sinon.SinonStub;

  beforeEach(() => {
    writeFileStub = sinon.stub(fs, 'writeFileSync');
    readFileStub = sinon.stub(fs, 'readFileSync');
    existsStub = sinon.stub(fs, 'existsSync');
    unlinkStub = sinon.stub(fs, 'unlinkSync');
    readdirStub = sinon.stub(fs, 'readdirSync');
    statStub = sinon.stub(fs, 'statSync');
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('writeTenantInfo', () => {
    it('should write info.json file', async () => {
      await writeTenantInfo({
        tenantId,
        tenantName: 'T1',
        organizationId: 'O1',
        clientId: 'C1',
      });

      expect(writeFileStub.calledWith(infoPath)).to.be.true;
    });

    it('should log error if writing info.json fails', async () => {
      writeFileStub.throws(new Error('Write failed'));

      await writeTenantInfo({
        tenantId,
        tenantName: 'T1',
        organizationId: 'O1',
        clientId: 'C1',
      });

      expect(consoleErrorStub.calledOnce).to.be.true;
      expect(consoleErrorStub.firstCall.args[0]).to.include('Failed to write info.json');
    });
  });

  describe('readTenantInfo', () => {
    it('should return parsed tenant info if file exists', async () => {
      existsStub.withArgs(infoPath).returns(true);
      readFileStub.withArgs(infoPath).returns(
        JSON.stringify({
          tenantId,
          tenantName: 'T1',
          organizationId: 'O1',
          clientId: 'C1',
        })
      );

      const result = await readTenantInfo(tenantId);
      expect(result?.tenantName).to.equal('T1');
    });

    it('should return null if file does not exist', async () => {
      existsStub.withArgs(infoPath).returns(false);
      const result = await readTenantInfo(tenantId);
      expect(result).to.be.null;
    });

    it('should log error if file read fails', async () => {
      existsStub.withArgs(infoPath).returns(true);
      readFileStub.throws(new Error('read failed'));

      const result = await readTenantInfo(tenantId);
      expect(result).to.be.null;
      expect(consoleErrorStub.called).to.be.true;
    });
  });

  describe('deleteTenantAuthInfo', () => {
    it('should delete auth.json if exists', async () => {
      existsStub.withArgs(authPath).returns(true);
      await deleteTenantAuthInfo(tenantId);
      expect(unlinkStub.calledWith(authPath)).to.be.true;
    });

    it('should skip deletion if file does not exist', async () => {
      existsStub.withArgs(authPath).returns(false);
      await deleteTenantAuthInfo(tenantId);
      expect(unlinkStub.called).to.be.false;
    });

    it('should log error on deletion failure', async () => {
      existsStub.withArgs(authPath).returns(true);
      unlinkStub.throws(new Error('unlink fail'));

      await deleteTenantAuthInfo(tenantId);
      expect(consoleErrorStub.called).to.be.true;
    });
  });

  describe('getAllTenantsInfo', () => {
    const basePath = path.join(os.homedir(), '.sitecore', 'sitecore-tools');

    it('should return empty array if rootDir does not exist', () => {
      existsStub.withArgs(basePath).returns(false);

      const tenants = getAllTenantsInfo();
      expect(tenants).to.deep.equal([]);
    });

    it('should return valid tenants from info.json files', () => {
      existsStub.withArgs(basePath).returns(true);
      readdirStub.returns(['tenant-1']);
      statStub.returns({ isDirectory: () => true });

      const fullInfoPath = path.join(basePath, 'tenant-1', 'info.json');
      existsStub.withArgs(fullInfoPath).returns(true);
      readFileStub.withArgs(fullInfoPath).returns(
        JSON.stringify({
          tenantId: 'tenant-1',
          tenantName: 'Name1',
          organizationId: 'org1',
          clientId: 'cid1',
        })
      );

      const tenants = getAllTenantsInfo();
      expect(tenants).to.have.length(1);
      expect(tenants[0].tenantName).to.equal('Name1');
    });
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

describe('Tenant store: writeTenantAuthInfo', () => {
  const tenantId = 'test-tenant-1234';
  const tenantDir = path.join(os.homedir(), '.sitecore', 'sitecore-tools', tenantId);
  const authPath = path.join(tenantDir, 'auth.json');

  const fakeAuth = {
    access_token: 'token',
    expires_in: 1234,
    expires_at: '2025-12-31T23:59:59Z',
  };

  afterEach(() => {
    if (fs.existsSync(authPath)) fs.unlinkSync(authPath);
    if (fs.existsSync(tenantDir)) fs.rmdirSync(tenantDir, { recursive: true });
  });

  it('should write a valid encrypted auth.json file', async () => {
    await writeTenantAuthInfo(tenantId, fakeAuth);
    expect(fs.existsSync(authPath)).to.be.true;

    const raw = fs.readFileSync(authPath, 'utf-8');
    const parsed = JSON.parse(raw);
    expect(parsed).to.have.all.keys(['iv', 'authTag', 'encryptedData']);
  });

  it('should write and read back parsed auth info correctly', async () => {
    await writeTenantAuthInfo(tenantId, fakeAuth);
    const result = await readTenantAuthInfo(tenantId);
    expect(result).to.deep.equal(fakeAuth);
  });
});

describe('Tenant store: readTenantAuthInfo', () => {
  const tenantId = 'test-tenant-1234';
  const tenantDir = path.join(os.homedir(), '.sitecore', 'sitecore-tools', tenantId);
  const authPath = path.join(tenantDir, 'auth.json');

  const fakeAuth = {
    access_token: 'token',
    expires_in: 1234,
    expires_at: '2025-12-31T23:59:59Z',
  };

  afterEach(() => {
    if (fs.existsSync(authPath)) fs.unlinkSync(authPath);
    if (fs.existsSync(tenantDir)) fs.rmdirSync(tenantDir, { recursive: true });
  });

  it('should write and read back parsed auth info correctly', async () => {
    await writeTenantAuthInfo(tenantId, fakeAuth);

    const result = await readTenantAuthInfo(tenantId);
    expect(result).to.deep.equal(fakeAuth);
  });
});
