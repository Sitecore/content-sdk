import { expect } from 'chai';
import sinon from 'sinon';
import nock from 'nock';
import { JSDOM } from 'jsdom';
import * as td from 'testdouble';
import { getEdgeProxyFormsUrl } from '../client/index.js';

describe('form', () => {
  let dom: JSDOM;
  let formEvent: sinon.SinonStub;
  let formModule: any;

  process.env.DEBUG = 'sitecore-jss:form';

  beforeEach(async () => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'http://localhost',
      runScripts: 'dangerously',
    });
    global.document = dom.window.document;

    formEvent = sinon.stub();

    await td.replaceEsm('@sitecore-cloudsdk/events/browser', {
      form: formEvent,
    });

    formModule = await import('./form.js');
  });

  afterEach(() => {
    nock.cleanAll();
    sinon.restore();
    td.reset();
  });

  describe('loadForm', () => {
    it('should load form', async () => {
      nock(getEdgeProxyFormsUrl('contextId', 'formId', 'https://bar.com'))
        .get('')
        .query({ sitecoreContextId: 'contextId' })
        .reply(200, 'form data');

      const result = await formModule.loadForm('contextId', 'formId', 'https://bar.com');

      expect(result).to.equal('form data');
    });

    it('should throw error if form loading fails', async () => {
      nock(getEdgeProxyFormsUrl('contextId', 'formId', 'https://bar.com'))
        .get('')
        .query({ sitecoreContextId: 'contextId' })
        .reply(500);

      try {
        await formModule.loadForm('contextId', 'formId', 'https://bar.com');
      } catch (error) {
        expect(error).to.be.an('error');
      }
    });
  });

  describe('executeScriptElements', () => {
    it('should execute script elements', () => {
      const form = global.document.createElement('form');
      const script = global.document.createElement('script');
      script.text = 'console.log("test")';

      global.document.body.appendChild(form);

      form.appendChild(script);

      const consoleLogSpy = sinon.spy(console, 'log');

      formModule.executeScriptElements(form);

      expect(consoleLogSpy.calledOnce).to.be.true;
      expect(consoleLogSpy.calledWith('test')).to.be.true;
    });
  });

  describe('subscribeToFormSubmitEvent', () => {
    it('should subscribe to form submit event', () => {
      const form = global.document.createElement('form');
      const input = global.document.createElement('input');

      global.document.body.appendChild(form);

      form.appendChild(input);

      const addEventListenerSpy = sinon.spy(form, 'addEventListener');

      formModule.subscribeToFormSubmitEvent(form, 'component-id');

      expect(addEventListenerSpy.calledWith('form:engage'));

      form.dispatchEvent(
        new dom.window.CustomEvent('form:engage', {
          detail: { formId: 'formId', name: 'SUBMITTED' },
        })
      );

      expect(formEvent.calledWith('formId', 'SUBMITTED', 'componentId'));
    });
  });
});
