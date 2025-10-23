/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import {
  getComponentList,
  detectComponentType,
  getComponentListWithTypes,
  filterComponentsByType,
  detectRouterType,
} from './components';
import { ComponentFile, ComponentFileWithType } from './components';
import path from 'path';
import fs from 'fs';

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

      const result = getComponentList(
        ['src/test-data/components/*.tsx'],
        ['**/*.test.*'],
        false,
        false
      );
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

      const result = getComponentList(['src/test-data/components'], ['**/*.test.*'], false, false);
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

      const result = getComponentList(['src/test-data/components'], ['**/*.test.*'], false, true);
      expect(result).to.deep.equal(items);
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

  describe('detectComponentType', () => {
    let readFileSyncStub: sinon.SinonStub;

    beforeEach(() => {
      readFileSyncStub = sandbox.stub(fs, 'readFileSync');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should detect client component from use client directive at top', () => {
      readFileSyncStub.returns(`'use client';
export default function ClientComponent() {
  return <button>Client</button>;
}`);

      const result = detectComponentType('test.tsx');
      expect(result).to.equal('client');
    });

    it('should detect client component with comments before directive', () => {
      readFileSyncStub.returns(`/**
 * This is a client component
 */
'use client';
export default function CommentedClient() {
  return <button>Client</button>;
}`);

      const result = detectComponentType('test.tsx');
      expect(result).to.equal('client');
    });

    it('should NOT detect use client after imports', () => {
      readFileSyncStub.returns(`import React from 'react';
'use client';
export default function InvalidClient() {
  return <div>Should be universal</div>;
}`);

      const result = detectComponentType('test.tsx');
      expect(result).to.equal('universal');
    });

    it('should NOT detect use client in string literals', () => {
      readFileSyncStub.returns(`export default function FakeClient() {
  const directive = 'use client';
  return <div>Contains: {directive}</div>;
}`);

      const result = detectComponentType('test.tsx');
      expect(result).to.equal('universal');
    });

    it('should detect server component from explicit export', () => {
      readFileSyncStub.returns(`export default function ServerComponent() {
  return <div>Server</div>;
}
export const componentType: 'server' = 'server';`);

      const result = detectComponentType('test.tsx');
      expect(result).to.equal('server');
    });

    it('should detect client component from explicit export', () => {
      readFileSyncStub.returns(`export default function ClientComponent() {
  return <div>Client</div>;
}
export const componentType: 'client' = 'client';`);

      const result = detectComponentType('test.tsx');
      expect(result).to.equal('client');
    });

    it('should detect universal component from explicit export', () => {
      readFileSyncStub.returns(`export default function UniversalComponent() {
  return <div>Universal</div>;
}
export const componentType: 'universal' = 'universal';`);

      const result = detectComponentType('test.tsx');
      expect(result).to.equal('universal');
    });

    it('should detect server component from server-only imports', () => {
      readFileSyncStub.returns(`import { headers } from 'next/headers';
export default function HeadersComponent() {
  return <div>Has server imports</div>;
}`);

      const result = detectComponentType('test.tsx');
      expect(result).to.equal('server');
    });

    it('should prioritize explicit export over use client directive', () => {
      readFileSyncStub.returns(`'use client';
export default function OverrideComponent() {
  return <div>Override</div>;
}
export const componentType: 'server' = 'server';`);

      const result = detectComponentType('test.tsx');
      expect(result).to.equal('server');
    });

    it('should default to universal for plain components', () => {
      readFileSyncStub.returns(`export default function PlainComponent() {
  return <div>Plain component</div>;
}`);

      const result = detectComponentType('test.tsx');
      expect(result).to.equal('universal');
    });

    it('should default to server for plain components in App Router', () => {
      readFileSyncStub.returns(`export default function PlainComponent() {
  return <div>Plain component</div>;
}`);

      const result = detectComponentType('test.tsx', 'app');
      expect(result).to.equal('server');
    });

    it('should default to universal for plain components in Pages Router', () => {
      readFileSyncStub.returns(`export default function PlainComponent() {
  return <div>Plain component</div>;
}`);

      const result = detectComponentType('test.tsx', 'pages');
      expect(result).to.equal('universal');
    });

    it('should respect explicit routerType parameter', () => {
      readFileSyncStub.returns(`export default function PlainComponent() {
  return <div>Plain component</div>;
}`);

      const appResult = detectComponentType('test.tsx', 'app');
      const pagesResult = detectComponentType('test.tsx', 'pages');

      expect(appResult).to.equal('server');
      expect(pagesResult).to.equal('universal');
    });

    it('should handle file read errors gracefully', () => {
      readFileSyncStub.throws(new Error('File not found'));

      const result = detectComponentType('nonexistent.tsx');
      expect(result).to.equal('universal');
    });
  });

  describe('detectRouterType', () => {
    let existsSyncStub: sinon.SinonStub;

    beforeEach(() => {
      existsSyncStub = sandbox.stub(fs, 'existsSync');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should detect App Router when src/app exists', () => {
      existsSyncStub.callsFake((pathStr: string) => pathStr.includes('src/app'));

      const result = detectRouterType();
      expect(result).to.equal('app');
    });

    it('should detect App Router when app exists', () => {
      existsSyncStub.callsFake(
        (pathStr: string) => pathStr.includes('/app') && !pathStr.includes('src')
      );

      const result = detectRouterType();
      expect(result).to.equal('app');
    });

    it('should detect Pages Router when src/pages exists', () => {
      existsSyncStub.callsFake((pathStr: string) => pathStr.includes('src/pages'));

      const result = detectRouterType();
      expect(result).to.equal('pages');
    });

    it('should default to Pages Router when neither exists', () => {
      existsSyncStub.returns(false);

      const result = detectRouterType();
      expect(result).to.equal('pages');
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

  describe('getComponentListWithTypes', () => {
    it('should combine component list with type detection', () => {
      // Use actual test data files that exist in the project
      const result = getComponentListWithTypes(['src/test-data/components/*.tsx']);

      // Verify that the result includes components with detected types
      expect(result).to.be.an('array');
      expect(result.length).to.be.greaterThan(0);

      // Each component should have the required properties including componentType
      result.forEach((component) => {
        expect(component).to.have.property('filePath');
        expect(component).to.have.property('importPath');
        expect(component).to.have.property('moduleName');
        expect(component).to.have.property('componentName');
        expect(component).to.have.property('componentType');
        expect(['client', 'server', 'universal']).to.include(component.componentType);
      });
    });
  });
});
