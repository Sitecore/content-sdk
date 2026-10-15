import { expect, use as chaiUse } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { SerializedCatalog } from '../types';

chaiUse(sinonChai);
import {
  addDocumentUpdateHandler,
  getDesignLibraryAtomsCatalogEvent,
  getDesignLibraryAtomsErrorEvent,
} from './events';

describe('design-library-bridge events', () => {
  describe('getDesignLibraryAtomsCatalogEvent', () => {
    it('returns an event with name "atoms:catalog"', () => {
      const payload: SerializedCatalog = {
        stylingSolution: 'inline-css',
        components: [],
        actions: [],
      };
      const event = getDesignLibraryAtomsCatalogEvent(payload);

      expect(event.name).to.equal('atoms:catalog');
    });

    it('returns an event containing the provided catalog payload', () => {
      const payload: SerializedCatalog = {
        stylingSolution: 'inline-css',
        components: [
          {
            name: 'Button',
            propsSchema: { type: 'object' },
            description: 'A button',
            slots: ['default'],
            legacy: false,
          },
        ],
        actions: [
          {
            name: 'submit',
            paramsSchema: { type: 'object' },
            description: 'Submit form',
            legacy: false,
          },
        ],
      };

      const event = getDesignLibraryAtomsCatalogEvent(payload);

      expect(event.message).to.deep.equal(payload);
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

      expect(removeEventListener).to.have.been.calledOnceWithExactly(
        'message',
        addEventListener.firstCall.args[1]
      );
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
      expect(
        event.message.error.issues.some((issue: { code: string }) => issue.code === 'root_not_found')
      ).to.equal(true);
      expect(event.message.error.formatted).to.be.a('string');
      expect(event.message.error.formatted.length).to.be.greaterThan(0);
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

      const document = { ...validDocument, state: { params: { styles: 'primary' } } };
      const replacement = { ...validDocument, state: { params: { styles: 'secondary' } } };
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
