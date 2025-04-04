import fs from 'fs';
import { expect } from 'chai';
import path from 'path';
import sinon from 'sinon';
import { scaffoldFile, editLineEndings, scaffoldComponent } from './scaffold';

describe('scaffold', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('editLineEndings', () => {
    it('should replace line endings', () => {
      expect(editLineEndings('test\n')).to.equal('test\r\n');
      expect(editLineEndings('test\r')).to.equal('test\r\n');
    });
  });

  describe('scaffoldFile', () => {
    afterEach(() => {
      sinon.restore();
    });

    const setupTest = () => {
      return {
        mkDirStub: sinon.stub(fs, 'mkdirSync'),
        writeFileStub: sinon.stub(fs, 'writeFileSync'),
        scaffoldInput: {
          rootPath: 'C:/myapp',
          fileContent: 'sample content',
          filename: 'index.ts',
          componentPath: 'FreshComponent',
        },
      };
    };

    it('should scaffold file', () => {
      sinon.stub(fs, 'existsSync').returns(false);
      const { mkDirStub, writeFileStub, scaffoldInput } = setupTest();
      const expectedOutputDir = `${scaffoldInput.rootPath}/${scaffoldInput.componentPath}`;

      const filePath = path.join(expectedOutputDir, scaffoldInput.filename);

      const result = scaffoldFile(filePath, scaffoldInput.fileContent);

      expect(mkDirStub.calledWith(`${expectedOutputDir}`, { recursive: true }));
      expect(
        writeFileStub.calledWith(
          `${expectedOutputDir}/${scaffoldInput.filename}`,
          editLineEndings(scaffoldInput.fileContent),
          'utf8'
        )
      );
      expect(result).to.equal(filePath);
    });

    it('should return null when output file already exists', () => {
      const { mkDirStub, writeFileStub, scaffoldInput } = setupTest();
      const existsStub = sinon.stub(fs, 'existsSync');
      const filePath = path.join(
        scaffoldInput.rootPath,
        scaffoldInput.componentPath,
        scaffoldInput.filename
      );

      existsStub.withArgs(filePath).returns(true);

      const result = scaffoldFile(filePath, scaffoldInput.fileContent);

      expect(result).to.equal(null);
      expect(mkDirStub.called).to.equal(false);
      expect(writeFileStub.called).to.equal(false);
    });
  });

  describe('scaffoldComponent', () => {
    let consoleLogStub: sinon.SinonStub;
    let writeFileStub: sinon.SinonStub;
    let existsStub: sinon.SinonStub;

    beforeEach(() => {
      consoleLogStub = sinon.stub(console, 'log');
      writeFileStub = sinon.stub(fs, 'writeFileSync');
      existsStub = sinon.stub(fs, 'existsSync');
    });

    afterEach(() => {
      consoleLogStub.restore();
      writeFileStub.restore();
      existsStub.restore();
    });

    const templates = [
      {
        name: 'default',
        fileExtension: 'tsx',
        generateTemplate: sinon.stub().returns('default template content'),
        getNextSteps: sinon.stub().returns(['Step 1', 'Step 2']),
      },
      {
        name: 'byoc',
        fileExtension: 'tsx',
        generateTemplate: sinon.stub().returns('byoc template content'),
        getNextSteps: sinon.stub().returns(['BYOC Step 1', 'BYOC Step 2']),
      },
      {
        name: 'customTemplate',
        fileExtension: 'tsx',
        generateTemplate: sinon.stub().returns('custom template content'),
        getNextSteps: sinon.stub().returns(['custom Step 1', 'custom Step 2']),
      },
    ];

    it('should scaffold component with default template', () => {
      const outputFolderPath = 'output/path';
      const componentName = 'MyComponent';
      const templateName = 'default';
      const template = templates.filter((t) => t.name === 'default')[0];
      existsStub.withArgs(outputFolderPath).returns(false);
      scaffoldComponent(outputFolderPath, componentName, templateName, templates);

      expect(template.generateTemplate.calledWith(componentName)).to.be.true;
      expect(
        writeFileStub.calledWith(
          path.join(outputFolderPath, `${componentName}.${template.fileExtension}`),
          template.generateTemplate(),
          'utf8'
        )
      ).to.be.true;
      expect(consoleLogStub.calledWithMatch(`Scaffolding of ${componentName} complete.`)).to.be
        .true;
      expect(consoleLogStub.calledWithMatch(template.getNextSteps()[0])).to.be.true;
      expect(consoleLogStub.calledWithMatch(template.getNextSteps()[1])).to.be.true;
    });

    it('should scaffold component with byoc template', () => {
      const outputFolderPath = 'output/path';
      const componentName = 'MyByocComponent';
      const templateName = 'byoc';
      const template = templates.filter((t) => t.name === 'byoc')[0];
      existsStub.withArgs(outputFolderPath).returns(false);

      scaffoldComponent(outputFolderPath, componentName, templateName, templates);

      expect(template.generateTemplate.calledWith(componentName)).to.be.true;
      expect(
        writeFileStub.calledWith(
          path.join(outputFolderPath, `${componentName}.${template.fileExtension}`),
          template.generateTemplate(),
          'utf8'
        )
      ).to.be.true;
      expect(consoleLogStub.calledWithMatch(`Scaffolding of ${componentName} complete.`)).to.be.be
        .true;
      expect(consoleLogStub.calledWithMatch(template.getNextSteps()[0])).to.be.true;
      expect(consoleLogStub.calledWithMatch(template.getNextSteps()[1])).to.be.true;
    });

    it('should scaffold component with custom template', () => {
      const outputFolderPath = 'output/path';
      const componentName = 'MyCustomComponent';
      const templateName = 'customTemplate';
      const template = templates.filter((t) => t.name === templateName)[0];
      existsStub.withArgs(outputFolderPath).returns(false);

      scaffoldComponent(outputFolderPath, componentName, templateName, templates);

      expect(template.generateTemplate.calledWith(componentName)).to.be.true;
      expect(
        writeFileStub.calledWith(
          path.join(outputFolderPath, `${componentName}.${template.fileExtension}`),
          template.generateTemplate(),
          'utf8'
        )
      ).to.be.true;
      expect(consoleLogStub.calledWithMatch(`Scaffolding of ${componentName} complete.`)).to.be.be
        .true;
      expect(consoleLogStub.calledWithMatch(template.getNextSteps()[0])).to.be.true;
      expect(consoleLogStub.calledWithMatch(template.getNextSteps()[1])).to.be.true;
    });

    it('should throw an error if template is not found', () => {
      const outputFilePath = 'output/path';
      const componentName = 'MyComponent';
      const templateName = 'nonexistent';

      expect(() =>
        scaffoldComponent(outputFilePath, componentName, templateName, templates)
      ).to.throw(`Template ${templateName} not found.`);
    });
  });
});
