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

  const comp = (
    filePath: string,
    importPath: string,
    moduleName: string,
    componentName: string,
    componentType?: ComponentType
  ): ComponentSource => ({ filePath, importPath, moduleName, componentName, componentType });

  describe('groupComponentsByDirAndPrefix', () => {
    it('groups by directory and base prefix; sets base vs neighbors', () => {
      const files: ComponentSource[] = [
        comp(
          'src/components/home/PromoBlock.tsx',
          'src/components/home/PromoBlock',
          'PromoBlock',
          'PromoBlock'
        ),
        comp(
          'src/components/home/PromoBlock.but-cooler.tsx',
          'src/components/home/PromoBlock.but-cooler',
          'PromoBlockbutcooler',
          'PromoBlock.but-cooler'
        ),
        comp(
          'src/components/home/PromoBlock.extra.tsx',
          'src/components/home/PromoBlock.extra',
          'PromoBlockextra',
          'PromoBlock.extra'
        ),
        comp('src/components/home/Hero.tsx', 'src/components/home/Hero', 'Hero', 'Hero', 'client'),
        comp(
          'src/components/home/Hero.dark.tsx',
          'src/components/home/Hero.dark',
          'Herodark',
          'Hero.dark'
        ),
        comp('src/components/common/Badge.tsx', 'src/components/common/Badge', 'Badge', 'Badge'),
      ];

      const groups = groupComponentsByDirAndPrefix(files);
      expect(groups).to.have.length(3);

      const promo = groups.find((g) => g.prefix === 'PromoBlock') as ComponentGroup;
      expect(promo?.dir).to.equal('src/components/home');
      expect(promo?.base?.componentName).to.equal('PromoBlock');
      expect(promo?.neighbors.map((n) => n.componentName)).to.deep.equal([
        'PromoBlock.but-cooler',
        'PromoBlock.extra',
      ]);

      const hero = groups.find((g) => g.prefix === 'Hero') as ComponentGroup;
      expect(hero?.dir).to.equal('src/components/home');
      expect(hero?.base?.componentName).to.equal('Hero');
      expect(hero?.neighbors.map((n) => n.componentName)).to.deep.equal(['Hero.dark']);

      const badge = groups.find((g) => g.prefix === 'Badge') as ComponentGroup;
      expect(badge?.dir).to.equal('src/components/common');
      expect(badge?.base?.componentName).to.equal('Badge');
      expect(badge?.neighbors).to.have.length(0);
    });

    it('normalizes Windows-style backslashes in dir', () => {
      const files: ComponentSource[] = [
        comp('src\\components\\home\\Teaser.tsx', 'src/components/home/Teaser', 'Teaser', 'Teaser'),
        comp(
          'src\\components\\home\\Teaser.v1.tsx',
          'src/components/home/Teaser.v1',
          'Teaserv1',
          'Teaser.v1'
        ),
      ];
      const groups = groupComponentsByDirAndPrefix(files);
      expect(groups).to.have.length(1);
      expect(groups[0].dir).to.equal('src/components/home'); // normalized
      expect(groups[0].prefix).to.equal('Teaser');
      expect(groups[0].base?.componentName).to.equal('Teaser');
      expect(groups[0].neighbors.map((n) => n.componentName)).to.deep.equal(['Teaser.v1']);
    });

    it('handles group with no base (only neighbors)', () => {
      const files: ComponentSource[] = [
        comp(
          'src/components/home/Only.extra.tsx',
          'src/components/home/Only.extra',
          'Onlyextra',
          'Only.extra'
        ),
        comp(
          'src/components/home/Only.dev.tsx',
          'src/components/home/Only.dev',
          'Onlydev',
          'Only.dev'
        ),
      ];
      const groups = groupComponentsByDirAndPrefix(files);
      expect(groups).to.have.length(1);
      const g = groups[0];
      expect(g.prefix).to.equal('Only');
      expect(g.base).to.be.undefined;
      expect(g.neighbors.map((n) => n.componentName)).to.deep.equal(['Only.extra', 'Only.dev']);
    });
  });

  describe('groupComponentsWithVariants', () => {
    it('builds imports and spreads: neighbors first, base last; key is prefix', () => {
      const files: ComponentSource[] = [
        comp(
          'src/components/home/PromoBlock.tsx',
          'src/components/home/PromoBlock',
          'PromoBlock',
          'PromoBlock'
        ),
        comp(
          'src/components/home/PromoBlock.but-cooler.tsx',
          'src/components/home/PromoBlock.but-cooler',
          'PromoBlockbutcooler',
          'PromoBlock.but-cooler'
        ),
        comp(
          'src/components/home/PromoBlock.extra.tsx',
          'src/components/home/PromoBlock.extra',
          'PromoBlockextra',
          'PromoBlock.extra'
        ),
      ];

      const entries = groupComponentsWithVariants(files);
      expect(entries).to.have.length(1);

      const e = entries[0];
      expect(e.key).to.equal('PromoBlock');

      expect(e.imports).to.deep.equal([
        "import * as PromoBlockbutcooler from 'src/components/home/PromoBlock.but-cooler';",
        "import * as PromoBlockextra from 'src/components/home/PromoBlock.extra';",
        "import * as PromoBlock from 'src/components/home/PromoBlock';",
      ]);

      expect(e.valueExpr.replace(/\s+/g, ' ')).to.equal(
        '{ ...PromoBlockbutcooler, ...PromoBlockextra, ...PromoBlock }'.replace(/\s+/g, ' ')
      );

      expect(e.annotateClient).to.equal(false);
    });

    it('sets annotateClient when base is client', () => {
      const files: ComponentSource[] = [
        comp('src/components/home/Hero.tsx', 'src/components/home/Hero', 'Hero', 'Hero', 'client'),
        comp(
          'src/components/home/Hero.dark.tsx',
          'src/components/home/Hero.dark',
          'Herodark',
          'Hero.dark'
        ),
      ];

      const entries = groupComponentsWithVariants(files);
      expect(entries).to.have.length(1);

      const entry = entries[0];
      expect(entry.key).to.equal('Hero');
      expect(entry.imports).to.deep.equal([
        "import * as Herodark from 'src/components/home/Hero.dark';",
        "import * as Hero from 'src/components/home/Hero';",
      ]);
      expect(entry.valueExpr).to.equal('{ ...Herodark, ...Hero }');
      expect(entry.annotateClient).to.equal(true);
    });

    it('emits entry even when base is missing (neighbors only)', () => {
      const files: ComponentSource[] = [
        comp(
          'src/components/home/Only.extra.tsx',
          'src/components/home/Only.extra',
          'Onlyextra',
          'Only.extra'
        ),
      ];
      const entries = groupComponentsWithVariants(files);
      expect(entries).to.have.length(1);
      const entry = entries[0];
      expect(entry.key).to.equal('Only');
      expect(entry.imports).to.deep.equal([
        "import * as Onlyextra from 'src/components/home/Only.extra';",
      ]);
      expect(entry.valueExpr).to.equal('{ ...Onlyextra }');
      expect(entry.annotateClient).to.equal(false);
    });
  });

  describe('groupComponentsWithoutVariants', () => {
    it('returns one entry per file with direct namespace import and moduleName value', () => {
      const files: ComponentSource[] = [
        comp('src/components/common/Badge.tsx', 'src/components/common/Badge', 'Badge', 'Badge'),
        comp('src/components/home/Hero.tsx', 'src/components/home/Hero', 'Hero', 'Hero', 'client'),
      ];
      const entries = groupComponentsWithoutVariants(files);
      expect(entries).to.deep.equal([
        {
          key: 'Badge',
          imports: ["import * as Badge from 'src/components/common/Badge';"],
          annotateClient: false,
          valueExpr: 'Badge',
        },
        {
          key: 'Hero',
          imports: ["import * as Hero from 'src/components/home/Hero';"],
          annotateClient: true,
          valueExpr: 'Hero',
        },
      ]);
    });
  });
});
