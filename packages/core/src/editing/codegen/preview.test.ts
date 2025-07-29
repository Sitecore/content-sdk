/* eslint-disable quotes */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import {
  getDesignLibraryComponentPropsEvent,
  getDesignLibraryImportMapEvent,
  addComponentPreviewHandler,
  ImportEntry,
  ComponentImport,
  buildComponentDependencies,
  getDesignLibraryComponentPreviewErrorEvent,
  DesignLibraryPreviewError,
  ComponentPreviewEventArgs,
} from './preview';

describe('design library codegen', () => {
  let debugSpy: sinon.SinonSpy;
  let errorSpy: sinon.SinonSpy;

  beforeEach(() => {
    debugSpy = sinon.spy(console, 'debug');
    errorSpy = sinon.spy(console, 'error');
  });

  afterEach(() => {
    errorSpy.restore();
    debugSpy.restore();
  });

  describe('addComponentPreviewHandler', () => {
    let documentSpy: sinon.SinonSpy;
    let windowSpy: sinon.SinonSpy;
    let addEventListenerSpy: sinon.SinonSpy;
    let removeEventListenerSpy: sinon.SinonSpy;
    let callbackStub: sinon.SinonStub;
    let appendChildSpy: sinon.SinonStub;
    let getElementByIdSpy: sinon.SinonStub;
    let setAttributeSpy: sinon.SinonStub;
    let createElementSpy: sinon.SinonStub;
    let postMessageSpy: sinon.SinonStub;
    let removeSpy: sinon.SinonStub;

    const useMemoFn = sinon.stub();
    const useCallbackFn = sinon.stub();
    const useStateFn = sinon.stub();
    const NextImage = sinon.stub();
    const stylesModule = sinon.stub();

    const importMap: ImportEntry[] = [
      {
        module: 'react',
        exports: [
          { name: 'useMemo', value: useMemoFn },
          { name: 'useCallback', value: useCallbackFn },
          { name: 'useState', value: useStateFn },
        ],
      },
      {
        module: 'next/image',
        exports: [{ name: 'Image', value: NextImage }],
      },
    ];

    const code = `
    const Component = (props) => {
      console.log(useMemoFn, useCallback, useStateFn, NextImage, stylesModule);
      return {
        value: 'Test',
        useMemoFn,
        useCallback,
        useStateFn,
        NextImage,
        stylesModule,
      }
    }

    exports.Component = Component;
    `;

    const corruptedCode = `
    const Component = (props) => {
      console.log(useMemoFn, useCallback, useStateFn, NextImage, stylesModule, notExistingVariable);
      return {
        value: 'Test',
        useMemoFn,
        useCallback,
        useStateFn,
        NextImage,
        stylesModule,
        notExistingVariable
      }
    }

    exports.Component = NotExistingComponent;
    `;

    const previewMessage: ComponentPreviewEventArgs = {
      name: 'component:generation:component-preview',
      message: {
        uid: 'test-uid',
        code: {
          type: 'function',
          content: code,
        },
        styles: {
          type: 'style-element',
          content: 'body { background-color: red; }',
          styleImport: {
            name: 'stylesModule',
            content: stylesModule,
          },
        },
        imports: [
          { module: 'react', export: 'useMemo', alias: 'useMemoFn' },
          { module: 'react', export: 'useCallback', alias: 'useCallback' },
          { module: 'react', export: 'useState', alias: 'useStateFn' },
          { module: 'next/image', export: 'Image', alias: 'NextImage' },
        ],
      },
    };

    const corruptedPreviewMessage: ComponentPreviewEventArgs = {
      ...previewMessage,
      message: {
        ...previewMessage.message,
        code: {
          type: 'function',
          content: corruptedCode,
        },
      },
    };

    beforeEach(() => {
      addEventListenerSpy = sinon.spy();
      removeEventListenerSpy = sinon.spy();
      appendChildSpy = sinon.stub();
      getElementByIdSpy = sinon.stub();
      setAttributeSpy = sinon.stub();
      removeSpy = sinon.stub();
      createElementSpy = sinon.stub().returns({
        setAttribute: setAttributeSpy,
      });
      postMessageSpy = sinon.stub();
      global.window = {} as any;
      windowSpy = sinon.stub(global, 'window' as any).value({
        addEventListener: addEventListenerSpy,
        removeEventListener: removeEventListenerSpy,
        parent: {
          postMessage: postMessageSpy,
        },
      });
      global.document = {} as any;
      documentSpy = sinon.stub(global, 'document' as any).value({
        head: {
          appendChild: appendChildSpy,
        },
        createElement: createElementSpy,
        getElementById: getElementByIdSpy,
      });
      callbackStub = sinon.stub();
    });

    afterEach(() => {
      windowSpy.restore();
      documentSpy.restore();
    });

    it('should add event listener for message events', () => {
      const unsubscribe = addComponentPreviewHandler(importMap, callbackStub);
      expect(addEventListenerSpy.calledOnce).to.be.true;
      expect(addEventListenerSpy.calledWith('message')).to.be.true;
      expect(typeof unsubscribe).to.equal('function');
    });

    it('should ignore events without origin', () => {
      addComponentPreviewHandler(importMap, callbackStub);
      const handler = addEventListenerSpy.getCall(0).args[1];
      const message = new MessageEvent('message', {
        data: previewMessage,
      });

      handler(message);

      expect(debugSpy.called).to.be.false;
      expect(callbackStub.called).to.be.false;
    });

    it('should ignore events with wrong event name', () => {
      addComponentPreviewHandler(importMap, callbackStub);
      const handler = addEventListenerSpy.getCall(0).args[1];
      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: { name: 'component:test' },
      });

      handler(message);

      expect(debugSpy.called).to.be.false;
      expect(callbackStub.called).to.be.false;
    });

    it('should ignore events without data', () => {
      addComponentPreviewHandler(importMap, callbackStub);
      const handler = addEventListenerSpy.getCall(0).args[1];
      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: null,
      });

      handler(message);

      expect(debugSpy.called).to.be.false;
      expect(callbackStub.called).to.be.false;
    });

    it('should handle valid component preview event', () => {
      addComponentPreviewHandler(importMap, callbackStub);
      const handler = addEventListenerSpy.getCall(0).args[1];
      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: previewMessage,
      });

      handler(message);

      expect(debugSpy.calledWith('Component Library: message received', previewMessage)).to.be.true;

      expect(createElementSpy.calledOnceWith('style')).to.be.true;
      const styleElement = createElementSpy.getCall(0).returnValue;
      expect(styleElement.innerHTML).to.equal('body { background-color: red; }');
      expect(appendChildSpy.calledOnceWith(styleElement)).to.be.true;

      expect(callbackStub.calledOnce).to.be.true;
      expect(callbackStub.calledWith(null, sinon.match.func)).to.be.true;

      const generatedComponent = callbackStub.getCall(0).args[1];

      expect(callbackStub.getCall(0).args[0]).to.be.null;
      expect(generatedComponent()).to.deep.equal({
        value: 'Test',
        useMemoFn,
        useCallback: useCallbackFn,
        useStateFn,
        NextImage,
        stylesModule,
      });
    });

    it('should not insert style element if it already exists', () => {
      getElementByIdSpy.returns({
        remove: removeSpy,
      });

      addComponentPreviewHandler(importMap, callbackStub);
      const handler = addEventListenerSpy.getCall(0).args[1];
      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: previewMessage,
      });

      handler(message);

      expect(getElementByIdSpy.calledOnceWith('content-sdk-style-preview')).to.be.true;

      expect(removeSpy.calledOnce).to.be.true;

      expect(debugSpy.calledWith('Component Library: message received', previewMessage)).to.be.true;

      expect(createElementSpy.calledOnceWith('style')).to.be.true;
      const styleElement = createElementSpy.getCall(0).returnValue;
      expect(styleElement.innerHTML).to.equal('body { background-color: red; }');
      expect(appendChildSpy.calledOnceWith(styleElement)).to.be.true;

      expect(callbackStub.calledOnce).to.be.true;
      expect(callbackStub.calledWith(null, sinon.match.func)).to.be.true;

      const generatedComponent = callbackStub.getCall(0).args[1];

      expect(callbackStub.getCall(0).args[0]).to.be.null;
      expect(generatedComponent()).to.deep.equal({
        value: 'Test',
        useMemoFn,
        useCallback: useCallbackFn,
        useStateFn,
        NextImage,
        stylesModule,
      });
    });

    it('should send error when component fails to initialze', () => {
      addComponentPreviewHandler(importMap, callbackStub);
      const handler = addEventListenerSpy.getCall(0).args[1];
      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: corruptedPreviewMessage,
      });

      handler(message);

      expect(debugSpy.calledWith('Component Library: message received', corruptedPreviewMessage)).to
        .be.true;

      const errorLogArgs = errorSpy.getCall(0).args;
      expect(errorLogArgs[0]).to.equal('Component Library: sending error event');

      const errorEvent = errorLogArgs[1];

      expect(errorEvent.name).to.equal('component:generation:component-preview-error');
      expect(errorEvent.message.uid).to.equal('test-uid');
      expect(errorEvent.message.error.toString()).to.include(
        'ReferenceError: NotExistingComponent is not defined'
      );
      expect(errorEvent.message.type).to.equal(DesignLibraryPreviewError.RenderInit);

      expect(callbackStub.calledOnce).to.be.true;
      expect(callbackStub.getCall(0).args[0]).to.be.instanceOf(Error);
      expect(callbackStub.getCall(0).args[1]).to.be.null;

      expect(postMessageSpy.calledOnce).to.be.true;
      expect(postMessageSpy.calledWith(errorEvent, '*')).to.be.true;
    });

    it('should send error when component dependencies are missing', () => {
      addComponentPreviewHandler(
        [{ module: 'react', exports: [{ name: 'useMemo', value: useMemoFn }] }],
        callbackStub
      );
      const handler = addEventListenerSpy.getCall(0).args[1];
      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: corruptedPreviewMessage,
      });

      handler(message);

      expect(debugSpy.calledWith('Component Library: message received', corruptedPreviewMessage)).to
        .be.true;

      const errorLogArgs = errorSpy.getCall(0).args;
      expect(errorLogArgs[0]).to.equal('Component Library: sending error event');

      const errorEvent = errorLogArgs[1];

      expect(errorEvent.name).to.equal('component:generation:component-preview-error');
      expect(errorEvent.message.uid).to.equal('test-uid');
      expect(errorEvent.message.error.toString()).to.include(
        [
          "Missing module: 'next/image' with alias: 'NextImage'\n",
          "Missing export: 'useCallback' from module: 'react'\n",
          "Missing export: 'useState' from module: 'react' with alias: 'useStateFn'\n",
        ].join('')
      );
      expect(errorEvent.message.type).to.equal(DesignLibraryPreviewError.RenderInit);

      expect(callbackStub.calledOnce).to.be.true;
      expect(callbackStub.getCall(0).args[1]).to.be.null;

      expect(postMessageSpy.calledOnce).to.be.true;
      expect(postMessageSpy.calledWith(errorEvent, '*')).to.be.true;
    });

    it('should unsubscribe from component preview event', () => {
      const unsubscribe = addComponentPreviewHandler(importMap, callbackStub);

      if (unsubscribe) {
        unsubscribe();
      }

      expect(removeEventListenerSpy.calledOnce).to.be.true;
      expect(removeEventListenerSpy.calledWith('message')).to.be.true;
    });
  });

  describe('getDesignLibraryImportMapEvent', () => {
    it('should return a valid import map event', () => {
      const importMapEvent = getDesignLibraryImportMapEvent('uid-1', [
        {
          module: 'react',
          exports: [{ name: 'default', value: 'React' }],
        },
      ]);

      expect(importMapEvent).to.deep.equal({
        name: 'component:generation:import-map',
        message: {
          uid: 'uid-1',
          importMap: [{ module: 'react', exports: ['default'] }],
        },
      });
    });
  });

  describe('getDesignLibraryComponentPropsEvent', () => {
    it('should return a valid component props event', () => {
      const componentPropsEvent = getDesignLibraryComponentPropsEvent(
        'uid-1',
        {
          content: { value: 'test' },
        },
        {
          param1: 'value1',
        }
      );

      expect(componentPropsEvent).to.deep.equal({
        name: 'component:generation:component-props',
        message: {
          uid: 'uid-1',
          fields: {
            content: { value: 'test' },
          },
          parameters: {
            param1: 'value1',
          },
        },
      });
    });
  });

  describe('buildComponentDependencies', () => {
    it('should return the correct dependencies', () => {
      const useMemoStub = sinon.stub();
      const useCallbackStub = sinon.stub();
      const nextImageStub = sinon.stub();

      const componentImports: ComponentImport[] = [
        { module: 'react', export: 'useMemo', alias: 'useMemoFn' },
        { module: 'react', export: 'useCallback', alias: 'useCallback' },
        { module: 'next/image', export: 'Image', alias: 'NextImage' },
      ];
      const importMap: ImportEntry[] = [
        {
          module: 'react',
          exports: [
            { name: 'useMemo', value: useMemoStub },
            { name: 'useCallback', value: useCallbackStub },
            { name: 'useState', value: () => {} },
          ],
        },
        {
          module: 'next/image',
          exports: [{ name: 'Image', value: nextImageStub }],
        },
      ];
      const dependencies = buildComponentDependencies(componentImports, importMap);
      expect(dependencies.successful).to.deep.equal([
        { name: 'useMemoFn', value: useMemoStub },
        { name: 'useCallback', value: useCallbackStub },
        { name: 'NextImage', value: nextImageStub },
      ]);
      expect(dependencies.missing.modules).to.deep.equal([]);
      expect(dependencies.missing.exports).to.deep.equal([]);
    });

    it('should return an empty array when no component imports are provided', () => {
      const componentImports: ComponentImport[] = [];
      const importMap: ImportEntry[] = [
        {
          module: 'react',
          exports: [{ name: 'default', value: { test: true } }],
        },
      ];
      const dependencies = buildComponentDependencies(componentImports, importMap);
      expect(dependencies.missing.modules).to.deep.equal([]);
      expect(dependencies.missing.exports).to.deep.equal([]);
      expect(dependencies.successful).to.deep.equal([]);
    });

    it('should handle when no export is found in the import map', () => {
      const componentImports: ComponentImport[] = [
        { module: 'react', export: 'useMemo', alias: 'useMemoFn' },
      ];
      const importMap: ImportEntry[] = [
        { module: 'react', exports: [{ name: 'useCallback', value: () => {} }] },
      ];
      const dependencies = buildComponentDependencies(componentImports, importMap);
      expect(dependencies.successful).to.deep.equal([]);
      expect(dependencies.missing.modules).to.deep.equal([]);
      expect(dependencies.missing.exports).to.deep.equal([
        {
          module: 'react',
          export: 'useMemo',
          alias: 'useMemoFn',
        },
      ]);
    });

    it('should handle when no module is found in the import map', () => {
      const componentImports: ComponentImport[] = [
        { module: 'react', export: 'useMemo', alias: 'useMemoFn' },
      ];
      const importMap: ImportEntry[] = [
        { module: 'vue', exports: [{ name: 'render', value: () => {} }] },
      ];
      const dependencies = buildComponentDependencies(componentImports, importMap);
      expect(dependencies.successful).to.deep.equal([]);
      expect(dependencies.missing.modules).to.deep.equal([
        {
          module: 'react',
          alias: 'useMemoFn',
        },
      ]);
      expect(dependencies.missing.exports).to.deep.equal([]);
    });
  });

  describe('getDesignLibraryComponentPreviewErrorEvent', () => {
    it('should return a valid component preview "render" error event', () => {
      const errorEvent = getDesignLibraryComponentPreviewErrorEvent(
        'uid-1',
        'custom-error',
        DesignLibraryPreviewError.Render
      );
      expect(errorEvent).to.deep.equal({
        name: 'component:generation:component-preview-error',
        message: { uid: 'uid-1', error: 'custom-error', type: DesignLibraryPreviewError.Render },
      });
    });

    it('should return a valid component preview "render-init" error event', () => {
      const errorEvent = getDesignLibraryComponentPreviewErrorEvent(
        'uid-1',
        'custom-error',
        DesignLibraryPreviewError.RenderInit
      );

      expect(errorEvent).to.deep.equal({
        name: 'component:generation:component-preview-error',
        message: {
          uid: 'uid-1',
          error: 'custom-error',
          type: DesignLibraryPreviewError.RenderInit,
        },
      });
    });
  });
});
