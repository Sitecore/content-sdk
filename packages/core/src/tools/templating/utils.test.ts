/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */

import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import { getItems } from './utils';

describe('utils', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('getItems', () => {
    afterEach(() => {
      sinon.restore();
    });

    const baseDirent = {
      isFile: function(): boolean {
        return false;
      },
      isDirectory: function(): boolean {
        return false;
      },
      isBlockDevice: function(): boolean {
        return false;
      },
      isCharacterDevice: function(): boolean {
        return false;
      },
      isSymbolicLink: function(): boolean {
        return false;
      },
      isFIFO: function(): boolean {
        return false;
      },
      isSocket: function(): boolean {
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
  });
});
