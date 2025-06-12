/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { getComponentList } from './components';
import { ComponentFile } from '../../../tools';

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
        { path: 'src/test-data/components/Bar', componentName: 'Bar', moduleName: 'Bar' },
      ];

      const result = getComponentList(['src/test-data/components/*.tsx']);
      expect(result).to.deep.equal(items);
    });

    it('should return results when path is a non-glob path', () => {
      const items = [
        { path: 'src/test-data/components/Qux', componentName: 'Qux', moduleName: 'Qux' },
        { path: 'src/test-data/components/Foo', componentName: 'Foo', moduleName: 'Foo' },
        { path: 'src/test-data/components/Baz', componentName: 'Baz', moduleName: 'Baz' },
        { path: 'src/test-data/components/Bar', componentName: 'Bar', moduleName: 'Bar' },
      ] as ComponentFile[];

      const result = getComponentList(['src/test-data/components']);
      expect(result).to.deep.equal(items);
    });

    it('should return result when "paths" contain exact paths to jsx, tsx, ts and js components', () => {
      const items = [
        { path: 'src/test-data/components/Foo', componentName: 'Foo', moduleName: 'Foo' },
        { path: 'src/test-data/components/Bar', componentName: 'Bar', moduleName: 'Bar' },
        { path: 'src/test-data/components/Baz', componentName: 'Baz', moduleName: 'Baz' },
        { path: 'src/test-data/components/Qux', componentName: 'Qux', moduleName: 'Qux' },
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
  });
});
