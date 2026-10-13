import path from 'path';
import { expect } from 'chai';
import chalk from 'chalk';
import sinon, { SinonStub } from 'sinon';
import { openJsonFile } from './helpers';
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
});
