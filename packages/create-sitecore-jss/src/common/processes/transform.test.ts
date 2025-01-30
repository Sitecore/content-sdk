/* eslint-disable no-unused-expressions */
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ejs from 'ejs';
import glob from 'glob';
import chai, { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import * as transform from './transform';
import * as helpers from '../utils/helpers';
import proxyquire from 'proxyquire';

chai.use(sinonChai);

const { transformFilename, diffFiles, diffAndWriteFiles, transform: transformFunc } = transform;

describe('transform', () => {
  describe('transformFilename', () => {
    it('should replace placeholder filename with appropriate key', () => {
      const fileName = '{{appName}}.config';
      const args = {
        force: true,
        silent: true,
        appName: 'test',
        destination: '.\\test-data\\test',
        prerender: 'SSG',
        template: '',
      };

      const transformedFileName = transformFilename(fileName, args);

      expect(transformedFileName).to.equal('test.config');
    });
  });

  describe('diffFiles', () => {
    let log: SinonStub;
    let prompt: SinonStub;

    afterEach(() => {
      log?.restore();
      prompt?.restore();
    });

    it('should return empty string when target file is not found', async () => {
      const result = await diffFiles('test', 'not/existing/path');

      expect(result).to.equal('');
    });

    it('should return empty string when source and target files are equal', async () => {
      const source = fs.readFileSync(
        path.resolve('src', 'common', 'test-data', 'transform', 'source.ts'),
        'utf-8'
      );
      const result = await diffFiles(
        source,
        path.resolve('src', 'common', 'test-data', 'transform', 'source.ts')
      );

      expect(result).to.equal('');
    });

    it('should show diff using text regular file', async () => {
      log = sinon.stub(console, 'log');
      prompt = sinon.stub(inquirer, 'prompt').returns({ choice: true } as any);
      const targetFilePath = path.resolve('src', 'common', 'test-data', 'transform', 'target.ts');

      const source = fs.readFileSync(
        path.resolve('src', 'common', 'test-data', 'transform', 'source.ts'),
        'utf-8'
      );
      const result = await diffFiles(source, targetFilePath);
      expect(log.getCalls().length).to.equal(12);

      const calls = [
        chalk.grey('= '),
        chalk.red('- const x = 15;'),
        chalk.green('+ const a = 10;'),
        chalk.grey('= const b = 20;'),
        chalk.grey('= '),
        chalk.grey('= console.log(10 + 20);'),
        chalk.grey('= '),
        chalk.red('- console.log(40 + 10);'),
        chalk.green('+ console.log(20 + 30);'),
        chalk.grey('= '),
        chalk.grey('= console.log(a + b);'),
      ];

      calls.forEach((arg, i) => {
        expect(log.getCall(i).args[0].replace('\r', '')).to.equal(arg);
      });

      expect(log.getCall(calls.length).args[0]).to.equal(
        `Showing potential changes in ${chalk.yellow(targetFilePath.replace('/', '\\'))}`
      );

      expect(
        prompt.calledOnceWith({
          type: 'list',
          name: 'choice',
          choices: ['yes', 'skip', 'yes to all', 'abort'],
          message: `File ${chalk.yellow(
            targetFilePath.replace('/', '\\')
          )} is about to be overwritten with the above changes. Are you sure you want to continue?`,
        })
      ).to.equal(true);

      expect(result).equal(true);
    });

    it('should show diff using json file', async () => {
      log = sinon.stub(console, 'log');
      prompt = sinon.stub(inquirer, 'prompt').returns({ choice: true } as any);
      const targetFilePath = path.resolve('src', 'common', 'test-data', 'transform', 'target.json');

      const source = fs.readFileSync(
        path.resolve('src', 'common', 'test-data', 'transform', 'source.json'),
        'utf-8'
      );
      const result = await diffFiles(source, targetFilePath);

      expect(log.getCalls().length).to.equal(16);

      const calls = [
        chalk.grey('= {'),
        chalk.red('-   "a": ['),
        chalk.red('-     1,'),
        chalk.red('-     2'),
        chalk.red('-   ],'),
        chalk.grey('=   "foo": {'),
        chalk.red('-     "b": 50,'),
        chalk.red('-     "bar": true,'),
        chalk.green('+     "bar": false,'),
        chalk.grey('=     "y": 15'),
        chalk.grey('=   },'),
        chalk.grey('=   "x": 10,'),
        chalk.red('-   "z": "40"'),
        chalk.green('+   "z": "30"'),
        chalk.grey('= }'),
      ];

      calls.forEach((arg, i) => {
        expect(log.getCall(i).args[0]).to.equal(arg);
      });

      expect(log.getCall(calls.length).args[0]).to.equal(
        `Showing potential changes in ${chalk.yellow(targetFilePath.replace('/', '\\'))}`
      );

      expect(
        prompt.calledOnceWith({
          type: 'list',
          name: 'choice',
          choices: ['yes', 'skip', 'yes to all', 'abort'],
          message: `File ${chalk.yellow(
            targetFilePath.replace('/', '\\')
          )} is about to be overwritten with the above changes. Are you sure you want to continue?`,
        })
      ).to.equal(true);

      expect(result).equal(true);
    });
  });

  describe('diffAndWriteFiles', () => {
    let diffFilesStub: SinonStub;
    let processExitStub: SinonStub;
    let writeFileToPathStub: SinonStub;

    afterEach(() => {
      diffFilesStub?.restore();
      processExitStub?.restore();
      writeFileToPathStub?.restore();
    });

    it('should overwrite a single file', async () => {
      diffFilesStub = sinon.stub(transform, 'diffFiles').returns(Promise.resolve('yes'));
      writeFileToPathStub = sinon.stub(helpers, 'writeFileToPath');

      const args = {
        appName: 'JssNextWeb',
        destination: 'samples/next',
        force: false,
        template: '',
        language: 'en',
      };

      await diffAndWriteFiles({
        rendered: 'test',
        pathToNewFile: 'samples/next/{{language}}.txt',
        args,
      });

      expect(writeFileToPathStub.calledOnceWith('samples/next/en.txt', 'test')).to.equal(true);

      expect(args.force).to.equal(false);
    });

    it('should overwrite a single file and later do not ask the same question', async () => {
      diffFilesStub = sinon.stub(transform, 'diffFiles').returns(Promise.resolve('yes to all'));
      writeFileToPathStub = sinon.stub(helpers, 'writeFileToPath');

      const args = {
        appName: 'JssNextWeb',
        destination: 'samples/next',
        force: false,
        template: '',
        language: 'en',
      };

      await diffAndWriteFiles({
        rendered: 'test',
        pathToNewFile: 'samples/next/{{language}}.txt',
        args,
      });

      expect(writeFileToPathStub.calledOnceWith('samples/next/en.txt', 'test')).to.equal(true);

      expect(args.force).to.equal(true);
    });

    it('should skip file', async () => {
      diffFilesStub = sinon.stub(transform, 'diffFiles').returns(Promise.resolve('skip'));
      writeFileToPathStub = sinon.stub(helpers, 'writeFileToPath');

      const args = {
        appName: 'JssNextWeb',
        destination: 'samples/next',
        force: false,
        template: '',
        language: 'en',
      };

      await diffAndWriteFiles({
        rendered: 'test',
        pathToNewFile: 'samples/next/{{language}}.txt',
        args,
      });

      expect(writeFileToPathStub.notCalled).to.equal(true);

      expect(args.force).to.equal(false);
    });

    it('should abort a process', async () => {
      diffFilesStub = sinon.stub(transform, 'diffFiles').returns(Promise.resolve('abort'));
      writeFileToPathStub = sinon.stub(helpers, 'writeFileToPath');

      processExitStub = sinon.stub(process, 'exit');

      const args = {
        appName: 'JssNextWeb',
        destination: 'samples/next',
        force: false,
        template: '',
        language: 'en',
      };

      await diffAndWriteFiles({
        rendered: 'test',
        pathToNewFile: 'samples/next/{{language}}.txt',
        args,
      });

      expect(writeFileToPathStub.notCalled).to.equal(true);

      expect(processExitStub.calledOnce).to.equal(true);

      expect(args.force).to.equal(false);
    });
  });

  describe('transform', () => {
    let fsMkdirsSyncStub: SinonStub;
    let fsCopySyncStub: SinonStub;
    let fsExistsSyncStub: SinonStub;
    let fsReadFileSunc: SinonStub;
    let globSyncStub: SinonStub;
    let ejsRenderFileStub: SinonStub;
    let mergeEnvStub: SinonStub;
    let mergeStub: SinonStub;
    let diffAndWriteFilesStub: SinonStub;
    let writeFileToPathStub: SinonStub;
    let transformFilenameStub: SinonStub;
    let openJsonFileStub: SinonStub;
    let log: SinonStub;

    beforeEach(() => {
      fsMkdirsSyncStub = sinon.stub(fs, 'mkdirsSync');
    });

    afterEach(() => {
      fsMkdirsSyncStub?.restore();
      fsCopySyncStub?.restore();
      fsExistsSyncStub?.restore();
      fsReadFileSunc?.restore();
      globSyncStub?.restore();
      ejsRenderFileStub?.restore();
      mergeEnvStub?.restore();
      mergeStub?.restore();
      diffAndWriteFilesStub?.restore();
      writeFileToPathStub?.restore();
      transformFilenameStub?.restore();
      openJsonFileStub?.restore();
      log?.restore();
    });

    it('should transform file', async () => {
      const templatePath = path.resolve('templates/next');
      const destinationPath = path.resolve('samples/next');
      const file = 'file.ts';
      const renderFileOutput = 'file output';

      globSyncStub = sinon.stub(glob, 'sync').returns([file]);
      ejsRenderFileStub = sinon.stub(ejs, 'renderFile').returns(Promise.resolve(renderFileOutput));

      const args = {
        destination: destinationPath,
        template: '',
        force: false,
      };

      const transformModule = proxyquire('./transform', {
        '../../../package.json': { version: '22.2.1-canary.33' },
      });

      diffAndWriteFilesStub = sinon.stub(transformModule, 'diffAndWriteFiles');

      await transformModule.transform(templatePath, args);

      expect(ejsRenderFileStub).to.have.been.calledOnceWith(path.join(templatePath, file), {
        ...args,
        version: '22.2.1-canary',
        helper: {
          isDev: false,
        },
      });
      expect(diffAndWriteFilesStub).to.have.been.calledOnceWith({
        rendered: renderFileOutput,
        pathToNewFile: path.join(destinationPath, file),
        args,
      });
    });

    it('should skip if isFileForSkip', async () => {
      const templatePath = path.resolve('templates/next');
      const destinationPath = path.resolve('samples/next');
      const file = 'file.ts';

      globSyncStub = sinon.stub(glob, 'sync').returns([file]);
      ejsRenderFileStub = sinon.stub(ejs, 'renderFile');
      diffAndWriteFilesStub = sinon.stub(transform, 'diffAndWriteFiles');

      const args = {
        destination: destinationPath,
        template: '',
        force: false,
      };

      await transformFunc(templatePath, args, {
        isFileForSkip: (f) => f === file,
      });

      expect(ejsRenderFileStub).to.not.have.been.called;
      expect(diffAndWriteFilesStub).to.not.have.been.called;
    });

    it('should copy only special files', async () => {
      const templatePath = path.resolve('templates/next');
      const destinationPath = path.resolve('samples/next');
      const files = ['image.png', 'file.pdf'];

      globSyncStub = sinon.stub(glob, 'sync').returns(files);
      fsCopySyncStub = sinon.stub(fs, 'copySync');
      ejsRenderFileStub = sinon.stub(ejs, 'renderFile');
      diffAndWriteFilesStub = sinon.stub(transform, 'diffAndWriteFiles');

      const args = {
        destination: destinationPath,
        template: '',
        force: false,
      };

      await transformFunc(templatePath, args);

      expect(fsCopySyncStub).to.have.been.calledTwice;
      files.forEach((file) => {
        expect(fsCopySyncStub).to.have.been.calledWith(
          path.join(templatePath, file),
          path.join(destinationPath, file)
        );
      });
      expect(ejsRenderFileStub).to.not.have.been.called;
      expect(diffAndWriteFilesStub).to.not.have.been.called;
    });

    it('should skip if isFileForCopy', async () => {
      const templatePath = path.resolve('templates/next');
      const destinationPath = path.resolve('samples/next');
      const file = 'file.ts';

      globSyncStub = sinon.stub(glob, 'sync').returns([file]);
      fsCopySyncStub = sinon.stub(fs, 'copySync');
      ejsRenderFileStub = sinon.stub(ejs, 'renderFile');
      diffAndWriteFilesStub = sinon.stub(transform, 'diffAndWriteFiles');

      const args = {
        destination: destinationPath,
        template: '',
        force: false,
      };

      await transformFunc(templatePath, args, {
        isFileForCopy: (f) => f === file,
      });

      expect(fsCopySyncStub).to.have.been.calledOnceWith(
        path.join(templatePath, file),
        path.join(destinationPath, file)
      );
      expect(ejsRenderFileStub).to.not.have.been.called;
      expect(diffAndWriteFilesStub).to.not.have.been.called;
    });

    it('should rename gitignore file', async () => {
      const templatePath = path.resolve('templates/next');
      const destinationPath = path.resolve('samples/next');
      const renderFileOutput = 'file output';

      globSyncStub = sinon.stub(glob, 'sync').returns(['gitignore']);
      ejsRenderFileStub = sinon.stub(ejs, 'renderFile').returns(Promise.resolve(renderFileOutput));
      diffAndWriteFilesStub = sinon.stub(transform, 'diffAndWriteFiles');

      const args = {
        destination: destinationPath,
        template: '',
        force: false,
      };

      await transformFunc(templatePath, args);

      expect(diffAndWriteFilesStub).to.have.been.calledOnceWith({
        rendered: renderFileOutput,
        pathToNewFile: path.join(destinationPath, '.gitignore'),
        args,
      });
    });

    it('should force', async () => {
      const templatePath = path.resolve('templates/next');
      const destinationPath = path.resolve('samples/next');
      const renderFileOutput = 'file output';
      const file = 'file.ts';

      globSyncStub = sinon.stub(glob, 'sync').returns([file]);
      ejsRenderFileStub = sinon.stub(ejs, 'renderFile').returns(Promise.resolve(renderFileOutput));
      writeFileToPathStub = sinon.stub(helpers, 'writeFileToPath');
      diffAndWriteFilesStub = sinon.stub(transform, 'diffAndWriteFiles');

      const args = {
        destination: destinationPath,
        template: '',
        force: true,
      };

      await transformFunc(templatePath, args);

      expect(writeFileToPathStub).to.have.been.calledOnceWith(
        path.join(destinationPath, file),
        renderFileOutput
      );
      expect(diffAndWriteFilesStub).to.not.have.been.called;
    });

    it('should handle error', async () => {
      const templatePath = path.resolve('templates/next');
      const destinationPath = path.resolve('samples/next');
      const file = 'file.ts';
      const error = new Error('Nope!');

      globSyncStub = sinon.stub(glob, 'sync').returns([file]);
      ejsRenderFileStub = sinon.stub(ejs, 'renderFile').throws(error);
      log = sinon.stub(console, 'log');

      const args = {
        destination: destinationPath,
        template: '',
        force: false,
      };

      await transformFunc(templatePath, args);

      expect(log.getCall(0).args[0]).to.equal(chalk.red(error));
      expect(log.getCall(1).args[0]).to.equal(
        `Error occurred when trying to render to ${chalk.yellow(path.resolve(file))}`
      );
    });
  });
});
