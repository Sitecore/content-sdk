import { expect, use as chaiUse } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { AtomsCatalogPayload } from './types';

chaiUse(sinonChai);
import {
  addDocumentUpdateHandler,
  addComponentPropsUpdateHandler,
  getDesignLibraryAtomsCatalogEvent,
  getDesignLibraryAtomsErrorEvent,
} from './events';

describe('design-library-bridge events', () => {
  describe('getDesignLibraryAtomsCatalogEvent', () => {
    it('returns an event with name "atoms:catalog"', () => {
      const payload: AtomsCatalogPayload = { components: [], actions: [] };
      const event = getDesignLibraryAtomsCatalogEvent(payload);

      expect(event.name).to.equal('atoms:catalog');
    });

    it('returns an event containing the provided catalog payload', () => {
      const payload: AtomsCatalogPayload = {
        components: [
          {
            name: 'Button',
            propsSchema: { type: 'object' },
            description: 'A button',
            slots: ['default'],
          },
        ],
        actions: [{ name: 'submit', paramsSchema: { type: 'object' }, description: 'Submit form' }],
      };

      const event = getDesignLibraryAtomsCatalogEvent(payload);

      expect(event.message.components).to.have.length(1);
      expect(event.message.components[0].name).to.equal('Button');
      expect(event.message.actions).to.have.length(1);
      expect(event.message.actions[0].name).to.equal('submit');
    });
  });

  describe('getDesignLibraryAtomsErrorEvent', () => {
    it('returns an event with name "atoms:error"', () => {
      const event = getDesignLibraryAtomsErrorEvent('some error', 'render');

      expect(event.name).to.equal('atoms:error');
      expect(event.message.error).to.equal('some error');
      expect(event.message.type).to.equal('render');
    });

    it('returns a validation error event with the issues payload', () => {
      const error = {
        issues: [{ severity: 'error', message: 'Root missing', code: 'missing_root' }],
        formatted: 'Root missing',
      };
      const event = getDesignLibraryAtomsErrorEvent(error, 'validation');

      expect(event.name).to.equal('atoms:error');
      expect(event.message.type).to.equal('validation');
      expect(event.message.error).to.deep.equal(error);
    });
  });

  describe('addDocumentUpdateHandler', () => {
    let addEventListener: sinon.SinonStub;
    let removeEventListener: sinon.SinonStub;
    let postMessage: sinon.SinonStub;

    const validDocument = {
      name: 'hero',
      root: 'root',
      elements: {
        root: { type: 'Text', props: { text: 'Hello' }, children: [] },
      },
    };

    beforeEach(() => {
      addEventListener = sinon.stub();
      removeEventListener = sinon.stub();
      postMessage = sinon.stub();
      (global as any).window = { addEventListener, removeEventListener, postMessage };
    });

    afterEach(() => {
      (global as any).window = undefined;
    });

    it('registers a message event listener', () => {
      const callback = sinon.stub();
      addDocumentUpdateHandler(callback);

      expect(addEventListener).to.have.been.calledWith('message', sinon.match.func);
    });

    it('returns an unsubscribe function that removes the listener', () => {
      const callback = sinon.stub();
      const unsubscribe = addDocumentUpdateHandler(callback);

      unsubscribe();

      expect(removeEventListener).to.have.been.calledWith('message', sinon.match.func);
    });

    it('invokes the callback when the document is valid', () => {
      const callback = sinon.stub();
      addDocumentUpdateHandler(callback);

      const handler = addEventListener.firstCall.args[1];
      handler({
        origin: 'http://localhost',
        data: { name: 'component:atoms:preview', document: validDocument },
      });

      expect(callback.callCount).to.equal(1);
      expect(callback.firstCall.args[0]).to.equal(validDocument);
      expect(postMessage.callCount).to.equal(0);
    });

    it('sends atoms:error and does not render when the document is invalid', () => {
      const callback = sinon.stub();
      addDocumentUpdateHandler(callback);

      const invalidDocument = {
        name: 'broken',
        root: 'missing',
        elements: {
          title: { type: 'Text', props: {}, children: [] },
        },
      };
      const handler = addEventListener.firstCall.args[1];
      handler({
        origin: 'http://localhost',
        data: { name: 'component:atoms:preview', document: invalidDocument },
      });

      expect(callback.callCount).to.equal(0);
      expect(postMessage.callCount).to.equal(1);
      const event = postMessage.firstCall.args[0];
      expect(event.name).to.equal('atoms:error');
      expect(event.message.type).to.equal('validation');
      expect(event.message.error.issues.some((issue: { code: string }) => issue.code === 'root_not_found'))
        .to.equal(true);
      expect(event.message.error.formatted).to.be.a('string');
      expect(event.message.error.formatted.length).to.be.greaterThan(0);
    });
  });

  describe('addComponentPropsUpdateHandler', () => {
    let addEventListener: sinon.SinonStub;
    let removeEventListener: sinon.SinonStub;

    beforeEach(() => {
      addEventListener = sinon.stub();
      removeEventListener = sinon.stub();
      (global as any).window = { addEventListener, removeEventListener };
    });

    afterEach(() => {
      (global as any).window = undefined;
    });

    it('registers a message event listener', () => {
      addComponentPropsUpdateHandler(sinon.stub());
      expect(addEventListener).to.have.been.calledWith('message', sinon.match.func);
    });

    it('returns an unsubscribe function that removes the listener', () => {
      const unsubscribe = addComponentPropsUpdateHandler(sinon.stub());
      unsubscribe();
      expect(removeEventListener).to.have.been.calledWith('message', sinon.match.func);
    });

    it('invokes the callback with fields and params from a valid component:update event', () => {
      const callback = sinon.stub();
      addComponentPropsUpdateHandler(callback);

      const fields = { title: { value: 'Hello' } };
      const params = { styles: 'primary' };
      const handler = addEventListener.firstCall.args[1];
      handler({
        origin: 'http://localhost',
        data: { name: 'component:update', details: { uid: 'abc', fields, params } },
      });

      expect(callback.callCount).to.equal(1);
      expect(callback.firstCall.args[0]).to.equal(fields);
      expect(callback.firstCall.args[1]).to.equal(params);
    });

    it('invokes the callback with undefined fields and params when details is absent', () => {
      const callback = sinon.stub();
      addComponentPropsUpdateHandler(callback);

      const handler = addEventListener.firstCall.args[1];
      handler({ origin: 'http://localhost', data: { name: 'component:update' } });

      expect(callback).to.have.been.calledOnceWith(undefined, undefined);
    });

    it('does not invoke the callback for events with a different name', () => {
      const callback = sinon.stub();
      addComponentPropsUpdateHandler(callback);

      const handler = addEventListener.firstCall.args[1];
      handler({
        origin: 'http://localhost',
        data: { name: 'component:atoms:preview', document: {} },
      });

      expect(callback.callCount).to.equal(0);
    });
  });
});
