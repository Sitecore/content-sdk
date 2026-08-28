/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import {
  getComponentList,
  filterComponentsByType,
  toPascalCase,
  buildVariantSiblingIndex,
  isVariantComponent,
} from './components';
import { ComponentFile, ComponentFileWithType } from './components';
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
          componentName: 'Hero',
          filePath: path.normalize('src/test-data/components/Hero.tsx'),
          importPath: 'src/test-data/components/Hero',
          moduleName: 'Hero',
        },
        {
          importPath: 'src/test-data/components/Bar',
          filePath: path.normalize('src/test-data/components/Bar.tsx'),
          componentName: 'Bar',
          moduleName: 'Bar',
        },
      ];

      const result = getComponentList(['src/test-data/components/*.tsx'], ['**/*.test.*'], false);
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
          componentName: 'Hero',
          filePath: path.normalize('src/test-data/components/Hero.tsx'),
          importPath: 'src/test-data/components/Hero',
          moduleName: 'Hero',
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

      const result = getComponentList(['src/test-data/components'], ['**/*.test.*'], false);
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
          componentName: 'Hero',
          filePath: path.normalize('src/test-data/components/Hero.tsx'),
          importPath: 'src/test-data/components/Hero',
          moduleName: 'Hero',
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

      const result = getComponentList(['src/test-data/components/**/*'], [], false);
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

    it('should return variants in results when includeVariants is true', () => {
      sandbox.stub(console, 'debug');

      const items = [
        {
          importPath: 'src/test-data/components/Qux',
          filePath: path.normalize('src/test-data/components/Qux.js'),
          componentName: 'Qux',
          moduleName: 'Qux',
        },
        // variant component
        {
          importPath: 'src/test-data/components/Hero.variant',
          filePath: path.normalize('src/test-data/components/Hero.variant.tsx'),
          componentName: 'Hero.variant',
          moduleName: 'Herovariant',
        },
        {
          componentName: 'Hero',
          filePath: path.normalize('src/test-data/components/Hero.tsx'),
          importPath: 'src/test-data/components/Hero',
          moduleName: 'Hero',
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

      const result = getComponentList(['src/test-data/components'], ['**/*.test.*'], true);
      expect(result).to.deep.equal(items);
    });

    it('should only strip variants when both variant and non-variant component names are present', () => {
      sandbox.stub(console, 'debug');

      const result = getComponentList(['src/test-data/component-variants'], ['**/*.test.*'], false);
      expect(result).to.deep.equal([
        {
          importPath: 'src/test-data/component-variants/qux.component',
          filePath: path.normalize('src/test-data/component-variants/qux.component.ts'),
          componentName: 'Qux.component',
          moduleName: 'Quxcomponent',
        },
        {
          importPath: 'src/test-data/component-variants/foo.component',
          filePath: path.normalize('src/test-data/component-variants/foo.component.ts'),
          componentName: 'Foo.component',
          moduleName: 'Foocomponent',
        },
        {
          componentName: 'Baz',
          filePath: path.normalize('src/test-data/component-variants/Baz.ts'),
          importPath: 'src/test-data/component-variants/Baz',
          moduleName: 'Baz',
        },
      ]);
    });

    it('should strip a variant when the non-variant component is at the same path', () => {
      const stubbedPaths = [
        path.normalize('src/components/Hero.tsx'),
        path.normalize('src/components/Hero.variant.tsx'),
      ];
      const globSyncStub = sandbox.stub(require('glob'), 'sync').returns(stubbedPaths);

      const result = getComponentList(['src/components/*.tsx'], ['**/*.test.*'], false);
      expect(result).to.deep.equal([
        {
          importPath: 'src/components/Hero',
          filePath: path.normalize('src/components/Hero.tsx'),
          componentName: 'Hero',
          moduleName: 'Hero',
        },
      ]);

      globSyncStub.restore();
    });

    it('should keep a variant-named component when the non-variant is at a different path', () => {
      const stubbedPaths = [
        path.normalize('src/features/Hero.tsx'),
        path.normalize('src/widgets/Hero.variant.tsx'),
      ];
      const globSyncStub = sandbox.stub(require('glob'), 'sync').returns(stubbedPaths);

      const result = getComponentList(['src/**/*.tsx'], ['**/*.test.*'], false);
      expect(result).to.deep.equal([
        {
          importPath: 'src/features/Hero',
          filePath: path.normalize('src/features/Hero.tsx'),
          componentName: 'Hero',
          moduleName: 'Hero',
        },
        // kept: shares Hero's base name but lives at a different path, so it is not a variant
        {
          importPath: 'src/widgets/Hero.variant',
          filePath: path.normalize('src/widgets/Hero.variant.tsx'),
          componentName: 'Hero.variant',
          moduleName: 'Herovariant',
        },
      ]);

      globSyncStub.restore();
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

  describe('toPascalCase', () => {
    it('should convert kebab-case to PascalCase', () => {
      expect(toPascalCase('my-component')).to.equal('MyComponent');
      expect(toPascalCase('my-long-component-name')).to.equal('MyLongComponentName');
    });

    it('should convert snake_case to PascalCase', () => {
      expect(toPascalCase('my_component')).to.equal('MyComponent');
      expect(toPascalCase('my_long_component_name')).to.equal('MyLongComponentName');
    });

    it('should capitalize the first letter of a camelCase string', () => {
      expect(toPascalCase('myComponent')).to.equal('MyComponent');
      expect(toPascalCase('myLongComponentName')).to.equal('MyLongComponentName');
    });

    it('should leave a PascalCase string unchanged', () => {
      expect(toPascalCase('MyComponent')).to.equal('MyComponent');
    });

    it('should handle mixed delimiters', () => {
      expect(toPascalCase('my-component_name')).to.equal('MyComponentName');
    });

    it('should capitalize a single lowercase word', () => {
      expect(toPascalCase('component')).to.equal('Component');
    });
  });

  describe('filterComponentsByType', () => {
    const mockComponents: ComponentFileWithType[] = [
      {
        filePath: 'client.tsx',
        importPath: './client',
        moduleName: 'ClientComp',
        componentName: 'ClientComp',
        componentType: 'client',
      },
      {
        filePath: 'server.tsx',
        importPath: './server',
        moduleName: 'ServerComp',
        componentName: 'ServerComp',
        componentType: 'server',
      },
      {
        filePath: 'universal.tsx',
        importPath: './universal',
        moduleName: 'UniversalComp',
        componentName: 'UniversalComp',
        componentType: 'universal',
      },
    ];

    it('should filter components by single type', () => {
      const result = filterComponentsByType(mockComponents, ['client']);
      expect(result).to.have.lengthOf(1);
      expect(result[0].componentType).to.equal('client');
    });

    it('should filter components by multiple types', () => {
      const result = filterComponentsByType(mockComponents, ['client', 'universal']);
      expect(result).to.have.lengthOf(2);
      expect(result.map((c) => c.componentType)).to.include.members(['client', 'universal']);
    });

    it('should return empty array when no matches', () => {
      const result = filterComponentsByType(mockComponents, ['nonexistent' as any]);
      expect(result).to.be.empty;
    });

    it('should return all components when all types specified', () => {
      const result = filterComponentsByType(mockComponents, ['client', 'server', 'universal']);
      expect(result).to.have.lengthOf(3);
    });
  });

  describe('isVariantComponent (shared variant detection)', () => {
    it('treats a plain (dotless) name as a base component, not a variant', () => {
      const index = buildVariantSiblingIndex([
        { componentName: 'Promo', importPathNoExt: 'src/components/Promo' },
      ]);
      expect(isVariantComponent('Promo', 'src/components/Promo', index)).to.equal(false);
    });

    it('treats a dotted name WITH a base sibling as a variant', () => {
      const index = buildVariantSiblingIndex([
        { componentName: 'Promo', importPathNoExt: 'src/components/Promo' },
        { componentName: 'Promo.Cooler', importPathNoExt: 'src/components/Promo.Cooler' },
      ]);
      expect(isVariantComponent('Promo.Cooler', 'src/components/Promo.Cooler', index)).to.equal(
        true
      );
    });

    it('treats a dotted name WITHOUT a base sibling as a component (e.g. Angular foo.component)', () => {
      // Only `content-block.component` resolved — there is no base `content-block` sibling.
      const index = buildVariantSiblingIndex([
        {
          componentName: 'content-block.component',
          importPathNoExt: 'src/app/components/content-block.component',
        },
      ]);
      expect(
        isVariantComponent(
          'content-block.component',
          'src/app/components/content-block.component',
          index
        )
      ).to.equal(false);
    });
  });
});
