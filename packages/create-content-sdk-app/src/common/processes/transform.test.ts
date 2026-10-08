/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ejs from 'ejs';
import * as glob from 'glob';
import chai, { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import * as transform from './transform';
import * as helpers from '../utils/helpers';

chai.use(sinonChai);

const { transform: transformFunc, populateEjsData } = transform;

describe('transform', () => {
  describe('transform', () => {
    let fsCopySyncStub: SinonStub;
    let globSyncStub: SinonStub;
    let ejsRenderFileStub: SinonStub;
    let writeFileToPathStub: SinonStub;
    let log: SinonStub;

    afterEach(() => {
      fsCopySyncStub?.restore();
      globSyncStub?.restore();
      ejsRenderFileStub?.restore();
      writeFileToPathStub?.restore();
      log?.restore();
    });

    it('should transform file', async () => {
      const templatePath = path.resolve('templates/next');
      const destinationPath = path.resolve('samples/next');
      const file = 'file.ts';
      const renderFileOutput = 'file output';
      const versions = {
        '@sitecore-content-sdk/nextjs': '1.4.2-canary.0',
        '@sitecore-content-sdk/core': '^1.4.0',
      };

      globSyncStub = sinon.stub(glob, 'sync').returns([file]);
      ejsRenderFileStub = sinon.stub(ejs, 'renderFile').returns(Promise.resolve(renderFileOutput));

      const args = {
        destination: destinationPath,
        template: '',
        force: false,
      };

      writeFileToPathStub = sinon.stub(helpers, 'writeFileToPath');

      await transformFunc(templatePath, args, versions);

      expect(ejsRenderFileStub).to.have.been.calledOnceWith(path.join(templatePath, file), {
        ...args,
        versions,
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

      await transformFunc(templatePath, args, {}, {
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

      await transformFunc(templatePath, args, {});

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

      await transformFunc(templatePath, args, {}, {
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

      await transformFunc(templatePath, args, {});

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

      await transformFunc(templatePath, args, {});

      expect(log.getCall(0).args[0]).to.equal(chalk.red(error));
      expect(log.getCall(1).args[0]).to.equal(
        `Error occurred when trying to render to ${chalk.yellow(path.resolve(file))}`
      );
    });
  });

  describe('populateEjsData', () => {
    it('should pass the provided versions through to the ejs data', () => {
      const destinationPath = path.resolve('samples/next');
      const args = {
        destination: destinationPath,
        template: '',
        force: false,
      };
      const versions = {
        '@sitecore-content-sdk/nextjs': '1.4.2-beta.1',
        '@sitecore-content-sdk/core': '~1.4.0',
      };

      const result = populateEjsData(args, versions);

      expect(result.versions).to.deep.equal(versions);
      expect(result).to.include(args);
    });

    it('should flag dev environment based on destination', () => {
      const args = {
        destination: path.resolve('samples/next'),
        template: '',
        force: false,
      };

      const result = populateEjsData(args, {});

      expect((result.helper as { isDev: boolean }).isDev).to.equal(false);
    });
  });
});
