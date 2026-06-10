/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import * as utilsModule from './utils';
import { handler } from './update';

describe('atoms/update handler', () => {
  let loadCurrentAtomsStub: sinon.SinonStub;
  let loadCatalogStub: sinon.SinonStub;
  let writeLockFileStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;

  beforeEach(() => {
    loadCurrentAtomsStub = sinon.stub(utilsModule, 'loadCurrentAtoms');
    loadCatalogStub = sinon.stub(utilsModule, 'loadCatalog');
    writeLockFileStub = sinon.stub(utilsModule, 'writeLockFile');
    consoleLogStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should call loadCurrentAtoms and loadCatalog', async () => {
    loadCurrentAtomsStub.resolves({});
    loadCatalogStub.returns({ data: {} });

    await handler();

    expect(loadCurrentAtomsStub.calledOnce).to.be.true;
    expect(loadCatalogStub.calledOnce).to.be.true;
  });

  it('should write lock file with correct atom entries', async () => {
    loadCurrentAtomsStub.resolves({
      Button: { version: '1.0.0', schemaHash: 'abc123' },
    });
    loadCatalogStub.returns({ data: {} });

    await handler();

    expect(writeLockFileStub.calledOnce).to.be.true;
    const lock = writeLockFileStub.firstCall.args[0];
    expect(lock.atoms.Button).to.deep.equal({ version: '1.0.0', hash: 'abc123' });
  });

  it('should include catalog version in lock when catalog declares one', async () => {
    loadCurrentAtomsStub.resolves({});
    loadCatalogStub.returns({ data: { version: '2.0.0' } });

    await handler();

    const lock = writeLockFileStub.firstCall.args[0];
    expect(lock.version).to.equal('2.0.0');
  });

  it('should not include version in lock when catalog has no version', async () => {
    loadCurrentAtomsStub.resolves({});
    loadCatalogStub.returns({ data: {} });

    await handler();

    const lock = writeLockFileStub.firstCall.args[0];
    expect(lock.version).to.be.undefined;
  });

  it('should not include version in lock when catalog.data is undefined', async () => {
    loadCurrentAtomsStub.resolves({});
    loadCatalogStub.returns({});

    await handler();

    const lock = writeLockFileStub.firstCall.args[0];
    expect(lock.version).to.be.undefined;
  });

  it('should omit atom version entry when atom has no version', async () => {
    loadCurrentAtomsStub.resolves({
      Card: { version: undefined, schemaHash: 'def456' },
    });
    loadCatalogStub.returns({ data: {} });

    await handler();

    const lock = writeLockFileStub.firstCall.args[0];
    expect(lock.atoms.Card).to.deep.equal({ hash: 'def456' });
    expect(lock.atoms.Card.version).to.be.undefined;
  });

  it('should omit atom version entry when atom version is empty string', async () => {
    loadCurrentAtomsStub.resolves({
      Card: { version: '', schemaHash: 'def456' },
    });
    loadCatalogStub.returns({ data: {} });

    await handler();

    const lock = writeLockFileStub.firstCall.args[0];
    expect(lock.atoms.Card.version).to.be.undefined;
  });

  it('should set generated to a valid ISO timestamp', async () => {
    loadCurrentAtomsStub.resolves({});
    loadCatalogStub.returns({ data: {} });

    await handler();

    const lock = writeLockFileStub.firstCall.args[0];
    expect(lock.generated).to.be.a('string');
    expect(new Date(lock.generated).toISOString()).to.equal(lock.generated);
  });

  it('should write a lock with multiple atoms', async () => {
    loadCurrentAtomsStub.resolves({
      Button: { version: '1.0.0', schemaHash: 'hash1' },
      Card: { version: undefined, schemaHash: 'hash2' },
      Banner: { version: '0.5.0', schemaHash: 'hash3' },
    });
    loadCatalogStub.returns({ data: { version: '3.0.0' } });

    await handler();

    const lock = writeLockFileStub.firstCall.args[0];
    expect(Object.keys(lock.atoms)).to.have.length(3);
    expect(lock.atoms.Button).to.deep.equal({ version: '1.0.0', hash: 'hash1' });
    expect(lock.atoms.Card).to.deep.equal({ hash: 'hash2' });
    expect(lock.atoms.Banner).to.deep.equal({ version: '0.5.0', hash: 'hash3' });
    expect(lock.version).to.equal('3.0.0');
  });

  it('should log success message after writing', async () => {
    loadCurrentAtomsStub.resolves({});
    loadCatalogStub.returns({ data: {} });

    await handler();

    expect(consoleLogStub.calledWith('[atoms update] Lock file updated successfully.')).to.be.true;
  });
});

