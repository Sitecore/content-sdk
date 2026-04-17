import { expect } from 'chai';
import { z } from 'zod';
import { getAtomMap, serializeAtoms } from './atom-registry-utils';
import { AtomChild, AtomMetadata } from './types';

const createAtom = (name: string, allowedChildren?: AtomChild[]): AtomMetadata => ({
  name,
  type: 'atom',
  description: `${name} atom`,
  props: z.object({}),
  component: () => null,
  allowedChildren,
});

describe('serializeAtoms', () => {
  it('should serialize atom props to JSON schema', () => {
    const propsSchema = z.object({
      label: z.string(),
      count: z.number(),
    });
    const atomA = createAtom('A');
    atomA.props = propsSchema;

    const result = serializeAtoms([atomA]);

    expect(result).to.have.length(1);
    expect(result[0]).to.have.property('props');
    expect(result[0].props).to.be.an('object');
    expect(result[0].props.type).to.equal('object');
  });

  it('should serialize allowedChildren as string array', () => {
    const atomB = createAtom('B');
    const atomA = createAtom('A', [atomB, 'text', 'atom']);

    const result = serializeAtoms([atomA]);

    expect(result).to.have.length(2);
    const serializedA = result.find((info) => info.name === 'A');
    if (!serializedA) throw new Error('serializedA should be defined');
    expect(serializedA.allowedChildren).to.deep.equal(['B', 'text', 'atom']);
  });

  it('should serialize defaultChildren with atom names', () => {
    const defaultAtom = createAtom('DefaultChild');
    const atomA = createAtom('A');
    atomA.defaultChildren = [defaultAtom, { atom: defaultAtom, props: { key: 'value' } }];

    const result = serializeAtoms([atomA]);

    const serializedA = result.find((info) => info.name === 'A');
    if (!serializedA) throw new Error('serializedA should be defined');
    expect(serializedA.defaultChildren).to.be.an('array');
    expect(serializedA.defaultChildren![0]).to.equal('DefaultChild');
    expect(serializedA.defaultChildren![1]).to.deep.equal({
      atom: 'DefaultChild',
      props: { key: 'value' },
    });
  });

  it('should serialize customEvents to JSON schema', () => {
    const atomA = createAtom('A');
    atomA.customEvents = {
      onClick: [z.string(), z.number()],
      onHover: [z.boolean()],
    };

    const result = serializeAtoms([atomA]);

    const serializedA = result.find((info) => info.name === 'A');
    if (!serializedA) throw new Error('serializedA should be defined');
    expect(serializedA.customEvents).to.be.an('object');
    expect(serializedA.customEvents?.type).to.equal('object');
    expect(serializedA.customEvents?.properties).to.have.property('onClick');
    expect(serializedA.customEvents?.properties).to.have.property('onHover');
  });

  it('should serialize atom without customEvents when not provided', () => {
    const atomA = createAtom('A');

    const result = serializeAtoms([atomA]);

    const serializedA = result.find((info) => info.name === 'A');
    if (!serializedA) throw new Error('serializedA should be defined');
    expect(serializedA.customEvents).to.equal(undefined);
  });

  it('should serialize multiple atoms with all properties', () => {
    const propsSchema = z.object({ title: z.string() });
    const atomB = createAtom('B');
    const atomA = createAtom('A', [atomB]);
    atomA.props = propsSchema;
    atomA.customEvents = { onEvent: [z.string()] };
    atomA.htmlEvents = ['onClick', 'onHover'];
    atomA.defaultChildren = [atomB];

    const result = serializeAtoms([atomA]);

    expect(result).to.have.length(2);
    const serializedA = result.find((info) => info.name === 'A');
    if (!serializedA) throw new Error('serializedA should be defined');
    expect(serializedA.props).to.be.an('object');
    expect(serializedA.allowedChildren).to.include('B');
    expect(serializedA.customEvents).to.be.an('object');
    expect(serializedA.htmlEvents).to.deep.equal(['onClick', 'onHover']);
    expect(serializedA.defaultChildren).to.deep.equal(['B']);
  });

  it('should serialize atom props with provided metadata', () => {
    const propsSchema = z.object({
      name: z.string().meta({ description: 'The name of the atom', default: 'Unnamed' }),
      isActive: z.boolean().meta({ description: 'Whether the atom is active', default: false }),
    });
    const atomA = createAtom('A');
    atomA.props = propsSchema;

    const result = serializeAtoms([atomA]);

    const serializedA = result.find((info) => info.name === 'A');
    if (!serializedA) throw new Error('serializedA should be defined');
    expect(serializedA.props).to.be.an('object');
    expect(serializedA.props?.properties).to.have.property('name');
    expect(serializedA.props?.properties).to.have.property('isActive');
    expect(serializedA.props?.properties?.name?.description).to.equal('The name of the atom');
    expect(serializedA.props?.properties?.name?.default).to.equal('Unnamed');
    expect(serializedA.props?.properties?.isActive?.description).to.equal(
      'Whether the atom is active'
    );
    expect(serializedA.props?.properties?.isActive?.default).to.equal(false);
  });

  it('should serialize atom custom events with provided arguiment metadata', () => {
    const atomA = createAtom('A');
    atomA.customEvents = {
      onSubmit: [
        z.string().meta({ firstArgName: 'First argument' }),
        z.number().meta({ secondArgName: 'Second argument' }),
      ],
    };

    const result = serializeAtoms([atomA]);

    const serializedA = result.find((info) => info.name === 'A');
    if (!serializedA) throw new Error('serializedA should be defined');
    expect(serializedA.customEvents).to.be.an('object');
    expect(serializedA.customEvents?.properties).to.have.property('onSubmit');
    expect(serializedA.customEvents?.properties?.onSubmit?.items).to.have.length(2);
    expect(serializedA.customEvents?.properties?.onSubmit?.items?.[0]?.firstArgName).to.equal(
      'First argument'
    );
    expect(serializedA.customEvents?.properties?.onSubmit?.items?.[1]?.secondArgName).to.equal(
      'Second argument'
    );
  });

  it('should flatten three levels of nested allowedChildren', () => {
    // A → B → C
    const atomC = createAtom('C');
    const atomB = createAtom('B', [atomC]);
    const atomA = createAtom('A', [atomB]);

    const result = serializeAtoms([atomA]);

    expect(result).to.have.length(3);
    const names = result.map((r) => r.name);
    expect(names).to.include.members(['A', 'B', 'C']);

    const serializedA = result.find((r) => r.name === 'A')!;
    const serializedB = result.find((r) => r.name === 'B')!;
    const serializedC = result.find((r) => r.name === 'C')!;

    // Each level's allowedChildren should be string names, not objects
    expect(serializedA.allowedChildren).to.deep.equal(['B']);
    expect(serializedB.allowedChildren).to.deep.equal(['C']);
    expect(serializedC.allowedChildren).to.deep.equal([]);
  });

  it('should not duplicate atoms shared across multiple levels (diamond pattern)', () => {
    // A allows B and C; B also allows C → C should appear only once
    const atomC = createAtom('C');
    const atomB = createAtom('B', [atomC]);
    const atomA = createAtom('A', [atomB, atomC]);

    const result = serializeAtoms([atomA]);

    expect(result).to.have.length(3);
    const names = result.map((r) => r.name);
    expect(names).to.include.members(['A', 'B', 'C']);
    // Ensure no duplicates
    expect(new Set(names).size).to.equal(3);

    const serializedA = result.find((r) => r.name === 'A')!;
    expect(serializedA.allowedChildren).to.deep.equal(['B', 'C']);
  });

  it('should serialize defaultChildren at multiple levels of nesting', () => {
    // A has defaultChildren referencing B; B has defaultChildren referencing C
    const atomC = createAtom('C');
    const atomB = createAtom('B', [atomC]);
    atomB.defaultChildren = [atomC, { atom: atomC, props: { key: 'val' } }];
    const atomA = createAtom('A', [atomB]);
    atomA.defaultChildren = [atomB];

    const result = serializeAtoms([atomA]);

    expect(result).to.have.length(3);

    const serializedA = result.find((r) => r.name === 'A')!;
    const serializedB = result.find((r) => r.name === 'B')!;

    // A's defaultChildren → B serialized as name string
    expect(serializedA.defaultChildren).to.deep.equal(['B']);

    // B's defaultChildren → C serialized as name string and { atom: 'C', props }
    expect(serializedB.defaultChildren).to.deep.equal(['C', { atom: 'C', props: { key: 'val' } }]);
  });

  it('should handle mixed string and object allowedChildren at multiple levels', () => {
    // B allows 'text' and 'atom' (strings) and a concrete atom C
    const atomC = createAtom('C');
    const atomB = createAtom('B', ['text', 'atom', atomC]);
    const atomA = createAtom('A', [atomB, 'text']);

    const result = serializeAtoms([atomA]);

    expect(result).to.have.length(3);

    const serializedA = result.find((r) => r.name === 'A')!;
    const serializedB = result.find((r) => r.name === 'B')!;

    expect(serializedA.allowedChildren).to.deep.equal(['B', 'text']);
    expect(serializedB.allowedChildren).to.deep.equal(['text', 'atom', 'C']);
  });
});

describe('getAtomMap', () => {
  it('should return a map of name to component from metadata', () => {
    const Button = () => null;
    const meta: AtomMetadata = {
      name: 'Button',
      type: 'atom',
      description: 'Button',
      props: {} as AtomMetadata['props'],
      component: Button,
    };
    const registry = getAtomMap([meta]);
    expect(registry.Button).to.equal(Button);
    expect(Object.keys(registry)).to.deep.equal(['Button']);
  });

  it('should include allowedChildren in registry', () => {
    const Card = () => null;
    const CardBody = () => null;
    const cardMeta: AtomMetadata = {
      name: 'Card',
      type: 'atom',
      description: 'Card',
      props: {} as AtomMetadata['props'],
      component: Card,
      allowedChildren: [
        {
          name: 'CardBody',
          type: 'atom-child',
          description: 'Body',
          props: {} as AtomMetadata['props'],
          component: CardBody,
        },
      ],
    };
    const registry = getAtomMap([cardMeta]);
    expect(registry.Card).to.equal(Card);
    expect(registry.CardBody).to.equal(CardBody);
  });
});
