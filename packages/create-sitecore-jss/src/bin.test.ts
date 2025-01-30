/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import fs from 'fs';
import { sep } from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { ParsedArgs } from 'minimist';
import { parseArgs, main, promptDestination, getDestination } from './bin';
import * as helpers from './common/utils/helpers';
import * as initialize from './initialize';

chai.use(sinonChai);

describe('bin', () => {
  describe('parseArgs', () => {
    let originalArgv: string[];

    beforeEach(() => {
      // eslint-disable-next-line no-unused-labels
      originalArgv: process.argv;
    });

    afterEach(() => {
      process.argv = originalArgv;
    });

    it('should parse', () => {
      process.argv = [
        'node',
        'index.ts',
        '--force',
        '--noInstall',
        '--yes',
        '--silent',
        '--appName',
        'test',
        '--destination',
        '.\\test\\path',
        '--template',
        'foo',
      ];

      const args = parseArgs();

      expect(args._).to.be.empty;
      expect(args.force).to.equal(true);
      expect(args.noInstall).to.equal(true);
      expect(args.yes).to.equal(true);
      expect(args.silent).to.equal(true);
      expect(args.appName).to.equal('test');
      expect(args.destination).to.equal('.\\test\\path');
      expect(args.template).to.equal('foo');
    });

    it('should accept positional parameters', () => {
      process.argv = ['node', 'index.ts', 'foo,bar', '--appName', 'test'];

      const args = parseArgs();

      expect(args._.length).to.equal(1);
      expect(args._[0]).to.equal('foo,bar');
      expect(args.appName).to.equal('test');
    });

    it('should accept boolean values for boolean parameters', () => {
      process.argv = ['node', 'index.ts', 'true', '--force', 'false'];

      const args = parseArgs();

      expect(args.force).to.equal(false);
    });

    it('should remove string parameters that are missing values', () => {
      process.argv = ['node', 'index.ts', '--appName', 'valid', '--destination'];

      const args = parseArgs();

      expect(args.appName).to.equal('valid');
      expect(args.destination).to.be.undefined;
    });
  });

  describe('main', async () => {
    let getAllTemplatesStub: SinonStub;
    let inquirerPromptStub: SinonStub;
    let fsExistsSyncStub: SinonStub;
    let fsReaddirSyncStub: SinonStub;
    let initializeStub: SinonStub;
    let consoleLogStub: SinonStub;
    let processExitStub: SinonStub;

    const mockArgs = (args?: { [arg: string]: unknown }): ParsedArgs => {
      return { _: [], ...args };
    };

    beforeEach(() => {
      getAllTemplatesStub = sinon.stub(helpers, 'getAllTemplates');
      inquirerPromptStub = sinon.stub(inquirer, 'prompt');
      fsExistsSyncStub = sinon.stub(fs, 'existsSync');
      fsReaddirSyncStub = sinon.stub(fs, 'readdirSync');
      initializeStub = sinon.stub(initialize, 'initialize');
      consoleLogStub = sinon.stub(console, 'log');
      processExitStub = sinon.stub(process, 'exit');
    });

    afterEach(() => {
      getAllTemplatesStub?.restore();
      inquirerPromptStub?.restore();
      fsExistsSyncStub?.restore();
      fsReaddirSyncStub?.restore();
      initializeStub?.restore();
      consoleLogStub?.restore();
      processExitStub?.restore();
    });

    it('should initialize with provided args', async () => {
      getAllTemplatesStub.returns(['foo', 'bar']);
      fsExistsSyncStub.returns(false);
      fsReaddirSyncStub.returns([]);

      const args = mockArgs({
        template: 'foo',
        destination: 'test\\path',
      });
      const expectedTemplate = 'foo';

      await main(args);
      expect(inquirerPromptStub).to.not.have.been.called;
      expect(initializeStub).to.have.been.calledOnceWith(expectedTemplate, {
        ...args,
        destination: args.destination,
        template: expectedTemplate,
      });
    });

    it('should accept template as positional parameter', async () => {
      getAllTemplatesStub.returns(['foo', 'bar']);
      fsExistsSyncStub.returns(false);
      fsReaddirSyncStub.returns([]);

      const args = mockArgs({
        destination: 'test\\path',
        _: ['foo'],
      });
      const expectedTemplate = 'foo';
      await main(args);

      expect(inquirerPromptStub).to.not.have.been.called;
      expect(initializeStub).to.have.been.calledOnceWith(expectedTemplate, {
        ...args,
        destination: args.destination,
        template: expectedTemplate,
      });
    });

    it('should prompt for template if missing', async () => {
      const allTemplates = ['nextjs', 'foo', 'bar'];
      getAllTemplatesStub.returns(allTemplates);
      fsExistsSyncStub.returns(false);
      fsReaddirSyncStub.returns([]);

      inquirerPromptStub
        .withArgs({
          type: 'list',
          name: 'template',
          message: 'Which template would you like to create?',
          choices: allTemplates,
          default: 'nextjs',
        })
        .returns({
          template: 'foo',
        });

      const args = mockArgs({
        destination: 'test\\path',
      });
      const expectedTemplate = 'foo';
      await main(args);

      expect(initializeStub).to.have.been.calledOnceWith(expectedTemplate, {
        ...args,
        destination: args.destination,
        template: expectedTemplate,
      });
    });

    describe('promptDestination', () => {
      it('should prompt with provided prompt text and return input value', async () => {
        const mockDestination = 'my\\path';
        const mockPrompt = 'Enter the mocking path';
        inquirerPromptStub.returns({
          destination: mockDestination,
        });
        const result = await promptDestination(mockPrompt, 'default');
        expect(inquirerPromptStub).to.have.been.called;
        expect(inquirerPromptStub.getCall(0).args[0].message).to.be.equal(mockPrompt);
        expect(result).to.be.equal(mockDestination);
      });

      it('should use default value', async () => {
        inquirerPromptStub.returns({
          destination: undefined,
        });
        const defaultDestination = 'defa\\ult';
        await promptDestination('use default here', defaultDestination);
        expect(inquirerPromptStub).to.have.been.called;
        expect(inquirerPromptStub.getCall(0).args[0].default()).to.be.equal(defaultDestination);
      });
    });

    describe('getDestination', () => {
      const testTemplate = 'foo';

      it('should return base args.destination value only when provided', async () => {
        const testPath = 'test\\path';
        const testArgs = mockArgs({
          destination: testPath,
        });
        expect(await getDestination(testArgs, testTemplate)).to.equal(testPath);
      });

      it('should prompt to get base destination when args.destination is empty', async () => {
        const testPath = 'test\\path';
        inquirerPromptStub.returns({
          destination: testPath,
        });
        const testArgs = mockArgs({
          destination: undefined,
        });
        await getDestination(testArgs, testTemplate);
        expect(inquirerPromptStub).to.have.been.calledOnce;
        expect(inquirerPromptStub.getCall(0).args[0].message).to.be.equal(
          'Where would you like your new app created?'
        );
      });

      it('should return default base destination with base template when --yes arg is used', async () => {
        const testArgs = mockArgs({
          destination: undefined,
          yes: true,
        });
        const expectedDestination = `${process.cwd()}${sep + testTemplate}`;
        expect(await getDestination(testArgs, testTemplate)).to.deep.equal(expectedDestination);
      });

      it('should return default base destination with args.appName when provided and --yes arg is used', async () => {
        const testAppName = 'myapp';
        const testArgs = mockArgs({
          destination: undefined,
          appName: testAppName,
          yes: true,
        });
        const expectedDestination = `${process.cwd()}${sep + testAppName}`;
        expect(await getDestination(testArgs, testTemplate)).to.deep.equal(expectedDestination);
      });

      it('should throw when template is empty', async () => {
        const testArgs = mockArgs();
        await getDestination(testArgs, '').catch((error) => {
          expect(error.message).to.be.equal(
            'Unable to get destinations, provided template is empty'
          );
        });
      });
    });

    // this partially duplicates tests for getDestinations, but we need to ensure initializeStub is called with correct values
    // no way around it however - sinon cannot mock getDestinations on its own, which could've prevented this
    describe('main with destinations from args', () => {
      it('should call initializeStub with value from getDestination', async () => {
        getAllTemplatesStub.returns(['foo', 'bar']);
        fsExistsSyncStub.returns(false);
        fsReaddirSyncStub.returns([]);

        const mockDestination = 'my\\path';

        const args = mockArgs({
          template: 'foo',
          destination: mockDestination,
        });
        const expectedTemplate = 'foo';

        await main(args);

        expect(initializeStub).to.have.been.calledWith(expectedTemplate, {
          ...args,
          destination: mockDestination,
          template: expectedTemplate,
        });
      });
    });

    describe('destination not empty', () => {
      it('should prompt and continue if yes', async () => {
        getAllTemplatesStub.returns(['foo', 'bar']);
        fsExistsSyncStub.returns(true);
        fsReaddirSyncStub.returns(['file.txt']);

        inquirerPromptStub.returns({
          continue: true,
        });

        const args = mockArgs({
          template: 'foo',
          destination: 'test\\path',
        });
        const expectedTemplate = 'foo';
        await main(args);

        expect(inquirerPromptStub).to.have.been.calledWith({
          type: 'confirm',
          name: 'continue',
          message: `Directory '${args.destination}' not empty. Are you sure you want to continue?`,
        });
        expect(initializeStub).to.have.been.calledWith(expectedTemplate, {
          ...args,
          destination: args.destination,
          template: expectedTemplate,
        });
      });

      it('should prompt and exit if no', async () => {
        getAllTemplatesStub.returns(['foo', 'bar']);
        fsExistsSyncStub.returns(true);
        fsReaddirSyncStub.returns(['file.txt']);
        // throw to ensure subsequent code isn't run
        processExitStub.throws('process.exit');
        inquirerPromptStub.returns({
          continue: false,
        });

        const args = mockArgs({
          template: 'foo',
          destination: 'test\\path',
        });
        await main(args).catch((error) => {
          expect(inquirerPromptStub).to.have.been.calledOnceWith({
            type: 'confirm',
            name: 'continue',
            message: `Directory '${args.destination}' not empty. Are you sure you want to continue?`,
          });
          expect(processExitStub).to.have.been.calledOnce;
          expect(error.name).to.equal('process.exit');
          expect(initializeStub).to.not.have.been.called;
        });
      });

      it('should respect force', async () => {
        getAllTemplatesStub.returns(['foo', 'bar']);
        fsExistsSyncStub.returns(true);
        fsReaddirSyncStub.returns(['file.txt']);

        const args = mockArgs({
          template: 'foo',
          destination: 'test\\path',
          force: true,
        });
        const expectedTemplate = 'foo';
        await main(args);

        expect(inquirerPromptStub).to.not.have.been.called;
        expect(initializeStub).to.have.been.calledOnceWith(expectedTemplate, {
          ...args,
          destination: args.destination,
          template: expectedTemplate,
        });
      });
    });

    it('should handle initialize error', async () => {
      getAllTemplatesStub.returns(['foo', 'bar']);
      fsExistsSyncStub.returns(false);
      fsReaddirSyncStub.returns([]);
      const error = new Error('nope');
      initializeStub.throws(error);
      inquirerPromptStub.returns({
        continue: false,
      });

      const args = mockArgs({
        template: 'foo',
        destination: 'test\\path',
      });
      await main(args);

      expect(consoleLogStub).to.have.been.calledWith(chalk.red('An error occurred: ', error));
      expect(processExitStub).to.have.been.calledWith(1);
    });
  });
});
