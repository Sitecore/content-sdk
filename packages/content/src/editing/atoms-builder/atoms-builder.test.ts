import { expect } from 'chai';
import sinon from 'sinon';
import type { Document } from '../../atoms/component-layout/document';
import { AtomInfo, CallbackInfo, addDocumentUpdateHandler, getDesignLibraryAtomsRegistryEvent } from './atoms-builder';

describe('atoms-builder', () => {
  describe('getDesignLibraryAtomsRegistryEvent', () => {
    it('should return an event with name "atom:registry"', () => {
      const event = getDesignLibraryAtomsRegistryEvent([], {});

      expect(event.name).to.equal('atom:registry');
    });

    it('should return an event with an empty atoms registry when given an empty array', () => {
      const event = getDesignLibraryAtomsRegistryEvent([], {});

      expect(event.message.atomsRegistry).to.deep.equal([]);
    });

    it('should return an event containing the provided atoms registry', () => {
      const atomsRegistry: AtomInfo[] = [
        {
          name: 'Button',
          type: 'atom',
          description: 'A button atom',
          props: { label: 'string' },
          allowedChildren: [],
        },
      ];

      const event = getDesignLibraryAtomsRegistryEvent(atomsRegistry, {});

      expect(event.message.atomsRegistry).to.deep.equal(atomsRegistry);
    });

    it('should return an event containing multiple atoms', () => {
      const atomsRegistry: AtomInfo[] = [
        {
          name: 'Button',
          type: 'atom',
          description: 'A button atom',
          props: { label: 'string' },
          allowedChildren: ['ButtonIcon'],
        },
        {
          name: 'ButtonIcon',
          type: 'atom-child',
          description: 'An icon child of Button',
          props: { src: 'string' },
          allowedChildren: [],
        },
      ];

      const event = getDesignLibraryAtomsRegistryEvent(atomsRegistry, {});

      expect(event.message.atomsRegistry).to.have.length(2);
      expect(event.message.atomsRegistry).to.deep.equal(atomsRegistry);
    });

    it('should include optional fields when provided', () => {
      const atomsRegistry: AtomInfo[] = [
        {
          name: 'Card',
          version: 2,
          type: 'atom',
          description: 'A card atom with optional fields',
          props: { title: 'string' },
          allowedChildren: ['CardBody'],
          defaultChildren: ['CardBody', { atom: 'CardFooter', props: { cta: 'Learn more' } }],
          htmlEvents: ['click', 'focus'],
          customEvents: { onExpand: 'CustomExpandEvent' },
        },
      ];

      const event = getDesignLibraryAtomsRegistryEvent(atomsRegistry, {});

      const [atom] = event.message.atomsRegistry;
      expect(atom.version).to.equal(2);
      expect(atom.defaultChildren).to.deep.equal([
        'CardBody',
        { atom: 'CardFooter', props: { cta: 'Learn more' } },
      ]);
      expect(atom.htmlEvents).to.deep.equal(['click', 'focus']);
      expect(atom.customEvents).to.deep.equal({ onExpand: 'CustomExpandEvent' });
    });

    it('should return an event with an empty callback registry when given an empty object', () => {
      const event = getDesignLibraryAtomsRegistryEvent([], {});

      expect(event.message.callbackRegistry).to.deep.equal({});
    });

    it('should return an event containing the provided callback registry', () => {
      const callbackRegistry: Record<string, CallbackInfo> = {
        handleClick: {
          description: 'Handles click events',
          params: { event: 'MouseEvent' },
        },
      };

      const event = getDesignLibraryAtomsRegistryEvent([], callbackRegistry);

      expect(event.message.callbackRegistry).to.deep.equal(callbackRegistry);
    });

    it('should return an event containing multiple callbacks', () => {
      const callbackRegistry: Record<string, CallbackInfo> = {
        handleClick: {
          description: 'Handles click events',
          params: { event: 'MouseEvent' },
        },
        handleSubmit: {
          description: 'Handles form submission',
        },
        handleChange: {
          description: 'Handles input changes',
          params: { value: 'string', name: 'string' },
        },
      };

      const event = getDesignLibraryAtomsRegistryEvent([], callbackRegistry);

      expect(Object.keys(event.message.callbackRegistry)).to.have.length(3);
      expect(event.message.callbackRegistry).to.deep.equal(callbackRegistry);
    });

    it('should return an event with both atoms registry and callback registry', () => {
      const atomsRegistry: AtomInfo[] = [
        {
          name: 'Button',
          type: 'atom',
          description: 'A button atom',
          props: { label: 'string' },
          allowedChildren: [],
        },
      ];

      const callbackRegistry: Record<string, CallbackInfo> = {
        onClick: {
          description: 'Button click handler',
          params: { event: 'MouseEvent' },
        },
      };

      const event = getDesignLibraryAtomsRegistryEvent(atomsRegistry, callbackRegistry);

      expect(event.message.atomsRegistry).to.deep.equal(atomsRegistry);
      expect(event.message.callbackRegistry).to.deep.equal(callbackRegistry);
    });
  });

  describe('addDocumentUpdateHandler', () => {
    let addListener: sinon.SinonStub;
    let removeListener: sinon.SinonStub;
    let messageHandler: ((e: MessageEvent) => void) | undefined;

    beforeEach(() => {
      messageHandler = undefined;
      addListener = sinon.stub().callsFake((event: string, handler: (e: MessageEvent) => void) => {
        if (event === 'message') {
          messageHandler = handler;
        }
      });
      removeListener = sinon.stub();
      (globalThis as unknown as { window: Window & typeof globalThis }).window = {
        addEventListener: addListener,
        removeEventListener: removeListener,
      } as unknown as Window & typeof globalThis;
    });

    afterEach(() => {
      delete (globalThis as unknown as { window?: Window }).window;
    });

    it('should register a message listener and invoke callback with document when event is valid', () => {
      const callback = sinon.spy();
      const doc: Document = {
        name: 'preview',
        root: { type: 'Stack', id: 'r1', children: [] },
      };

      const unsub = addDocumentUpdateHandler(callback);

      sinon.assert.calledWith(addListener, 'message', sinon.match.func);

      messageHandler!(
        new MessageEvent('message', {
          origin: 'http://localhost',
          data: { name: 'component:atoms:preview', document: doc },
        })
      );

      sinon.assert.calledOnceWithExactly(callback, doc);
      expect(typeof unsub).to.equal('function');

      unsub();
      sinon.assert.calledWith(removeListener, 'message', messageHandler);
    });

    it('should ignore messages that do not match the preview event name', () => {
      const callback = sinon.spy();
      addDocumentUpdateHandler(callback);

      messageHandler!(
        new MessageEvent('message', {
          origin: 'http://localhost',
          data: { name: 'other:event', document: {} },
        })
      );

      sinon.assert.notCalled(callback);
    });
  });
});
