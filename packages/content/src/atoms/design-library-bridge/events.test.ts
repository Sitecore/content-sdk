import { expect, use as chaiUse } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { AtomsCatalogPayload } from './types';
import {
  addDocumentUpdateHandler,
  getDesignLibraryAtomsCatalogEvent,
  getDesignLibraryAtomsErrorEvent,
} from './events';

chaiUse(sinonChai);

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

      expect(removeEventListener).to.have.been.calledOnceWithExactly(
        'message',
        addEventListener.firstCall.args[1]
      );
    });

    it('delivers the preview document with its fields and params state unchanged', () => {
      const callback = sinon.stub();
      addDocumentUpdateHandler(callback);

      const document = {
        name: 'preview',
        root: 'button',
        elements: { button: { type: 'Button', props: {}, children: [] } },
        state: {
          fields: { title: { value: 'Hello' } },
          params: { styles: 'primary' },
          message: 'Preserved state',
        },
      };
      const handler = addEventListener.firstCall.args[1];
      handler({
        origin: 'http://localhost',
        data: { name: 'component:atoms:preview', document },
      });

      expect(callback).to.have.been.calledOnceWithExactly(document);
      expect(callback.firstCall.args[0]).to.equal(document);
    });

    it('delivers each replacement preview document', () => {
      const callback = sinon.stub();
      addDocumentUpdateHandler(callback);

      const document = { name: 'preview', state: { params: { styles: 'primary' } } };
      const replacement = { name: 'preview', state: { params: { styles: 'secondary' } } };
      const handler = addEventListener.firstCall.args[1];
      [document, replacement].forEach((updatedDocument) => {
        handler({
          origin: 'http://localhost',
          data: { name: 'component:atoms:preview', document: updatedDocument },
        });
      });

      expect(callback.callCount).to.equal(2);
      expect(callback.firstCall.args[0]).to.equal(document);
      expect(callback.secondCall.args[0]).to.equal(replacement);
    });

    it('ignores obsolete component:update events and invalid preview events', () => {
      const callback = sinon.stub();
      addDocumentUpdateHandler(callback);

      const handler = addEventListener.firstCall.args[1];
      handler({
        origin: 'http://localhost',
        data: { name: 'component:update', details: { fields: {}, params: {} } },
      });
      handler({
        origin: '',
        data: { name: 'component:atoms:preview', document: {} },
      });
      handler({ origin: 'http://localhost', data: null });

      expect(callback.callCount).to.equal(0);
    });
  });
});
