/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import {
  updateComponentHandler,
  getDesignLibraryStatusEvent,
  DesignLibraryStatus,
  getDesignLibraryScriptLink,
  isDesignLibraryMode,
  postToDL,
  validateEvent,
} from './design-library';
import testComponent from '../test-data/component-editing-data';
import { SITECORE_EDGE_URL_DEFAULT } from '../constants';
import { DesignLibraryMode } from './models';

describe('component library utils', () => {
  let debugSpy: sinon.SinonSpy;

  beforeEach(() => {
    debugSpy = sinon.spy(console, 'debug');
  });

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

  describe('postToDL', () => {
    let originalWindow: any;
    let logSpy: sinon.SinonSpy;
    let errorSpy: sinon.SinonSpy;
    const statusReadyEvent = 'component:status:ready';

    beforeEach(() => {
      logSpy = sinon.spy(console, 'log');
      errorSpy = sinon.spy(console, 'error');
      originalWindow = (global as any).window;
    });

    afterEach(() => {
      logSpy.restore();
      errorSpy.restore();
      (global as any).window = originalWindow;
    });

    it('should return when window is undefined', () => {
      (global as any).window = undefined;
      postToDL({ name: statusReadyEvent });
      expect(logSpy.called).to.be.false;
      expect(errorSpy.called).to.be.false;
    });

    it('should post message to parent when parent is different from window', () => {
      const parentPost = sinon.stub();
      (global as any).window = {
        parent: { postMessage: parentPost },
        postMessage: sinon.stub(),
      };
      postToDL({ name: statusReadyEvent, message: { status: 'ready', uid: 'x' } });
      expect(logSpy.calledOnce).to.be.true;
      expect(parentPost.calledOnce).to.be.true;
      const args = parentPost.getCall(0).args[0];
      expect(args).to.deep.include({ name: statusReadyEvent });
    });

    it('should post message to window when parent equals window', () => {
      const winPost = sinon.stub();
      const win: any = { postMessage: winPost };
      win.parent = win;
      (global as any).window = win;
      postToDL({ name: statusReadyEvent });
      expect(winPost.calledOnce).to.be.true;
    });

    it('should log error when postMessage throws', () => {
      const throwingParent = { postMessage: sinon.stub().throws(new Error('fail')) };
      (global as any).window = {
        parent: throwingParent,
        postMessage: sinon.stub(),
      };
      postToDL({ name: statusReadyEvent });
      expect(errorSpy.calledOnce).to.be.true;
      const errArg = errorSpy.getCall(0).args[1];
      expect((errArg as Error).message).to.equal('fail');
    });
  });

  describe('validateEvent', () => {
    const statusRenderedEvent = 'component:status:render';

    it('should return true for valid event', () => {
      const evt = new MessageEvent('message', {
        origin: 'http://localhost',
        data: { name: statusRenderedEvent },
      });
      expect(validateEvent(evt, statusRenderedEvent)).to.be.true;
    });

    it('should return false when name mismatches without logging (wildcard origin)', () => {
      const evt = new MessageEvent('message', {
        origin: 'http://localhost',
        data: { name: 'other:event' },
      });
      expect(validateEvent(evt, statusRenderedEvent)).to.be.false;
      expect(debugSpy.called).to.be.false;
    });

    it('should return false when data missing', () => {
      const evt = new MessageEvent('message', {
        origin: 'http://localhost',
      });
      expect(validateEvent(evt, statusRenderedEvent)).to.be.false;
      expect(debugSpy.called).to.be.false;
    });

    it('should return false when origin missing', () => {
      const evt = { origin: '', data: { name: statusRenderedEvent } } as any;
      expect(validateEvent(evt, statusRenderedEvent)).to.be.false;
      expect(debugSpy.called).to.be.false;
    });
  });

  afterEach(() => {
    debugSpy.restore();
  });
});
