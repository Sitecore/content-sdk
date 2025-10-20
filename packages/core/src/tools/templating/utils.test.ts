/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { getItems, matchPath } from './utils';
import {
  groupComponentsWithVariants,
  groupComponentsWithoutVariants,
  groupComponentsByDirAndPrefix,
} from './utils';
import { ComponentSource, ComponentGroup, ComponentType } from './components';

describe('utils', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('matchPath', () => {
    it('should return true when both paths are matching relative path', () => {
      const relPath = 'src/components/Button.tsx';
      expect(matchPath(relPath, relPath)).to.be.true;
    });

    it('should return true if componentPath is relative and matches to absolute "compare" path', () => {
      const relPath = 'src/components/Button.tsx';
      const absPath = path.join(process.cwd(), relPath);
      expect(matchPath(relPath, absPath)).to.be.true;
    });

    it('should return true if "compare" path is relative and matches to absolute componentPath', () => {
      const relPath = 'src/components/Button.tsx';
      const absPath = path.join(process.cwd(), relPath);
      expect(matchPath(absPath, relPath)).to.be.true;
    });

    it('should return true if "compare" is a matching regex string', () => {
      const componentPath = 'src/components/Button.tsx';
      const regexString = 'Button\\.tsx$';
      expect(matchPath(componentPath, regexString)).to.be.true;
    });

    it('should return false if paths do not match', () => {
      const componentPath = 'src/components/Button.tsx';
      const comparePath = 'src/components/Link.tsx';
      expect(matchPath(componentPath, comparePath)).to.be.false;
    });
  });

  describe('getItems', () => {
    afterEach(() => {
      sinon.restore();
    });

    const baseDirent = {
      isFile: function (): boolean {
        return false;
      },
      isDirectory: function (): boolean {
        return false;
      },
      isBlockDevice: function (): boolean {
        return false;
      },
      isCharacterDevice: function (): boolean {
        return false;
      },
      isSymbolicLink: function (): boolean {
        return false;
      },
      isFIFO: function (): boolean {
        return false;
      },
      isSocket: function (): boolean {
        return false;
      },
      name: '',
      path: '',
    };

    const setupFolderTest = (path: string) => {
      const callbackStub = sinon.stub();
      return {
        input: {
          path: path,
          resolveItem: (_: any, name: string) => {
            return name;
          },
          cb: callbackStub,
        },
        parentDir: {
          ...baseDirent,
          isDirectory: () => true,
          name: 'parent',
          parentPath: 'mockparent',
        },
        childFile: {
          ...baseDirent,
          isFile: () => true,
          name: 'child.tsx',
          parentPath: 'mockparent',
        },
        resolveItemCb: callbackStub,
      };
    };

    it('should return empty array when path does not exist', () => {
      const path = 'C:/Windows';
      const input = {
        path: path,
        resolveItem: () => {},
        cb: () => {},
      };
      const existsSyncStub = sinon.stub(fs, 'existsSync').returns(false);
      const result = getItems(input);

      expect(existsSyncStub.calledWith(path)).to.equal(true);
      expect(result).to.deep.equal([]);
    });

    it('should check folders recursively', () => {
      const path = 'C:/Windows';
      const { input, parentDir, childFile } = setupFolderTest(path);
      sinon.stub(fs, 'existsSync').returns(true);
      const readDirStub = sinon.stub(fs, 'readdirSync');
      readDirStub.withArgs(path, { withFileTypes: true }).returns([parentDir]);
      readDirStub.withArgs(`${path}/parent`, { withFileTypes: true }).returns([childFile]);

      const result = getItems(input);

      expect(result).to.deep.equal(['child']);
    });

    it('should invoke callback on files only', () => {
      const path = 'C:/Windows';
      const { input, parentDir, childFile, resolveItemCb } = setupFolderTest(path);
      sinon.stub(fs, 'existsSync').returns(true);
      const readDirStub = sinon.stub(fs, 'readdirSync');
      readDirStub.withArgs(path, { withFileTypes: true }).returns([parentDir]);
      readDirStub.withArgs(`${path}/parent`, { withFileTypes: true }).returns([childFile]);

      getItems(input);

      expect(resolveItemCb.calledWith('parent')).to.equal(false);
      expect(resolveItemCb.calledWith('child')).to.equal(true);
    });

    it('should exclude path that match the exclude param', () => {
      const testPath = 'C:/Windows';
      const input = {
        path: testPath,
        resolveItem: () => {},
        cb: () => {},
        exclude: [testPath],
      };
      const existsSyncStub = sinon.stub(fs, 'existsSync').returns(true);
      const result = getItems(input);

      expect(existsSyncStub.calledWith(testPath)).to.equal(true);
      expect(result).to.deep.equal([]);
    });
  });
});
