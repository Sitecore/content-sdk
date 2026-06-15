/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import proxyquire from 'proxyquire';
import * as ensureDirModule from '../../../utils/ensure-sitecore-directory';
import {
  getLockFilePath,
  hashSchema,
  readLockFile,
  writeLockFile,
  resolveAtomsModulePath,
} from './utils';

describe('atoms/utils', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('getLockFilePath', () => {
    it('should return a path combining cwd, lock dir and lock file name', () => {
      sinon.stub(process, 'cwd').returns('/project');
      const result = getLockFilePath();
      expect(result).to.equal(path.resolve('/project', '.sitecore', 'atoms.lock.json'));
    });
  });

  describe('hashSchema', () => {
    it('should return a sha256 hex string for a given object', () => {
      const result = hashSchema({ foo: 'bar' });
      const expected = crypto.createHash('sha256').update('{"foo":"bar"}').digest('hex');
      expect(result).to.equal(expected);
    });

    it('should produce the same hash for identical inputs', () => {
      expect(hashSchema({ x: 1, y: 2 })).to.equal(hashSchema({ x: 1, y: 2 }));
    });

    it('should produce different hashes for different inputs', () => {
      expect(hashSchema({ x: 1 })).to.not.equal(hashSchema({ x: 2 }));
    });

    it('should handle nested objects', () => {
      const result = hashSchema({ props: { title: 'string' } });
      expect(result).to.be.a('string').with.length(64);
    });
  });

  describe('readLockFile', () => {
    let ensureDirStub: sinon.SinonStub;

    beforeEach(() => {
      ensureDirStub = sinon.stub(ensureDirModule, 'ensureSitecoreDirectory');
    });

    it('should call ensureSitecoreDirectory', () => {
      sinon.stub(fs, 'existsSync').returns(false);
      readLockFile();
      expect(ensureDirStub.calledOnce).to.be.true;
    });

    it('should return null when the lock file does not exist', () => {
      sinon.stub(fs, 'existsSync').returns(false);
      const result = readLockFile();
      expect(result).to.be.null;
    });

    it('should return parsed lock file content when it exists', () => {
      const lockData = { version: '1.0.0', generated: '2024-01-01T00:00:00Z', atoms: {} };
      sinon.stub(fs, 'existsSync').returns(true);
      sinon.stub(fs, 'readFileSync').returns(JSON.stringify(lockData));
      const result = readLockFile();
      expect(result).to.deep.equal(lockData);
    });
  });

  describe('writeLockFile', () => {
    it('should create directory when it does not exist and write the file', () => {
      const lockData = { generated: '2024-01-01T00:00:00Z', atoms: {} };
      sinon.stub(fs, 'existsSync').returns(false);
      const mkdirStub = sinon.stub(fs, 'mkdirSync');
      const writeStub = sinon.stub(fs, 'writeFileSync');

      writeLockFile(lockData as any);

      expect(mkdirStub.calledOnce).to.be.true;
      expect(writeStub.calledOnce).to.be.true;
      const [, content] = writeStub.firstCall.args;
      expect(content).to.include('"atoms"');
      expect(content).to.include('"generated"');
    });

    it('should not create directory when it already exists', () => {
      const lockData = { generated: '2024-01-01T00:00:00Z', atoms: {} };
      sinon.stub(fs, 'existsSync').returns(true);
      const mkdirStub = sinon.stub(fs, 'mkdirSync');
      sinon.stub(fs, 'writeFileSync');

      writeLockFile(lockData as any);

      expect(mkdirStub.notCalled).to.be.true;
    });

    it('should write JSON followed by a newline', () => {
      const lockData = { generated: '2024-01-01T00:00:00Z', atoms: {} };
      sinon.stub(fs, 'existsSync').returns(true);
      const writeStub = sinon.stub(fs, 'writeFileSync');

      writeLockFile(lockData as any);

      const [, content] = writeStub.firstCall.args;
      expect((content as string).endsWith('\n')).to.be.true;
    });
  });

  describe('resolveAtomsModulePath', () => {
    it('should return the .ts path when it exists', () => {
      sinon.stub(fs, 'existsSync').callsFake((p: any) => String(p).endsWith('.ts'));
      const result = resolveAtomsModulePath();
      expect(result).to.not.be.null;
      expect(result).to.match(/\.ts$/);
    });

    it('should return the .tsx path when .ts does not exist but .tsx does', () => {
      sinon.stub(fs, 'existsSync').callsFake((p: any) => String(p).endsWith('.tsx'));
      const result = resolveAtomsModulePath();
      expect(result).to.not.be.null;
      expect(result).to.match(/\.tsx$/);
    });

    it('should return null when neither .ts nor .tsx exists', () => {
      sinon.stub(fs, 'existsSync').returns(false);
      const result = resolveAtomsModulePath();
      expect(result).to.be.null;
    });

    it('should prefer .ts over .tsx', () => {
      sinon.stub(fs, 'existsSync').returns(true);
      const result = resolveAtomsModulePath();
      expect(result).to.match(/\.ts$/);
      expect(result).to.not.match(/\.tsx$/);
    });
  });

  describe('loadCatalog', () => {
    let fsExistsSyncStub: sinon.SinonStub;
    let tsxRequireStub: sinon.SinonStub;
    let utilsProxied: any;

    beforeEach(() => {
      fsExistsSyncStub = sinon.stub(fs, 'existsSync');
      tsxRequireStub = sinon.stub();
      utilsProxied = proxyquire('./utils', {
        'tsx/cjs/api': { require: tsxRequireStub },
      });
    });

    it('should throw when atoms module is not found', () => {
      fsExistsSyncStub.returns(false);
      expect(() => utilsProxied.loadCatalog()).to.throw('Atoms module not found');
    });

    it('should throw when module does not export catalog', () => {
      fsExistsSyncStub.returns(true);
      tsxRequireStub.returns({});
      expect(() => utilsProxied.loadCatalog()).to.throw('does not export "catalog"');
    });

    it('should return catalog from module.catalog', () => {
      const mockCatalog = { data: { components: {} }, componentNames: [] };
      fsExistsSyncStub.returns(true);
      tsxRequireStub.returns({ catalog: mockCatalog });
      const result = utilsProxied.loadCatalog();
      expect(result).to.deep.equal(mockCatalog);
    });

    it('should return catalog from module.default.catalog', () => {
      const mockCatalog = { data: { components: {} }, componentNames: [] };
      fsExistsSyncStub.returns(true);
      tsxRequireStub.returns({ default: { catalog: mockCatalog } });
      const result = utilsProxied.loadCatalog();
      expect(result).to.deep.equal(mockCatalog);
    });
  });

  describe('loadCurrentAtoms', () => {
    let fsExistsSyncStub: sinon.SinonStub;
    let tsxRequireStub: sinon.SinonStub;
    let utilsProxied: any;

    beforeEach(() => {
      fsExistsSyncStub = sinon.stub(fs, 'existsSync');
      tsxRequireStub = sinon.stub();
      utilsProxied = proxyquire('./utils', {
        'tsx/cjs/api': { require: tsxRequireStub },
      });
    });

    it('should throw when atoms module is not found', async () => {
      fsExistsSyncStub.returns(false);
      try {
        await utilsProxied.loadCurrentAtoms();
        expect.fail('expected to throw');
      } catch (err: any) {
        expect(err.message).to.include('Atoms module not found');
      }
    });

    it('should return a map of atom name to version and schemaHash', async () => {
      fsExistsSyncStub.returns(true);
      const catalog = {
        componentNames: ['Button', 'Card'],
        data: {
          components: {
            Button: { version: '1.2.0', label: 'Primary Button' },
            Card: { props: { title: 'string' } },
          },
        },
      };
      tsxRequireStub.returns({ catalog });

      const result = await utilsProxied.loadCurrentAtoms();

      expect(result.Button).to.exist;
      expect(result.Button.version).to.equal('1.2.0');
      expect(result.Button.schemaHash).to.be.a('string').with.length(64);
      expect(result.Card).to.exist;
      expect(result.Card.version).to.be.undefined;
      expect(result.Card.schemaHash).to.be.a('string').with.length(64);
    });

    it('should exclude version from schema hash computation', async () => {
      fsExistsSyncStub.returns(true);
      const catalog = {
        componentNames: ['Button'],
        data: {
          components: {
            Button: { version: '1.0.0', label: 'My Button' },
          },
        },
      };
      tsxRequireStub.returns({ catalog });

      const result = await utilsProxied.loadCurrentAtoms();

      const expectedHash = crypto
        .createHash('sha256')
        .update(JSON.stringify({ label: 'My Button' }, null, 0))
        .digest('hex');
      expect(result.Button.schemaHash).to.equal(expectedHash);
    });

    it('should handle atoms with no properties besides version', async () => {
      fsExistsSyncStub.returns(true);
      const catalog = {
        componentNames: ['Empty'],
        data: {
          components: {
            Empty: { version: '1.0.0' },
          },
        },
      };
      tsxRequireStub.returns({ catalog });

      const result = await utilsProxied.loadCurrentAtoms();

      expect(result.Empty.version).to.equal('1.0.0');
      // Hash is computed over {} (empty after removing version)
      const expectedHash = crypto
        .createHash('sha256')
        .update(JSON.stringify({}, null, 0))
        .digest('hex');
      expect(result.Empty.schemaHash).to.equal(expectedHash);
    });

    it('should return empty map when componentNames is empty', async () => {
      fsExistsSyncStub.returns(true);
      const catalog = { componentNames: [], data: { components: {} } };
      tsxRequireStub.returns({ catalog });

      const result = await utilsProxied.loadCurrentAtoms();

      expect(result).to.deep.equal({});
    });

    it('should default componentNames to [] when catalog does not provide it', async () => {
      fsExistsSyncStub.returns(true);
      // catalog has no componentNames property
      const catalog = { data: { components: { Button: { version: '1.0.0' } } } };
      tsxRequireStub.returns({ catalog });

      const result = await utilsProxied.loadCurrentAtoms();

      expect(result).to.deep.equal({});
    });

    it('should default components to {} when catalog.data.components is absent', async () => {
      fsExistsSyncStub.returns(true);
      // componentNames lists an atom but data.components is missing
      const catalog = { componentNames: ['Button'], data: {} };
      tsxRequireStub.returns({ catalog });

      const result = await utilsProxied.loadCurrentAtoms();

      expect(result.Button).to.exist;
      expect(result.Button.version).to.be.undefined;
      const expectedHash = crypto
        .createHash('sha256')
        .update(JSON.stringify({}, null, 0))
        .digest('hex');
      expect(result.Button.schemaHash).to.equal(expectedHash);
    });

    it('should default components to {} when catalog.data is absent', async () => {
      fsExistsSyncStub.returns(true);
      // componentNames lists an atom but data is missing entirely
      const catalog = { componentNames: ['Card'] };
      tsxRequireStub.returns({ catalog });

      const result = await utilsProxied.loadCurrentAtoms();

      expect(result.Card).to.exist;
      expect(result.Card.version).to.be.undefined;
    });

    it('should use empty object for component data when name is not in components map', async () => {
      fsExistsSyncStub.returns(true);
      // componentNames has 'Ghost' but components map does not
      const catalog = {
        componentNames: ['Ghost'],
        data: { components: {} },
      };
      tsxRequireStub.returns({ catalog });

      const result = await utilsProxied.loadCurrentAtoms();

      expect(result.Ghost).to.exist;
      expect(result.Ghost.version).to.be.undefined;
      const expectedHash = crypto
        .createHash('sha256')
        .update(JSON.stringify({}, null, 0))
        .digest('hex');
      expect(result.Ghost.schemaHash).to.equal(expectedHash);
    });
  });
});

