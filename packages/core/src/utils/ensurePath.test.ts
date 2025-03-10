import { ensurePathExists } from './ensurePath';
import fs from 'fs';
import sinon from 'sinon';
import path from 'path';
import { expect } from 'chai';

describe('ensurePathExists', () => {
  let mkdirSyncStub: sinon.SinonStub;
  let existsSyncStub: sinon.SinonStub;

  beforeEach(() => {
    mkdirSyncStub = sinon.stub(fs, 'mkdirSync');
  });

  afterEach(() => {
    mkdirSyncStub.restore();
    existsSyncStub.restore();
  });

  it('should create directory if it does not exist', () => {
    const filePath = 'path/to/file.txt';
    existsSyncStub = sinon.stub(fs, 'existsSync').returns(false);

    ensurePathExists(filePath);
    expect(mkdirSyncStub.calledWith(path.dirname(filePath), { recursive: true })).to.be.true;
  });

  it('should not create directory if it exists', () => {
    const filePath = 'path/to/file.txt';
    existsSyncStub = sinon.stub(fs, 'existsSync').returns(true);

    ensurePathExists(filePath);
    expect(mkdirSyncStub.calledWith(path.dirname(filePath), { recursive: true })).to.be.false;
  });
});
