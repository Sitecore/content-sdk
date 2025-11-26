/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { detectComponentType, getComponentListWithTypes, detectRouterType } from './utils';
import fs from 'fs';

describe('Templating Utils', () => {
  const sandbox = sinon.createSandbox();
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
