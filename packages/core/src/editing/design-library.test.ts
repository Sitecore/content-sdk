/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import {
  updateComponentHandler,
  getDesignLibraryStatusEvent,
  DesignLibraryStatus,
  getDesignLibraryScriptLink,
  isDesignLibraryMode,
  getDesignLibraryComponentPropsEvent,
  getDesignLibraryImportMapEvent,
  addComponentPreviewHandler,
} from './design-library';
import testComponent from '../test-data/component-editing-data';
import { SITECORE_EDGE_URL_DEFAULT } from '../constants';
import { DesignLibraryMode } from './models';

describe('component library utils', () => {
  const debugSpy = sinon.spy(console, 'debug');
  describe('updateComponentHandler', () => {
    it('should abort when origin is empty', () => {
      const message = new MessageEvent('message');
      updateComponentHandler(message, testComponent);
      expect(debugSpy.called).to.be.false;
    });

    xit('should abort when origin is not allowed', () => {
      // TODO implement when security hardening in place
      expect(true).to.be.true;
    });

    it('should abort when message is not component:update', () => {
      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: { name: 'component:degrade' },
      });
      updateComponentHandler(message, testComponent);
      expect(debugSpy.called).to.be.false;
    });

    it('should abort when uid is empty', () => {
      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: { name: 'component:update' },
      });
      updateComponentHandler(message, testComponent);
      expect(debugSpy.callCount).to.be.equal(1);
      expect(
        debugSpy.calledWith(
          'Received component:update event without uid, aborting event handler...'
        )
      ).to.be.true;
    });

    it('should append params and fields for component', () => {
      const changedComponent = JSON.parse(JSON.stringify(testComponent));
      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: {
          name: 'component:update',
          details: {
            uid: 'test-content',
            fields: {
              extra: 'I am extra',
            },
            params: {
              newparam: 12,
            },
          },
        },
      });
      const expectedFields = { ...changedComponent.fields, extra: 'I am extra' };
      const expectedParams = { ...changedComponent.params, newparam: 12 };
      updateComponentHandler(message, changedComponent);
      expect(changedComponent.fields).to.deep.equal(expectedFields);
      expect(changedComponent.params).to.deep.equal(expectedParams);
    });

    it('should replace params and fields for component', () => {
      const changedComponent = JSON.parse(JSON.stringify(testComponent));
      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: {
          name: 'component:update',
          details: {
            uid: 'test-content',
            fields: {
              content: {
                value: 'new content',
              },
            },
            params: {
              nine: 'ten',
            },
          },
        },
      });
      const expectedFields = {
        ...changedComponent.fields,
        content: {
          value: 'new content',
        },
      };
      const expectedParams = { nine: 'ten' };
      updateComponentHandler(message, changedComponent);
      expect(changedComponent.fields).to.deep.equal(expectedFields);
      expect(changedComponent.params).to.deep.equal(expectedParams);
    });

    it('should not update fields or params when update fields and params are undefined', () => {
      const changedComponent = JSON.parse(JSON.stringify(testComponent));
      changedComponent.fields = undefined;
      changedComponent.params = undefined;
      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: {
          name: 'component:update',
          details: {
            uid: 'test-content',
          },
        },
      });
      updateComponentHandler(message, changedComponent);
      expect(changedComponent.fields).to.be.undefined;
      expect(changedComponent.params).to.be.undefined;
    });

    it('should debug log when component not found', () => {
      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: {
          name: 'component:update',
          details: {
            uid: 'no-content',
          },
        },
      });
      updateComponentHandler(message, testComponent);
      expect(debugSpy.callCount).to.be.equal(1);
      const callArgs = debugSpy.getCall(0).args;
      expect(callArgs).to.deep.equal(['Rendering with uid %s not found', 'no-content']);
    });

    it('should call callback when component found and updated', () => {
      const changedComponent = JSON.parse(JSON.stringify(testComponent));
      const callbackStub = sinon.stub();
      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: {
          name: 'component:update',
          details: {
            uid: 'test-content',
          },
        },
      });
      updateComponentHandler(message, changedComponent, callbackStub);
      expect(callbackStub.called).to.be.true;
    });
  });

  describe('addComponentPreviewHandler', () => {
    let windowSpy: sinon.SinonSpy;
    let addEventListenerSpy: sinon.SinonSpy;
    let removeEventListenerSpy: sinon.SinonSpy;
    let callbackStub: sinon.SinonStub;

    beforeEach(() => {
      addEventListenerSpy = sinon.spy();
      removeEventListenerSpy = sinon.spy();
      global.window = {} as any;
      windowSpy = sinon.stub(global, 'window' as any).value({
        addEventListener: addEventListenerSpy,
        removeEventListener: removeEventListenerSpy,
      });
      callbackStub = sinon.stub();
    });

    afterEach(() => {
      windowSpy.restore();
    });

    it('should add event listener for message events', () => {
      const unsubscribe = addComponentPreviewHandler(callbackStub);
      expect(addEventListenerSpy.calledOnce).to.be.true;
      expect(addEventListenerSpy.calledWith('message')).to.be.true;
      expect(typeof unsubscribe).to.equal('function');
    });

    it('should ignore events without origin', () => {
      addComponentPreviewHandler(callbackStub);
      const handler = addEventListenerSpy.getCall(0).args[1];
      const message = new MessageEvent('message', {
        data: { name: 'component:generation:component-preview' },
      });
      handler(message);
      expect(callbackStub.called).to.be.false;
    });

    it('should ignore events with wrong event name', () => {
      addComponentPreviewHandler(callbackStub);
      const handler = addEventListenerSpy.getCall(0).args[1];
      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: { name: 'component:test' },
      });
      handler(message);
      expect(callbackStub.called).to.be.false;
    });

    it('should ignore events without data', () => {
      addComponentPreviewHandler(callbackStub);
      const handler = addEventListenerSpy.getCall(0).args[1];
      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: null,
      });
      handler(message);
      expect(callbackStub.called).to.be.false;
    });

    it('should handle valid component preview events', () => {
      addComponentPreviewHandler(callbackStub);
      const handler = addEventListenerSpy.getCall(0).args[1];
      const eventData = {
        name: 'component:generation:component-preview',
        message: {
          uid: 'test-uid',
          code: {},
          styles: {},
          imports: {},
        },
      };
      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: eventData,
      });

      handler(message);

      expect(debugSpy.calledWith('Component Library: message received', eventData)).to.be.true;
      expect(callbackStub.calledOnce).to.be.true;
      expect(callbackStub.calledWith(null)).to.be.true;
    });

    it('should unsubscribe from component preview event', () => {
      const unsubscribe = addComponentPreviewHandler(callbackStub);

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
          importsMap: [{ module: 'react', exports: [{ name: 'default', value: 'React' }] }],
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

  describe('getDesignLibraryStatusEvent', () => {
    it('should return a valid status event', () => {
      const statusEvent = getDesignLibraryStatusEvent(DesignLibraryStatus.READY, 'uid-1');
      expect(statusEvent).to.deep.equal({
        name: 'component:status',
        message: {
          status: DesignLibraryStatus.READY,
          uid: 'uid-1',
        },
      });
    });
  });

  describe('getDesignLibraryScriptLink', () => {
    it('should return the default design library script link when no URL is provided', () => {
      const scriptLink = getDesignLibraryScriptLink();
      expect(scriptLink).to.equal(
        `${SITECORE_EDGE_URL_DEFAULT}/v1/files/designlibrary/lib/rh-lib-script.js`
      );
    });

    it('should handle trailing slash in sitecoreEdgeUrl', () => {
      const customUrlWithSlash = 'https://custom-designlibrary.com/';
      const scriptLink = getDesignLibraryScriptLink(customUrlWithSlash);
      expect(scriptLink).to.equal(
        'https://custom-designlibrary.com/v1/files/designlibrary/lib/rh-lib-script.js'
      );
    });

    it('should return the correct script link when a custom URL is provided', () => {
      const customUrl = 'https://custom-designlibrary.com';
      const scriptLink = getDesignLibraryScriptLink(customUrl);
      expect(scriptLink).to.equal(`${customUrl}/v1/files/designlibrary/lib/rh-lib-script.js`);
    });
  });

  describe('isDesignLibraryMode', () => {
    it('should return true for DesignLibraryMode.Normal', () => {
      expect(isDesignLibraryMode(DesignLibraryMode.Normal)).to.be.true;
    });

    it('should return true for DesignLibraryMode.Metadata', () => {
      expect(isDesignLibraryMode(DesignLibraryMode.Metadata)).to.be.true;
    });

    it('should return false for other values', () => {
      expect(isDesignLibraryMode('invalid')).to.be.false;
    });
  });

  afterEach(() => {
    debugSpy.resetHistory();
  });
});
