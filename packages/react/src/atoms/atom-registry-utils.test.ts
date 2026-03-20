import { expect } from 'chai';
import { z } from 'zod';
import { unfoldAtomsRegistry, serializeAtoms } from './atom-registry-utils';
import { AtomChild, AtomMetadata } from './types';
import { AtomType } from '@sitecore-content-sdk/content/editing';

const createAtom = (name: string, allowedChildren?: AtomChild[]): AtomMetadata => ({
  name,
  type: AtomType.ATOM,
  description: `${name} atom`,
  props: z.object({}),
  component: () => null,
  allowedChildren,
});

describe('unfoldAtomsRegistry', () => {
  it('should return an empty array for empty input', () => {
    const result = unfoldAtomsRegistry([]);

    expect(result).to.deep.equal([]);
  });

  it('should return a single top-level atom when there are no children', () => {
    const atomA = createAtom('A');

    const result = unfoldAtomsRegistry([atomA]);

    expect(result).to.deep.equal([atomA]);
  });

  it('should ignore string allowedChildren values', () => {
    const atomA = createAtom('A', ['text', 'atom']);

    const result = unfoldAtomsRegistry([atomA]);

    expect(result.map((atom) => atom.name)).to.deep.equal(['A']);
  });

  it('should recursively include one level of nested metadata children', () => {
    const atomB = createAtom('B');
    const atomA = createAtom('A', [atomB]);

    const result = unfoldAtomsRegistry([atomA]);

    expect(result.map((atom) => atom.name)).to.deep.equal(['A', 'B']);
  });

  it('should recursively include multiple levels of nested metadata children', () => {
    const atomC = createAtom('C');
    const atomB = createAtom('B', [atomC]);
    const atomA = createAtom('A', [atomB]);

    const result = unfoldAtomsRegistry([atomA]);

    expect(result.map((atom) => atom.name)).to.deep.equal(['A', 'B', 'C']);
  });

  it('should deduplicate repeated names encountered across branches', () => {
    const sharedFromA = createAtom('Shared');
    const sharedFromB = createAtom('Shared');
    const atomA = createAtom('A', [sharedFromA]);
    const atomB = createAtom('B', [sharedFromB]);

    const result = unfoldAtomsRegistry([atomA, atomB]);

    expect(result.map((atom) => atom.name)).to.deep.equal(['A', 'Shared', 'B']);
    expect(result.filter((atom) => atom.name === 'Shared')).to.have.length(1);
    expect(result[1]).to.equal(sharedFromA);
  });

  it('should handle cyclic references without infinite recursion', () => {
    const atomA = createAtom('A');
    const atomB = createAtom('B');

    atomA.allowedChildren = [atomB];
    atomB.allowedChildren = [atomA];

    const result = unfoldAtomsRegistry([atomA]);

    expect(result.map((atom) => atom.name)).to.deep.equal(['A', 'B']);
  });

  it('should not duplicate a child that is also passed as a root atom', () => {
    const atomB = createAtom('B');
    const atomA = createAtom('A', [atomB]);

    const result = unfoldAtomsRegistry([atomA, atomB]);

    expect(result.map((atom) => atom.name)).to.deep.equal(['A', 'B']);
    expect(result[1]).to.equal(atomB);
  });

  it('should preserve object references from input atoms', () => {
    const atomB = createAtom('B');
    const atomA = createAtom('A', [atomB]);

    const result = unfoldAtomsRegistry([atomA]);

    expect(result[0]).to.equal(atomA);
    expect(result[1]).to.equal(atomB);
  });
});

describe.only('serializeAtoms', () => {
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
    expect(serializedA.children).to.deep.equal(['B', 'text', 'atom']);
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
    expect(serializedA.children).to.include('B');
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
});
