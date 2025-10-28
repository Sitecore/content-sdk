/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { getComponentList } from './components';
import { ComponentFile } from '../../../tools';
import path from 'path';

describe('components', () => {
  const sandbox = sinon.createSandbox();
  beforeEach(() => {
    sandbox.restore();
  });

  describe('getComponentList', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should return results when one of "paths" is a glob pattern', () => {
      const items = [
        {
          importPath: 'src/test-data/components/Bar',
          filePath: path.normalize('src/test-data/components/Bar.tsx'),
          componentName: 'Bar',
          moduleName: 'Bar',
        },
      ];

      const result = getComponentList(['src/test-data/components/*.tsx']);
      expect(result).to.deep.equal(items);
    });

    it('should return results with all folded paths when path is a non-glob path', () => {
      const items = [
        {
          importPath: 'src/test-data/components/Qux',
          filePath: path.normalize('src/test-data/components/Qux.js'),
          componentName: 'Qux',
          moduleName: 'Qux',
        },
        {
          importPath: 'src/test-data/components/Foo',
          filePath: path.normalize('src/test-data/components/Foo.jsx'),
          componentName: 'Foo',
          moduleName: 'Foo',
        },
        {
          importPath: 'src/test-data/components/Baz',
          filePath: path.normalize('src/test-data/components/Baz.ts'),
          componentName: 'Baz',
          moduleName: 'Baz',
        },
        {
          importPath: 'src/test-data/components/Bar',
          filePath: path.normalize('src/test-data/components/Bar.tsx'),
          componentName: 'Bar',
          moduleName: 'Bar',
        },
        {
          importPath: 'src/test-data/components/folded/Folded',
          filePath: path.normalize('src/test-data/components/folded/Folded.tsx'),
          componentName: 'Folded',
          moduleName: 'Folded',
        },
      ] as ComponentFile[];

      const result = getComponentList(['src/test-data/components']);
      expect(result).to.deep.equal(items);
    });

    it('should filter out results that are not components', () => {
      const items = [
        {
          importPath: 'src/test-data/components/Qux',
          filePath: path.normalize('src/test-data/components/Qux.js'),
          componentName: 'Qux',
          moduleName: 'Qux',
        },
        {
          importPath: 'src/test-data/components/Foo',
          filePath: path.normalize('src/test-data/components/Foo.jsx'),
          componentName: 'Foo',
          moduleName: 'Foo',
        },
        {
          importPath: 'src/test-data/components/Baz',
          filePath: path.normalize('src/test-data/components/Baz.ts'),
          componentName: 'Baz',
          moduleName: 'Baz',
        },
        {
          importPath: 'src/test-data/components/Bar',
          filePath: path.normalize('src/test-data/components/Bar.tsx'),
          componentName: 'Bar',
          moduleName: 'Bar',
        },
        {
          importPath: 'src/test-data/components/folded/Folded',
          filePath: path.normalize('src/test-data/components/folded/Folded.tsx'),
          componentName: 'Folded',
          moduleName: 'Folded',
        },
      ] as ComponentFile[];

      const result = getComponentList(['src/test-data/components/**/*']);
      expect(result).to.deep.equal(items);
    });

    it('should return result when "paths" contain exact paths to jsx, tsx, ts and js components', () => {
      const items = [
        {
          importPath: 'src/test-data/components/Foo',
          filePath: path.normalize('src/test-data/components/Foo.jsx'),
          componentName: 'Foo',
          moduleName: 'Foo',
        },
        {
          importPath: 'src/test-data/components/Bar',
          filePath: path.normalize('src/test-data/components/Bar.tsx'),
          componentName: 'Bar',
          moduleName: 'Bar',
        },
        {
          importPath: 'src/test-data/components/Baz',
          filePath: path.normalize('src/test-data/components/Baz.ts'),
          componentName: 'Baz',
          moduleName: 'Baz',
        },
        {
          importPath: 'src/test-data/components/Qux',
          filePath: path.normalize('src/test-data/components/Qux.js'),
          componentName: 'Qux',
          moduleName: 'Qux',
        },
      ];

      const result = getComponentList([
        'src/test-data/components/Foo.jsx',
        'src/test-data/components/Bar.tsx',
        'src/test-data/components/Baz.ts',
        'src/test-data/components/Qux.js',
      ]);
      expect(result).to.deep.equal(items);
    });

    it('should return filtered results when "exclude" contains a glob pattern', () => {
      const exclude = ['**/components/**'];
      expect(getComponentList(['src/test-data/components/*.tsx'], exclude)).to.be.empty;
    });

    it('should return filtered results when "exclude" contains an exact path', () => {
      const exclude = ['src/test-data/components/Foo.jsx'];
      getComponentList(['src/test-data/components/*.tsx'], exclude);
    });

    it('should return correct result in unix file systems', () => {
      const stubbedPaths = [
        'src/test-data/components/Foo.jsx',
        'src/test-data/components/Bar.tsx',
        'src/test-data/components/Baz.ts',
        'src/test-data/components/Qux.js',
      ];
      const expected = [
        {
          importPath: 'src/test-data/components/Foo',
          filePath: 'src/test-data/components/Foo.jsx',
          componentName: 'Foo',
          moduleName: 'Foo',
        },
        {
          importPath: 'src/test-data/components/Bar',
          filePath: 'src/test-data/components/Bar.tsx',
          componentName: 'Bar',
          moduleName: 'Bar',
        },
        {
          importPath: 'src/test-data/components/Baz',
          filePath: 'src/test-data/components/Baz.ts',
          componentName: 'Baz',
          moduleName: 'Baz',
        },
        {
          importPath: 'src/test-data/components/Qux',
          filePath: 'src/test-data/components/Qux.js',
          componentName: 'Qux',
          moduleName: 'Qux',
        },
      ];

      const globSyncStub = sandbox.stub(require('glob'), 'sync').returns(stubbedPaths);

      const result = getComponentList(['src/test-data/components/*.tsx']);
      expect(result).to.deep.equal(expected);

      globSyncStub.restore();
    });

    it('should return correct result in windows file systems', () => {
      const stubbedPaths = [
        'src\\test-data\\components\\Foo.jsx',
        'src\\test-data\\components\\Bar.tsx',
        'src\\test-data\\components\\Baz.ts',
        'src\\test-data\\components\\Qux.js',
      ];
      const expected = [
        {
          importPath: 'src/test-data/components/Foo',
          filePath: 'src\\test-data\\components\\Foo.jsx',
          componentName: 'Foo',
          moduleName: 'Foo',
        },
        {
          importPath: 'src/test-data/components/Bar',
          filePath: 'src\\test-data\\components\\Bar.tsx',
          componentName: 'Bar',
          moduleName: 'Bar',
        },
        {
          importPath: 'src/test-data/components/Baz',
          filePath: 'src\\test-data\\components\\Baz.ts',
          componentName: 'Baz',
          moduleName: 'Baz',
        },
        {
          importPath: 'src/test-data/components/Qux',
          filePath: 'src\\test-data\\components\\Qux.js',
          componentName: 'Qux',
          moduleName: 'Qux',
        },
      ];

      const globSyncStub = sandbox.stub(require('glob'), 'sync').returns(stubbedPaths);

      const result = getComponentList(['src/test-data/components/*.tsx']);
      expect(result).to.deep.equal(expected);

      globSyncStub.restore();
    });
  });
});
