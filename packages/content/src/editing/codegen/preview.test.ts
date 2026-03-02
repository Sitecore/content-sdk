/* eslint-disable quotes */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import {
  getDesignLibraryComponentPropsEvent,
  getDesignLibraryImportMapEvent,
  addComponentPreviewHandler,
  addServerComponentPreviewHandler,
  ImportEntry,
  ComponentImport,
  buildComponentDependencies,
  getDesignLibraryErrorEvent,
  DesignLibraryPreviewError,
  ComponentPreviewEventArgs,
  addStyleElement,
  createComponentInstance,
  getImportMapInfo,
  isImportEntryInfoArray,
  sendErrorEvent,
  fetchGeneratedComponentFromCache,
  GeneratedComponentData,
} from './preview';
import { NativeDataFetcher } from '@sitecore-content-sdk/core';

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

  describe('component preview event handling', () => {
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
        postMessage: postMessageSpy,
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

    describe('addComponentPreviewHandler', () => {
      it('should return undefined when window is not available', () => {
        windowSpy = sinon.stub(global, 'window' as any).value(undefined);
        const result = addComponentPreviewHandler(importMap, callbackStub);
        expect(result).to.be.undefined;
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

        expect(debugSpy.calledWith('Component Library: message received', previewMessage)).to.be
          .true;

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

        expect(debugSpy.calledWith('Component Library: message received', previewMessage)).to.be
          .true;

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

        expect(debugSpy.calledWith('Component Library: message received', corruptedPreviewMessage))
          .to.be.true;

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

        expect(debugSpy.calledWith('Component Library: message received', corruptedPreviewMessage))
          .to.be.true;

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

    describe('addServerComponentPreviewHandler', () => {
      it('should add event listener for message events', () => {
        const unsubscribe = addServerComponentPreviewHandler(callbackStub);
        expect(addEventListenerSpy.calledOnce).to.be.true;
        expect(addEventListenerSpy.calledWith('message')).to.be.true;
        expect(typeof unsubscribe).to.equal('function');
      });

      it('should ignore events without origin', () => {
        addServerComponentPreviewHandler(callbackStub);
        const handler = addEventListenerSpy.getCall(0).args[1];
        const message = new MessageEvent('message', {
          data: previewMessage,
        });

        handler(message);

        expect(debugSpy.called).to.be.false;
        expect(callbackStub.called).to.be.false;
      });

      it('should ignore events with wrong event name', () => {
        addServerComponentPreviewHandler(callbackStub);
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
        addServerComponentPreviewHandler(callbackStub);
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
        addServerComponentPreviewHandler(callbackStub);
        const handler = addEventListenerSpy.getCall(0).args[1];
        const message = new MessageEvent('message', {
          origin: 'http://localhost',
          data: previewMessage,
        });

        handler(message);

        expect(debugSpy.calledWith('Component Library: message received', previewMessage)).to.be
          .true;

        expect(callbackStub.calledOnce).to.be.true;
        expect(callbackStub.calledWith(previewMessage)).to.be.true;
      });

      it('should unsubscribe from component preview event', () => {
        const unsubscribe = addServerComponentPreviewHandler(callbackStub);

        if (unsubscribe) {
          unsubscribe();
        }

        expect(removeEventListenerSpy.calledOnce).to.be.true;
        expect(removeEventListenerSpy.calledWith('message')).to.be.true;
      });
    });

    describe('addStyleElement', () => {
      it('should add a style element to the document', () => {
        getElementByIdSpy.returns(undefined);

        addStyleElement('body { color: blue; }');

        expect(removeSpy.notCalled).to.be.true;
        expect(createElementSpy.calledOnceWith('style')).to.be.true;
        const styleElement = createElementSpy.getCall(0).returnValue;
        expect(setAttributeSpy.calledOnceWith('id', 'content-sdk-style-preview')).to.be.true;
        expect(styleElement.innerHTML).to.equal('body { color: blue; }');
        expect(appendChildSpy.calledOnceWith(styleElement)).to.be.true;
      });

      it('should remove existing style element before adding a new one', () => {
        getElementByIdSpy.returns({
          remove: removeSpy,
        });

        addStyleElement('body { color: blue; }');

        expect(removeSpy.calledOnce).to.be.true;
        expect(createElementSpy.calledOnceWith('style')).to.be.true;
        const styleElement = createElementSpy.getCall(0).returnValue;
        expect(setAttributeSpy.calledOnceWith('id', 'content-sdk-style-preview')).to.be.true;
        expect(styleElement.innerHTML).to.equal('body { color: blue; }');
        expect(appendChildSpy.calledOnceWith(styleElement)).to.be.true;
      });
    });

    describe('createComponentInstance', () => {
      it('should create a component instance with the provided dependencies', () => {
        const message = new MessageEvent('message', {
          origin: 'http://localhost',
          data: previewMessage,
        });

        const generatedComponent: any = createComponentInstance(importMap, message.data.message);

        expect(generatedComponent()).to.deep.equal({
          value: 'Test',
          useMemoFn,
          useCallback: useCallbackFn,
          useStateFn,
          NextImage,
          stylesModule,
        });
      });

      it('should throw an error if the component fails to initialize', () => {
        const message = new MessageEvent('message', {
          origin: 'http://localhost',
          data: corruptedPreviewMessage,
        });

        expect(() => createComponentInstance(importMap, message.data.message)).to.throw(
          /NotExistingComponent is not defined/
        );
      });

      it('should throw an error if dependencies are missing', () => {
        const message = new MessageEvent('message', {
          origin: 'http://localhost',
          data: corruptedPreviewMessage,
        });

        const expectedMessage = [
          "Missing module: 'next/image' with alias: 'NextImage'\n",
          "Missing export: 'useCallback' from module: 'react'\n",
          "Missing export: 'useState' from module: 'react' with alias: 'useStateFn'\n",
        ].join('');

        expect(() =>
          createComponentInstance(
            [{ module: 'react', exports: [{ name: 'useMemo', value: useMemoFn }] }],
            message.data.message
          )
        ).to.throw(new RegExp(expectedMessage));
      });
    });

    describe('sendErrorEvent', () => {
      const uid = '123-uid';
      const error = 'Test error message';
      const errorType = DesignLibraryPreviewError.Render;

      it('should post error event to parent window if available', () => {
        sendErrorEvent(uid, error, errorType);

        expect(postMessageSpy.calledOnce).to.be.true;
        const eventArg = postMessageSpy.getCall(0).args[0];
        expect(eventArg.name).to.equal('component:generation:component-preview-error');
        expect(eventArg.message.uid).to.equal(uid);
        expect(eventArg.message.error).to.equal(error);
        expect(eventArg.message.type).to.equal(errorType);
        expect(errorSpy.calledOnce).to.be.true;
        expect(errorSpy.getCall(0).args[0]).to.include('Component Library: sending error event');
      });

      it('should post error event to current window if parent is not available', () => {
        (globalThis as any).window.parent = undefined;
        const postMessageCurrentStub = (globalThis as any).window.postMessage;
        const { sendErrorEvent } = require('./preview.ts');
        sendErrorEvent(uid, error, errorType);

        expect(postMessageCurrentStub.calledOnce).to.be.true;
        const eventArg = postMessageCurrentStub.getCall(0).args[0];
        expect(eventArg.name).to.equal('component:generation:component-preview-error');
        expect(eventArg.message.uid).to.equal(uid);
        expect(eventArg.message.error).to.equal(error);
        expect(eventArg.message.type).to.equal(errorType);
        expect(errorSpy.calledOnce).to.be.true;
      });

      it('should not throw if window is undefined', () => {
        delete (globalThis as any).window;
        const { sendErrorEvent } = require('./preview.ts');
        expect(() => sendErrorEvent(uid, error, errorType)).to.not.throw();
        expect(errorSpy.calledOnce).to.be.true;
      });

      it('should use current window when parent equals window', () => {
        const win: any = { postMessage: postMessageSpy };
        win.parent = win;
        (global as any).window = win;

        sendErrorEvent('uid', 'error', DesignLibraryPreviewError.Render);

        expect(postMessageSpy.calledOnce).to.be.true;
      });
    });
  });

  describe('getDesignLibraryImportMapEvent', () => {
    it('should return a valid import map event for ImportEntry[]', () => {
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

    it('should return a valid import map event for ImportEntryInfo[]', () => {
      const isImportEntryInfoArray = getImportMapInfo([
        {
          module: 'react',
          exports: [{ name: 'default', value: 'React' }],
        },
      ]);
      const importMapEvent = getDesignLibraryImportMapEvent('uid-1', isImportEntryInfoArray);

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

    it('should handle empty fields and parameters', () => {
      const event = getDesignLibraryComponentPropsEvent('uid-1', {}, {});
      expect(event.message.fields).to.deep.equal({});
      expect(event.message.parameters).to.deep.equal({});
    });

    it('should use default empty object for fields and parameters when not provided', () => {
      const event = getDesignLibraryComponentPropsEvent('uid-2');

      expect(event.message.fields).to.deep.equal({});
      expect(event.message.parameters).to.deep.equal({});
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

  describe('getDesignLibraryErrorEvent', () => {
    it('should return a valid component preview "render" error event', () => {
      const errorEvent = getDesignLibraryErrorEvent(
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
      const errorEvent = getDesignLibraryErrorEvent(
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

    it('should return valid load import map error event', () => {
      const errorEvent = getDesignLibraryErrorEvent(
        'uid-1',
        'error during loading import map',
        DesignLibraryPreviewError.ImportMapLoad
      );

      expect(errorEvent).to.deep.equal({
        name: 'component:generation:error',
        message: {
          uid: 'uid-1',
          error: 'error during loading import map',
          type: DesignLibraryPreviewError.ImportMapLoad,
        },
      });
    });

    it('should return valid import map missing error event', () => {
      const errorEvent = getDesignLibraryErrorEvent(
        'uid-1',
        'import map is missing',
        DesignLibraryPreviewError.ImportMapMissing
      );
      expect(errorEvent).to.deep.equal({
        name: 'component:generation:error',
        message: {
          uid: 'uid-1',
          error: 'import map is missing',
          type: DesignLibraryPreviewError.ImportMapMissing,
        },
      });
    });

    it('should return valid fetch error event', () => {
      const errorEvent = getDesignLibraryErrorEvent(
        'uid-1',
        'error during fetching component data',
        DesignLibraryPreviewError.GeneratedComponentFetch
      );

      expect(errorEvent).to.deep.equal({
        name: 'component:generation:error',
        message: {
          uid: 'uid-1',
          error: 'error during fetching component data',
          type: DesignLibraryPreviewError.GeneratedComponentFetch,
        },
      });
    });
  });

  describe('getImportMapInfo', () => {
    it('should convert ImportEntry[] to ImportEntryInfo[] with correct module and exports', () => {
      const importMap = [
        {
          module: 'react',
          exports: [
            { name: 'default', value: {} },
            { name: 'useMemo', value: () => {} },
          ],
        },
        {
          module: 'next/image',
          exports: [{ name: 'default', value: {} }],
        },
      ];

      const result = getImportMapInfo(importMap);

      expect(result).to.deep.equal([
        { module: 'react', exports: ['default', 'useMemo'] },
        { module: 'next/image', exports: ['default'] },
      ]);
    });

    it('should handle empty exports array', () => {
      const importMap = [
        {
          module: 'empty-module',
          exports: [],
        },
      ];

      const result = getImportMapInfo(importMap);

      expect(result).to.deep.equal([{ module: 'empty-module', exports: [] }]);
    });

    it('should return an empty array for empty importMap', () => {
      const result = getImportMapInfo([]);
      expect(result).to.deep.equal([]);
    });
  });

  describe('isImportEntryInfoArray', () => {
    it('should return true for valid ImportEntryInfo[]', () => {
      const validArray = [
        { module: 'react', exports: ['default', 'useMemo'] },
        { module: 'next/image', exports: ['default'] },
      ];

      expect(isImportEntryInfoArray(validArray)).to.be.true;
    });

    it('should return false for ImportEntry[]', () => {
      const importEntryArray = [
        {
          module: 'react',
          exports: [
            { name: 'default', value: {} },
            { name: 'useMemo', value: () => {} },
          ],
        },
      ];

      expect(isImportEntryInfoArray(importEntryArray)).to.be.false;
    });

    it('should return false for array with wrong exports type', () => {
      const wrongExportsArray = [{ module: 'react', exports: [123, true] }];
      expect(isImportEntryInfoArray(wrongExportsArray)).to.be.false;
    });

    it('should return false for empty array', () => {
      expect(isImportEntryInfoArray([])).to.be.false;
    });

    it('should return false for non-array input', () => {
      expect(isImportEntryInfoArray(null)).to.be.false;
      expect(isImportEntryInfoArray(undefined)).to.be.false;
      expect(isImportEntryInfoArray({})).to.be.false;
      expect(isImportEntryInfoArray('string')).to.be.false;
    });

    it('should return false when module is not a string', () => {
      expect(isImportEntryInfoArray([{ module: 123, exports: ['default'] }])).to.be.false;
    });

    it('should return false when exports is not an array', () => {
      expect(isImportEntryInfoArray([{ module: 'react', exports: 'default' }])).to.be.false;
    });

    it('should return false when exports contains non-string values', () => {
      expect(isImportEntryInfoArray([{ module: 'react', exports: [123, {}] }])).to.be.false;
    });
  });

  describe('fetchGeneratedComponentFromCache', () => {
    let fetchStub: sinon.SinonStub;
    let nativeDataFetcherStub: sinon.SinonStub;

    const testId = 'test-component-id-123';
    const testToken = 'test-jwt-token';
    const testEdgeUrl = 'https://test-edge.sitecorecloud.io';
    const defaultEdgeUrl = 'https://edge-platform.sitecorecloud.io';

    const mockComponentData: GeneratedComponentData = {
      uid: 'test-uid',
      code: {
        type: 'function',
        content: 'const Component = () => {}',
      },
      styles: {
        type: 'style-element',
        content: '.test { color: red; }',
        styleImport: {
          name: 'styles',
          content: {},
        },
      },
      imports: [],
    };

    beforeEach(() => {
      fetchStub = sinon.stub();
      nativeDataFetcherStub = sinon.stub(NativeDataFetcher.prototype, 'fetch').callsFake(fetchStub);
    });

    afterEach(() => {
      nativeDataFetcherStub.restore();
    });

    it('should successfully fetch component data with status 200', async () => {
      fetchStub.resolves({
        status: 200,
        statusText: 'OK',
        data: {
          id: testId,
          content: JSON.stringify(mockComponentData),
        },
      });

      const result = await fetchGeneratedComponentFromCache(testId, testToken, testEdgeUrl);

      expect(result).to.deep.equal(mockComponentData);
      expect(fetchStub.calledOnce).to.be.true;
      expect(
        fetchStub.calledWith(`${testEdgeUrl}/authoring/api/v1/components/cache/${testId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${testToken}`,
          },
        })
      ).to.be.true;
    });

    it('should use default edge URL when not provided', async () => {
      fetchStub.resolves({
        status: 200,
        statusText: 'OK',
        data: {
          id: testId,
          content: JSON.stringify(mockComponentData),
        },
      });

      const result = await fetchGeneratedComponentFromCache(testId, testToken);

      expect(result).to.deep.equal(mockComponentData);
      expect(fetchStub.calledOnce).to.be.true;
      const callArgs = fetchStub.getCall(0).args[0];
      expect(callArgs).to.equal(`${defaultEdgeUrl}/authoring/api/v1/components/cache/${testId}`);
    });

    it('should throw error when status is not 200', async () => {
      fetchStub.resolves({
        status: 404,
        statusText: 'Not Found',
        data: undefined,
      });

      try {
        await fetchGeneratedComponentFromCache(testId, testToken, testEdgeUrl);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.equal(
          `Failed to fetch generated component data from cache for id: ${testId}. Response Status: 404, Response Status Text: Not Found`
        );
      }
    });

    it('should throw error when fetch rejects', async () => {
      const testError = new Error('Network error');
      fetchStub.rejects(testError);

      try {
        await fetchGeneratedComponentFromCache(testId, testToken, testEdgeUrl);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.equal(testError);
      }
    });

    it('should throw error for 500 server error', async () => {
      fetchStub.resolves({
        status: 500,
        statusText: 'Internal Server Error',
        data: undefined,
      });

      try {
        await fetchGeneratedComponentFromCache(testId, testToken, testEdgeUrl);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.equal(
          `Failed to fetch generated component data from cache for id: ${testId}. Response Status: 500, Response Status Text: Internal Server Error`
        );
      }
    });

    it('should throw error for 401 unauthorized error', async () => {
      fetchStub.resolves({
        status: 401,
        statusText: 'Unauthorized',
        data: undefined,
      });

      try {
        await fetchGeneratedComponentFromCache(testId, testToken, testEdgeUrl);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.equal(
          `Failed to fetch generated component data from cache for id: ${testId}. Response Status: 401, Response Status Text: Unauthorized`
        );
      }
    });

    it('should construct correct URL with id parameter', async () => {
      const customId = 'custom-component-id-456';
      fetchStub.resolves({
        status: 200,
        statusText: 'OK',
        data: {
          id: customId,
          content: JSON.stringify(mockComponentData),
        },
      });

      await fetchGeneratedComponentFromCache(customId, testToken, testEdgeUrl);

      const callArgs = fetchStub.getCall(0).args[0];
      expect(callArgs).to.equal(`${testEdgeUrl}/authoring/api/v1/components/cache/${customId}`);
    });

    it('should pass correct authorization header with token', async () => {
      const customToken = 'custom-jwt-token-xyz';
      fetchStub.resolves({
        status: 200,
        statusText: 'OK',
        data: {
          id: testId,
          content: JSON.stringify(mockComponentData),
        },
      });

      await fetchGeneratedComponentFromCache(testId, customToken, testEdgeUrl);

      const callArgs = fetchStub.getCall(0).args[1];
      expect(callArgs.headers.Authorization).to.equal(`Bearer ${customToken}`);
    });

    it('should use GET method for fetch request', async () => {
      fetchStub.resolves({
        status: 200,
        statusText: 'OK',
        data: {
          id: testId,
          content: JSON.stringify(mockComponentData),
        },
      });

      await fetchGeneratedComponentFromCache(testId, testToken, testEdgeUrl);

      const callArgs = fetchStub.getCall(0).args[1];
      expect(callArgs.method).to.equal('GET');
    });
  });
});
