/* eslint-disable no-unused-expressions */
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ejs from 'ejs';
import glob from 'glob';
import chai, { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import * as transform from './transform';
import * as helpers from '../utils/helpers';
import proxyquire from 'proxyquire';

chai.use(sinonChai);

const { transformFilename, transform: transformFunc } = transform;

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

  describe('transform', () => {
    let fsMkdirsSyncStub: SinonStub;
    let fsCopySyncStub: SinonStub;
    let fsExistsSyncStub: SinonStub;
    let fsReadFileSunc: SinonStub;
    let globSyncStub: SinonStub;
    let ejsRenderFileStub: SinonStub;
    let mergeEnvStub: SinonStub;
    let mergeStub: SinonStub;
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

      writeFileToPathStub = sinon.stub(helpers, 'writeFileToPath');

      await transformModule.transform(templatePath, args);

      expect(ejsRenderFileStub).to.have.been.calledOnceWith(path.join(templatePath, file), {
        ...args,
        version: '22.2.1-canary',
        helper: {
          isDev: false,
        },
      });

      expect(writeFileToPathStub).to.have.been.calledOnceWith(
        path.join(destinationPath, file),
        renderFileOutput
      );
    });

    it('should skip if isFileForSkip', async () => {
      const templatePath = path.resolve('templates/next');
      const destinationPath = path.resolve('samples/next');
      const file = 'file.ts';

      globSyncStub = sinon.stub(glob, 'sync').returns([file]);
      ejsRenderFileStub = sinon.stub(ejs, 'renderFile');
      writeFileToPathStub = sinon.stub(helpers, 'writeFileToPath');

      const args = {
        destination: destinationPath,
        template: '',
        force: false,
      };

      await transformFunc(templatePath, args, {
        isFileForSkip: (f) => f === file,
      });

      expect(ejsRenderFileStub).to.not.have.been.called;
      expect(writeFileToPathStub).to.not.have.been.called;
    });

    it('should copy only special files', async () => {
      const templatePath = path.resolve('templates/next');
      const destinationPath = path.resolve('samples/next');
      const files = ['image.png', 'file.pdf'];

      globSyncStub = sinon.stub(glob, 'sync').returns(files);
      fsCopySyncStub = sinon.stub(fs, 'copySync');
      ejsRenderFileStub = sinon.stub(ejs, 'renderFile');
      writeFileToPathStub = sinon.stub(helpers, 'writeFileToPath');

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
      expect(writeFileToPathStub).to.not.have.been.called;
    });

    it('should skip if isFileForCopy', async () => {
      const templatePath = path.resolve('templates/next');
      const destinationPath = path.resolve('samples/next');
      const file = 'file.ts';

      globSyncStub = sinon.stub(glob, 'sync').returns([file]);
      fsCopySyncStub = sinon.stub(fs, 'copySync');
      ejsRenderFileStub = sinon.stub(ejs, 'renderFile');
      writeFileToPathStub = sinon.stub(helpers, 'writeFileToPath');

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
      expect(writeFileToPathStub).to.not.have.been.called;
    });

    it('should rename gitignore file', async () => {
      const templatePath = path.resolve('templates/next');
      const destinationPath = path.resolve('samples/next');
      const renderFileOutput = 'file output';

      globSyncStub = sinon.stub(glob, 'sync').returns(['gitignore']);
      ejsRenderFileStub = sinon.stub(ejs, 'renderFile').returns(Promise.resolve(renderFileOutput));
      writeFileToPathStub = sinon.stub(helpers, 'writeFileToPath');

      const args = {
        destination: destinationPath,
        template: '',
        force: false,
      };

      await transformFunc(templatePath, args);

      expect(writeFileToPathStub).to.have.been.calledOnceWith(
        path.join(destinationPath, '.gitignore'),
        renderFileOutput
      );
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
