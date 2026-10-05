/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import {
  THEME_UPDATE_EVENT_NAME,
  THEME_PREVIEW_STYLE_ID,
  addThemeUpdateHandler,
  applyThemePreviewCss,
} from './theme-preview';

describe('theme preview', () => {
  let debugSpy: sinon.SinonSpy;

  beforeEach(() => {
    debugSpy = sinon.spy(console, 'debug');
  });

  afterEach(() => {
    debugSpy.restore();
  });

  describe('applyThemePreviewCss', () => {
    let documentSpy: sinon.SinonSpy;
    let appendChildSpy: sinon.SinonStub;
    let getElementByIdSpy: sinon.SinonStub;
    let setAttributeSpy: sinon.SinonStub;
    let createElementSpy: sinon.SinonStub;
    let removeSpy: sinon.SinonStub;
    let styleElement: { setAttribute: sinon.SinonStub; textContent?: string };

    beforeEach(() => {
      appendChildSpy = sinon.stub();
      getElementByIdSpy = sinon.stub();
      setAttributeSpy = sinon.stub();
      removeSpy = sinon.stub();
      styleElement = { setAttribute: setAttributeSpy };
      createElementSpy = sinon.stub().returns(styleElement);

      global.document = {} as any;
      documentSpy = sinon.stub(global, 'document' as any).value({
        head: {
          appendChild: appendChildSpy,
        },
        createElement: createElementSpy,
        getElementById: getElementByIdSpy,
      });
    });

    afterEach(() => {
      documentSpy.restore();
    });

    it('should create a style element and append it to head', () => {
      getElementByIdSpy.returns(undefined);

      applyThemePreviewCss('body { color: blue; }');

      expect(removeSpy.notCalled).to.be.true;
      expect(createElementSpy.calledOnceWith('style')).to.be.true;
      expect(setAttributeSpy.calledOnceWith('id', THEME_PREVIEW_STYLE_ID)).to.be.true;
      expect(styleElement.textContent).to.equal('body { color: blue; }');
      expect(appendChildSpy.calledOnceWith(styleElement)).to.be.true;
    });

    it('should remove existing style element before adding the new one', () => {
      getElementByIdSpy.returns({ remove: removeSpy });

      applyThemePreviewCss('body { color: green; }');

      expect(getElementByIdSpy.calledOnceWith(THEME_PREVIEW_STYLE_ID)).to.be.true;
      expect(removeSpy.calledOnce).to.be.true;
      expect(styleElement.textContent).to.equal('body { color: green; }');
      expect(appendChildSpy.calledOnceWith(styleElement)).to.be.true;
    });

    it('should remove the existing style element and not add an empty one when css is an empty string', () => {
      getElementByIdSpy.returns({ remove: removeSpy });

      applyThemePreviewCss('');

      expect(getElementByIdSpy.calledOnceWith(THEME_PREVIEW_STYLE_ID)).to.be.true;
      expect(removeSpy.calledOnce).to.be.true;
      expect(createElementSpy.notCalled).to.be.true;
      expect(appendChildSpy.notCalled).to.be.true;
    });

    it('should not add a style element when css is an empty string and none exists', () => {
      getElementByIdSpy.returns(null);

      applyThemePreviewCss('');

      expect(createElementSpy.notCalled).to.be.true;
      expect(appendChildSpy.notCalled).to.be.true;
    });
  });

  describe('addThemeUpdateHandler', () => {
    it('should return undefined when window is not available', () => {
      const windowSpy = sinon.stub(global, 'window' as any).value(undefined);
      const result = addThemeUpdateHandler();
      expect(result).to.be.undefined;
      windowSpy.restore();
    });

    it('should add event listener for message events', () => {
      const addEventListenerSpy = sinon.spy();
      (global as any).window = {
        addEventListener: addEventListenerSpy,
        removeEventListener: sinon.stub(),
      };

      const unsubscribe = addThemeUpdateHandler();

      expect(addEventListenerSpy.calledOnce).to.be.true;
      expect(addEventListenerSpy.calledWith('message', sinon.match.func)).to.be.true;
      expect(typeof unsubscribe).to.equal('function');
    });

    it('should return unsubscribe function that removes the event listener', () => {
      const removeEventListenerSpy = sinon.spy();
      (global as any).window = {
        addEventListener: sinon.stub(),
        removeEventListener: removeEventListenerSpy,
      };

      const unsubscribe = addThemeUpdateHandler();
      unsubscribe!();

      expect(removeEventListenerSpy.calledOnce).to.be.true;
      expect(removeEventListenerSpy.calledWith('message')).to.be.true;
    });

    it('should ignore events with a different name', () => {
      const addEventListenerSpy = sinon.spy();
      (global as any).window = {
        addEventListener: addEventListenerSpy,
        removeEventListener: sinon.stub(),
      };

      addThemeUpdateHandler();
      const handler = addEventListenerSpy.getCall(0).args[1];

      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: { name: 'component:update', message: { css: 'body { color: red; }' } },
      });

      expect(() => handler(message)).to.not.throw();
    });

    it('should debug log and skip when message.css is not a string', () => {
      const addEventListenerSpy = sinon.spy();
      (global as any).window = {
        addEventListener: addEventListenerSpy,
        removeEventListener: sinon.stub(),
      };

      addThemeUpdateHandler();
      const handler = addEventListenerSpy.getCall(0).args[1];

      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: { name: THEME_UPDATE_EVENT_NAME, message: { css: 123 } },
      });

      handler(message);

      expect(
        debugSpy.calledWith(
          'Theme Preview: event skipped - message.css must be a string, received %o',
          123
        )
      ).to.be.true;
    });

    it('should apply the css from a valid theme-update message', () => {
      const addEventListenerSpy = sinon.spy();
      (global as any).window = {
        addEventListener: addEventListenerSpy,
        removeEventListener: sinon.stub(),
      };

      const appendChildSpy = sinon.stub();
      const setAttributeSpy = sinon.stub();
      const styleElement = { setAttribute: setAttributeSpy };
      global.document = {} as any;
      const documentSpy = sinon.stub(global, 'document' as any).value({
        head: { appendChild: appendChildSpy },
        createElement: sinon.stub().returns(styleElement),
        getElementById: sinon.stub().returns(undefined),
      });

      addThemeUpdateHandler();
      const handler = addEventListenerSpy.getCall(0).args[1];

      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: { name: THEME_UPDATE_EVENT_NAME, message: { css: 'body { color: red; }' } },
      });

      handler(message);

      expect((styleElement as { textContent?: string }).textContent).to.equal(
        'body { color: red; }'
      );
      expect(appendChildSpy.calledOnceWith(styleElement)).to.be.true;

      documentSpy.restore();
    });

    it('should remove the style element without adding an empty one for an empty-css theme-update message', () => {
      const addEventListenerSpy = sinon.spy();
      (global as any).window = {
        addEventListener: addEventListenerSpy,
        removeEventListener: sinon.stub(),
      };

      const appendChildSpy = sinon.stub();
      const createElementSpy = sinon.stub();
      const removeSpy = sinon.stub();
      global.document = {} as any;
      const documentSpy = sinon.stub(global, 'document' as any).value({
        head: { appendChild: appendChildSpy },
        createElement: createElementSpy,
        getElementById: sinon.stub().returns({ remove: removeSpy }),
      });

      addThemeUpdateHandler();
      const handler = addEventListenerSpy.getCall(0).args[1];

      const message = new MessageEvent('message', {
        origin: 'http://localhost',
        data: { name: THEME_UPDATE_EVENT_NAME, message: { css: '' } },
      });

      handler(message);

      expect(removeSpy.calledOnce).to.be.true;
      expect(createElementSpy.notCalled).to.be.true;
      expect(appendChildSpy.notCalled).to.be.true;

      documentSpy.restore();
    });
  });
});
