import { expect } from 'chai';
import sinon from 'sinon';
import { AtomsCatalogPayload } from './types';
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
  });

  describe('addDocumentUpdateHandler', () => {
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
