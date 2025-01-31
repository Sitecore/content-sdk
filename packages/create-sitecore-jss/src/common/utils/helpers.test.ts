/* eslint-disable no-unused-expressions */
import path from 'path';
import fs from 'fs';
import { expect } from 'chai';
import chalk from 'chalk';
import sinon, { SinonStub } from 'sinon';
import {
  openJsonFile,
  writeJsonFile,
  sortKeys,
  getAllTemplates,
  saveConfiguration,
} from './helpers';
import { JsonObjectType } from '../processes/transform';
import testPackage from '../test-data/test.package.json';
import testJson from '../test-data/test.json';

describe('helpers', () => {
  describe('openJsonFile', () => {
    let log: SinonStub;

    afterEach(() => log?.restore());

    it('should return package.json data using provided path', () => {
      const filePath = path.resolve('src', 'common', 'test-data', 'test.package.json');

      const result = openJsonFile(filePath);

      expect(result).to.deep.equal(testPackage);
    });

    it('should throw an error when the path to the package does not exist', () => {
      log = sinon.stub(console, 'log');

      const filePath = path.resolve('not', 'existing', 'path', 'package.json');

      const result = openJsonFile(filePath);

      expect(result).to.equal(undefined);
      expect(log.calledTwice).to.equal(true);
      expect(log.getCall(0).args[0]).to.equal(
        chalk.red(`The following error occurred while trying to read ${filePath}:`)
      );
      expect(log.getCall(1).args[0]).to.equal(
        chalk.red(`Error: ENOENT: no such file or directory, open '${filePath}'`)
      );

      log.restore();
    });

    it('should return json data using provided path', () => {
      const filePath = path.resolve('src', 'common', 'test-data', 'test.json');

      const result = openJsonFile(filePath);

      expect(result).to.deep.equal(testJson);
    });

    it('should throw an error when the path to the package does not exist', () => {
      log = sinon.stub(console, 'log');

      const filePath = path.resolve('not', 'existing', 'path', 'package.json');

      const result = openJsonFile(filePath);

      expect(result).to.equal(undefined);
      expect(log.calledTwice).to.equal(true);
      expect(log.getCall(0).args[0]).to.equal(
        chalk.red(`The following error occurred while trying to read ${filePath}:`)
      );
      expect(log.getCall(1).args[0]).to.equal(
        chalk.red(`Error: ENOENT: no such file or directory, open '${filePath}'`)
      );

      log.restore();
    });
  });

  describe('writeJsonFile', () => {
    let log: SinonStub;
    let writeFileSync: SinonStub;

    afterEach(() => {
      log?.restore();
      writeFileSync?.restore();
    });

    it('should format data', () => {
      writeFileSync = sinon.stub(fs, 'writeFileSync');

      const data = {
        foo: 'foo',
        bar: { baz: 'baz' },
      };

      const filePath = path.resolve('src', 'common', 'test-data', 'test.package.json');

      writeJsonFile(data, filePath);

      expect(writeFileSync.calledOnce).to.equal(true);
      expect(writeFileSync.getCall(0).args[1]).to.equal(JSON.stringify(data, null, 2));
    });

    it('should use provided path', () => {
      writeFileSync = sinon.stub(fs, 'writeFileSync');

      const filePath = path.resolve('src', 'common', 'test-data', 'test.package.json');

      writeJsonFile({}, filePath);

      expect(writeFileSync.calledOnce).to.equal(true);
      expect(writeFileSync.getCall(0).args[0]).to.equal(filePath);
    });

    it('should throw an error when the path to the package does not exist', () => {
      log = sinon.stub(console, 'log');

      const filePath = path.resolve('not', 'existing', 'path', 'package.json');

      writeJsonFile({}, filePath);

      expect(log.calledTwice).to.equal(true);
      expect(log.getCall(0).args[0]).to.equal(
        chalk.red(`The following error occurred while trying to write ${filePath}:`)
      );
      expect(log.getCall(1).args[0]).to.equal(
        chalk.red(`Error: ENOENT: no such file or directory, open '${filePath}'`)
      );

      log.restore();
    });
  });

  describe('saveConfiguration', () => {
    let writeFileSync: SinonStub;

    afterEach(() => {
      writeFileSync?.restore();
    });

    it('should save configuration', () => {
      writeFileSync = sinon.stub(fs, 'writeFileSync');
      const pkgPath = path.resolve('src', 'common', 'test-data', 'test.package.json');
      const pkg = openJsonFile(pkgPath);
      const template = 'nextjs';

      saveConfiguration(template, pkgPath);

      expect(writeFileSync.calledOnce).to.equal(true);
      expect(writeFileSync.getCall(0).args[1]).to.equal(
        JSON.stringify({ ...pkg, config: { ...pkg.config, template } }, null, 2)
      );
    });
  });

  describe('sortKeys', () => {
    it('should sort the keys of an object alphabetically', () => {
      const obj: JsonObjectType = {
        dependencies: {
          d: '0.0',
          b: '0.0',
          c: '0.0',
          a: '0.0',
        },
        scripts: {
          c: '',
          d: '',
          b: '',
          a: '',
        },
      };
      const expected: JsonObjectType = {
        dependencies: {
          a: '0.0',
          b: '0.0',
          c: '0.0',
          d: '0.0',
        },
        scripts: {
          a: '',
          b: '',
          c: '',
          d: '',
        },
      };

      const result: JsonObjectType = {};

      for (const key of Object.keys(obj)) {
        result[key] = sortKeys(obj[key] as JsonObjectType);
      }

      expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
    });
  });

  describe('getAllTemplates', () => {
    let readdirSync: SinonStub;

    afterEach(() => {
      readdirSync?.restore();
    });

    it('should return templates', () => {
      readdirSync = sinon.stub(fs, 'readdirSync');
      readdirSync.returns(['foo', 'bar', 'baz']);

      const templates = getAllTemplates();

      expect(readdirSync.calledOnce).to.equal(true);
      expect(readdirSync.getCall(0).args[0]).to.equal(path.resolve(__dirname, './../../templates'));
      expect(templates).to.deep.equal(['foo', 'bar', 'baz']);
    });
  });
});
