import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { getActiveTenant, setActiveTenant, clearActiveTenant } from './tenant-state';

describe('Tenant-State Utils', () => {
  const settingsFile = path.join(os.homedir(), '.sitecore', 'sitecore-tools', 'settings.json');

  let existsStub: sinon.SinonStub;
  let readStub: sinon.SinonStub;
  let writeStub: sinon.SinonStub;
  let unlinkStub: sinon.SinonStub;
  let mkdirStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;

  beforeEach(() => {
    existsStub = sinon.stub(fs, 'existsSync');
    readStub = sinon.stub(fs, 'readFileSync');
    writeStub = sinon.stub(fs, 'writeFileSync');
    unlinkStub = sinon.stub(fs, 'unlinkSync');
    mkdirStub = sinon.stub(fs, 'mkdirSync');
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getActiveTenant()', () => {
    it('should return null if settings file does not exist', () => {
      existsStub.withArgs(settingsFile).returns(false);

      const result = getActiveTenant();
      expect(result).to.be.null;
    });

    it('should return activeTenant if settings file is valid', () => {
      existsStub.withArgs(settingsFile).returns(true);
      readStub.returns(JSON.stringify({ activeTenant: 'tenant-abc' }));

      const result = getActiveTenant();
      expect(result).to.equal('tenant-abc');
    });

    it('should return null and log error if file read fails', () => {
      existsStub.withArgs(settingsFile).returns(true);
      readStub.throws(new Error('Read failed'));

      const result = getActiveTenant();
      expect(result).to.be.null;
      expect(consoleErrorStub.calledWithMatch(/Failed to read active tenant/)).to.be.true;
    });
  });

  describe('setActiveTenant()', () => {
    it('should create directory and write settings file', () => {
      existsStub.withArgs(path.dirname(settingsFile)).returns(false);

      setActiveTenant('tenant-xyz');

      expect(mkdirStub.calledOnce).to.be.true;
      expect(writeStub.calledWithMatch(settingsFile, sinon.match.string)).to.be.true;
    });

    it('should log error if writing file fails', () => {
      existsStub.returns(true);
      writeStub.throws(new Error('Write failed'));

      setActiveTenant('tenant-xyz');

      expect(consoleErrorStub.calledWithMatch(/Failed to set active tenant/)).to.be.true;
    });
  });

  describe('clearActiveTenant()', () => {
    it('should delete settings file if it exists', () => {
      existsStub.withArgs(settingsFile).returns(true);

      clearActiveTenant();
      expect(unlinkStub.calledWith(settingsFile)).to.be.true;
    });

    it('should not throw if settings file does not exist', () => {
      existsStub.withArgs(settingsFile).returns(false);

      expect(() => clearActiveTenant()).to.not.throw();
      expect(unlinkStub.notCalled).to.be.true;
    });

    it('should log error if file deletion fails', () => {
      existsStub.withArgs(settingsFile).returns(true);
      unlinkStub.throws(new Error('Delete failed'));

      clearActiveTenant();
      expect(consoleErrorStub.calledWithMatch(/Failed to clear active tenant/)).to.be.true;
    });
  });
});
