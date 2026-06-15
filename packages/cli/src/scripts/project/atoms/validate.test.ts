/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import * as utilsModule from './utils';
import * as loadConfigModule from '../../../utils/load-config';
import { handler } from './validate';

describe('atoms/validate handler', () => {
  let readLockFileStub: sinon.SinonStub;
  let loadCurrentAtomsStub: sinon.SinonStub;
  let loadCatalogStub: sinon.SinonStub;
  let loadCliConfigStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;

  // Default fixtures representing a perfectly valid state
  const defaultLock = {
    generated: '2024-01-01T00:00:00Z',
    atoms: {
      Button: { hash: 'hash-button', version: '1.0.0' },
    },
  };

  const defaultCurrentAtoms = {
    Button: { version: '1.0.0', schemaHash: 'hash-button' },
  };

  const defaultCatalog = { data: {} };

  const noBreakConfig = { atoms: { validation: { breakOnError: false } } };

  beforeEach(() => {
    readLockFileStub = sinon.stub(utilsModule, 'readLockFile');
    loadCurrentAtomsStub = sinon.stub(utilsModule, 'loadCurrentAtoms');
    loadCatalogStub = sinon.stub(utilsModule, 'loadCatalog');
    loadCliConfigStub = sinon.stub(loadConfigModule, 'default').returns(noBreakConfig as any);
    consoleLogStub = sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should pass config arg to loadCliConfig', async () => {
    readLockFileStub.returns(defaultLock);
    loadCurrentAtomsStub.resolves(defaultCurrentAtoms);
    loadCatalogStub.returns(defaultCatalog);

    await handler({ config: './custom-config.ts' });

    expect(loadCliConfigStub.calledOnceWith('./custom-config.ts')).to.be.true;
  });

  it('should log success when lock is valid', async () => {
    readLockFileStub.returns(defaultLock);
    loadCurrentAtomsStub.resolves(defaultCurrentAtoms);
    loadCatalogStub.returns(defaultCatalog);

    await handler({});

    expect(consoleLogStub.calledWith('[atoms validate] atoms.lock.json is up to date.')).to.be.true;
    expect(consoleErrorStub.notCalled).to.be.true;
  });

  describe('lock file missing', () => {
    it('should report issue when lock file is not found', async () => {
      readLockFileStub.returns(null);

      await handler({});

      expect(consoleErrorStub.calledWith('[atoms validate] Lock file validation failed:')).to.be
        .true;
      const errorArgs = consoleErrorStub.getCalls().map((c) => String(c.args[0]));
      expect(errorArgs.some((msg) => msg.includes('Lock file not found'))).to.be.true;
    });
  });

  describe('catalog version validation', () => {
    it('should report version mismatch when lock and catalog versions differ', async () => {
      readLockFileStub.returns({ ...defaultLock, version: '1.0.0', atoms: {} });
      loadCurrentAtomsStub.resolves({});
      loadCatalogStub.returns({ data: { version: '2.0.0' } });

      await handler({});

      const errorArgs = consoleErrorStub.getCalls().map((c) => String(c.args[0]));
      expect(errorArgs.some((msg) => msg.includes('Catalog version mismatch'))).to.be.true;
    });

    it('should report mismatch when lock has version but catalog does not', async () => {
      readLockFileStub.returns({ ...defaultLock, version: '1.0.0', atoms: {} });
      loadCurrentAtomsStub.resolves({});
      loadCatalogStub.returns({ data: {} });

      await handler({});

      const errorArgs = consoleErrorStub.getCalls().map((c) => String(c.args[0]));
      expect(errorArgs.some((msg) => msg.includes('Catalog version mismatch'))).to.be.true;
    });

    it('should report mismatch when catalog has version but lock does not', async () => {
      readLockFileStub.returns({ generated: '2024-01-01T00:00:00Z', atoms: {} });
      loadCurrentAtomsStub.resolves({});
      loadCatalogStub.returns({ data: { version: '1.0.0' } });

      await handler({});

      const errorArgs = consoleErrorStub.getCalls().map((c) => String(c.args[0]));
      expect(errorArgs.some((msg) => msg.includes('Catalog version mismatch'))).to.be.true;
    });

    it('should not report version issue when neither lock nor catalog declare a version', async () => {
      readLockFileStub.returns({ generated: '2024-01-01T00:00:00Z', atoms: {} });
      loadCurrentAtomsStub.resolves({});
      loadCatalogStub.returns({ data: {} });

      await handler({});

      expect(consoleLogStub.calledWith('[atoms validate] atoms.lock.json is up to date.')).to.be
        .true;
    });

    it('should not report version issue when catalog.data is undefined', async () => {
      readLockFileStub.returns({ generated: '2024-01-01T00:00:00Z', atoms: {} });
      loadCurrentAtomsStub.resolves({});
      loadCatalogStub.returns({});

      await handler({});

      expect(consoleLogStub.calledWith('[atoms validate] atoms.lock.json is up to date.')).to.be
        .true;
    });

    it('should not report issue when catalog versions match', async () => {
      readLockFileStub.returns({ ...defaultLock, version: '1.0.0', atoms: {} });
      loadCurrentAtomsStub.resolves({});
      loadCatalogStub.returns({ data: { version: '1.0.0' } });

      await handler({});

      expect(consoleLogStub.calledWith('[atoms validate] atoms.lock.json is up to date.')).to.be
        .true;
    });
  });

  describe('atom-level validation', () => {
    it('should report issue when atom in lock is missing from current definitions', async () => {
      readLockFileStub.returns(defaultLock);
      loadCurrentAtomsStub.resolves({});
      loadCatalogStub.returns(defaultCatalog);

      await handler({});

      const errorArgs = consoleErrorStub.getCalls().map((c) => String(c.args[0]));
      expect(errorArgs.some((msg) => msg.includes('"Button" is in the lock file but not found'))).to
        .be.true;
    });

    it('should report issue when atom version in lock differs from current', async () => {
      readLockFileStub.returns(defaultLock);
      loadCurrentAtomsStub.resolves({
        Button: { version: '2.0.0', schemaHash: 'hash-button' },
      });
      loadCatalogStub.returns(defaultCatalog);

      await handler({});

      const errorArgs = consoleErrorStub.getCalls().map((c) => String(c.args[0]));
      expect(errorArgs.some((msg) => msg.includes('"Button" version mismatch'))).to.be.true;
    });

    it('should report issue when lock has atom version but current atom does not', async () => {
      readLockFileStub.returns(defaultLock);
      loadCurrentAtomsStub.resolves({
        Button: { version: undefined, schemaHash: 'hash-button' },
      });
      loadCatalogStub.returns(defaultCatalog);

      await handler({});

      const errorArgs = consoleErrorStub.getCalls().map((c) => String(c.args[0]));
      expect(errorArgs.some((msg) => msg.includes('"Button" version mismatch'))).to.be.true;
    });

    it('should report issue when current atom has version but lock does not', async () => {
      readLockFileStub.returns({
        generated: '2024-01-01T00:00:00Z',
        atoms: { Button: { hash: 'hash-button' } },
      });
      loadCurrentAtomsStub.resolves({
        Button: { version: '1.0.0', schemaHash: 'hash-button' },
      });
      loadCatalogStub.returns(defaultCatalog);

      await handler({});

      const errorArgs = consoleErrorStub.getCalls().map((c) => String(c.args[0]));
      expect(errorArgs.some((msg) => msg.includes('"Button" version mismatch'))).to.be.true;
    });

    it('should not report version issue when neither lock nor current atom declare a version', async () => {
      readLockFileStub.returns({
        generated: '2024-01-01T00:00:00Z',
        atoms: { Button: { hash: 'hash-button' } },
      });
      loadCurrentAtomsStub.resolves({
        Button: { version: undefined, schemaHash: 'hash-button' },
      });
      loadCatalogStub.returns(defaultCatalog);

      await handler({});

      expect(consoleLogStub.calledWith('[atoms validate] atoms.lock.json is up to date.')).to.be
        .true;
    });

    it('should report issue when atom schema hash has changed', async () => {
      readLockFileStub.returns(defaultLock);
      loadCurrentAtomsStub.resolves({
        Button: { version: '1.0.0', schemaHash: 'new-hash-button' },
      });
      loadCatalogStub.returns(defaultCatalog);

      await handler({});

      const errorArgs = consoleErrorStub.getCalls().map((c) => String(c.args[0]));
      expect(errorArgs.some((msg) => msg.includes('"Button" schema has changed'))).to.be.true;
    });

    it('should report issue when current has a new atom not present in lock', async () => {
      readLockFileStub.returns({ generated: '2024-01-01T00:00:00Z', atoms: {} });
      loadCurrentAtomsStub.resolves({
        NewAtom: { version: '1.0.0', schemaHash: 'hash-new' },
      });
      loadCatalogStub.returns(defaultCatalog);

      await handler({});

      const errorArgs = consoleErrorStub.getCalls().map((c) => String(c.args[0]));
      expect(errorArgs.some((msg) => msg.includes('"NewAtom" is new and not in the lock file'))).to
        .be.true;
    });

    it('should accumulate multiple issues across atoms', async () => {
      readLockFileStub.returns({
        generated: '2024-01-01T00:00:00Z',
        atoms: {
          Button: { hash: 'hash-button', version: '1.0.0' },
          Card: { hash: 'hash-card' },
        },
      });
      loadCurrentAtomsStub.resolves({
        Button: { version: '2.0.0', schemaHash: 'hash-button' },
        NewAtom: { version: undefined, schemaHash: 'hash-new' },
      });
      loadCatalogStub.returns(defaultCatalog);

      await handler({});

      const errorArgs = consoleErrorStub.getCalls().map((c) => String(c.args[0]));
      expect(errorArgs.some((msg) => msg.includes('"Button" version mismatch'))).to.be.true;
      expect(errorArgs.some((msg) => msg.includes('"Card" is in the lock file but not found'))).to
        .be.true;
      expect(errorArgs.some((msg) => msg.includes('"NewAtom" is new and not in the lock file'))).to
        .be.true;
    });
  });

  describe('breakOnError behavior', () => {
    it('should throw when breakOnError is true and validation fails', async () => {
      loadCliConfigStub.returns({ atoms: { validation: { breakOnError: true } } } as any);
      readLockFileStub.returns(null);

      try {
        await handler({});
        expect.fail('expected to throw');
      } catch (err: any) {
        expect(err.message).to.include('Atom validation failed');
      }
    });

    it('should not throw when breakOnError is false and validation fails', async () => {
      loadCliConfigStub.returns({ atoms: { validation: { breakOnError: false } } } as any);
      readLockFileStub.returns(null);

      await handler({});
      expect(consoleErrorStub.called).to.be.true;
    });

    it('should default breakOnError to false when atoms config is absent', async () => {
      loadCliConfigStub.returns({} as any);
      readLockFileStub.returns(null);

      await handler({});
      expect(consoleErrorStub.called).to.be.true;
    });

    it('should log all individual issues before throwing', async () => {
      loadCliConfigStub.returns({ atoms: { validation: { breakOnError: true } } } as any);
      readLockFileStub.returns(defaultLock);
      loadCurrentAtomsStub.resolves({
        Button: { version: '2.0.0', schemaHash: 'different-hash' },
      });
      loadCatalogStub.returns(defaultCatalog);

      try {
        await handler({});
      } catch {
        // expected
      }

      // Both the header and individual issues should be logged before the throw
      expect(consoleErrorStub.calledWith('[atoms validate] Lock file validation failed:')).to.be
        .true;
      const errorArgs = consoleErrorStub.getCalls().map((c) => String(c.args[0]));
      expect(errorArgs.length).to.be.greaterThan(1);
    });
  });
});

