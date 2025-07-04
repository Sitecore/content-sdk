/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import * as td from 'testdouble';

describe('components', () => {
  afterEach(() => {
    td.reset();
  });

  describe('getComponentList', () => {
    it('should return correct result in unix file systems', async () => {
      const stubbedPaths = [
        'src/test-data/components/Foo.jsx',
        'src/test-data/components/Bar.tsx',
        'src/test-data/components/Baz.ts',
        'src/test-data/components/Qux.js',
      ];
      const expected = [
        { path: 'src/test-data/components/Foo', componentName: 'Foo', moduleName: 'Foo' },
        { path: 'src/test-data/components/Bar', componentName: 'Bar', moduleName: 'Bar' },
        { path: 'src/test-data/components/Baz', componentName: 'Baz', moduleName: 'Baz' },
        { path: 'src/test-data/components/Qux', componentName: 'Qux', moduleName: 'Qux' },
      ];

      const glob = await td.replaceEsm('glob');
      td.when(glob.sync('src/test-data/components/*.tsx', { ignore: undefined })).thenReturn(
        stubbedPaths
      );

      const componentsModule = await import('./components.js');
      const result = componentsModule.getComponentList(['src/test-data/components/*.tsx']);

      expect(result).to.deep.equal(expected);
    });

    it('should return correct result in windows file systems', async () => {
      const stubbedPaths = [
        'src\\test-data\\components\\Foo.jsx',
        'src\\test-data\\components\\Bar.tsx',
        'src\\test-data\\components\\Baz.ts',
        'src\\test-data\\components\\Qux.js',
      ];
      const expected = [
        { path: 'src/test-data/components/Foo', componentName: 'Foo', moduleName: 'Foo' },
        { path: 'src/test-data/components/Bar', componentName: 'Bar', moduleName: 'Bar' },
        { path: 'src/test-data/components/Baz', componentName: 'Baz', moduleName: 'Baz' },
        { path: 'src/test-data/components/Qux', componentName: 'Qux', moduleName: 'Qux' },
      ];

      const glob = await td.replaceEsm('glob');
      td.when(glob.sync('src/test-data/components/*.tsx', { ignore: undefined })).thenReturn(
        stubbedPaths
      );

      const componentsModule = await import('./components.js');
      const result = componentsModule.getComponentList(['src/test-data/components/*.tsx']);

      expect(result).to.deep.equal(expected);
    });
  });
});
