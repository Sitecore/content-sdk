import { expect } from 'chai';
import { AtomInfo, AtomType, getDesignLibraryAtomsRegistryEvent } from './atoms-builder';

describe('atoms-builder', () => {
  describe('getDesignLibraryAtomsRegistryEvent', () => {
    it('should return an event with name "atom:registry"', () => {
      const event = getDesignLibraryAtomsRegistryEvent([]);

      expect(event.name).to.equal('atom:registry');
    });

    it('should return an event with an empty atoms registry when given an empty array', () => {
      const event = getDesignLibraryAtomsRegistryEvent([]);

      expect(event.message.atomsRegistry).to.deep.equal([]);
    });

    it('should return an event containing the provided atoms registry', () => {
      const atomsRegistry: AtomInfo[] = [
        {
          name: 'Button',
          type: AtomType.ATOM,
          description: 'A button atom',
          props: { label: 'string' },
          children: [],
        },
      ];

      const event = getDesignLibraryAtomsRegistryEvent(atomsRegistry);

      expect(event.message.atomsRegistry).to.deep.equal(atomsRegistry);
    });

    it('should return an event containing multiple atoms', () => {
      const atomsRegistry: AtomInfo[] = [
        {
          name: 'Button',
          type: AtomType.ATOM,
          description: 'A button atom',
          props: { label: 'string' },
          children: ['ButtonIcon'],
        },
        {
          name: 'ButtonIcon',
          type: AtomType.ATOM_CHILD,
          description: 'An icon child of Button',
          props: { src: 'string' },
          children: [],
        },
      ];

      const event = getDesignLibraryAtomsRegistryEvent(atomsRegistry);

      expect(event.message.atomsRegistry).to.have.length(2);
      expect(event.message.atomsRegistry).to.deep.equal(atomsRegistry);
    });

    it('should include optional fields when provided', () => {
      const atomsRegistry: AtomInfo[] = [
        {
          name: 'Card',
          version: 2,
          type: AtomType.ATOM,
          description: 'A card atom with optional fields',
          props: { title: 'string' },
          children: ['CardBody'],
          defaultChildren: ['CardBody', { atom: 'CardFooter', props: { cta: 'Learn more' } }],
          htmlEvents: ['click', 'focus'],
          customEvents: { onExpand: 'CustomExpandEvent' },
        },
      ];

      const event = getDesignLibraryAtomsRegistryEvent(atomsRegistry);

      const [atom] = event.message.atomsRegistry;
      expect(atom.version).to.equal(2);
      expect(atom.defaultChildren).to.deep.equal([
        'CardBody',
        { atom: 'CardFooter', props: { cta: 'Learn more' } },
      ]);
      expect(atom.htmlEvents).to.deep.equal(['click', 'focus']);
      expect(atom.customEvents).to.deep.equal({ onExpand: 'CustomExpandEvent' });
    });
  });
});
