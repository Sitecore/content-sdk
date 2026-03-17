import { expect } from 'chai';
import { z } from 'zod';
import { createAtom, withPropMeta } from './index';

describe('createAtom', () => {
  const DummyComponent = (props: { variant?: string; size?: string }) => {
    void props;
    return null;
  };

  it('returns AtomMetadata with type "atom" when schema.type is omitted', () => {
    const meta = createAtom(DummyComponent, {
      name: 'Dummy',
      description: 'A dummy atom',
      props: {
        variant: z.enum(['a', 'b']).optional().default('a'),
        size: z.string().optional(),
      },
    });
    expect(meta.type).to.equal('atom');
    expect(meta.name).to.equal('Dummy');
    expect(meta.description).to.equal('A dummy atom');
    expect(meta.props).to.be.instanceOf(z.ZodObject);
    expect(meta.component).to.equal(DummyComponent);
  });

  it('returns AtomMetadata with type "atom-child" when schema.type is "atom-child"', () => {
    const meta = createAtom(DummyComponent, {
      name: 'DummyChild',
      description: 'A dummy child',
      type: 'atom-child',
      props: {},
    });
    expect(meta.type).to.equal('atom-child');
    expect(meta.name).to.equal('DummyChild');
  });

  it('includes htmlEvents and allowedChildren when provided', () => {
    const Clickable = (props: { onClick?: () => void }) => {
      void props;
      return null;
    };
    const meta = createAtom(Clickable, {
      name: 'Clickable',
      description: 'Clickable',
      props: {},
      htmlEvents: ['onClick'],
      allowedChildren: ['text'],
    });
    expect(meta.htmlEvents).to.deep.equal(['onClick']);
    expect(meta.allowedChildren).to.deep.equal(['text']);
  });

  it('builds props schema from schema.props', () => {
    const meta = createAtom(DummyComponent, {
      name: 'WithProps',
      description: 'With props',
      props: {
        variant: z.enum(['x', 'y']).default('x'),
      },
    });
    const parsed = meta.props.safeParse({ variant: 'y' });
    expect(parsed.success).to.equal(true);
    if (parsed.success) {
      expect(parsed.data.variant).to.equal('y');
    }
  });

  it('accepts withPropMeta in props', () => {
    const meta = createAtom(DummyComponent, {
      name: 'WithMeta',
      description: 'With meta',
      props: {
        variant: withPropMeta(z.string().optional(), { control: 'text' }),
      },
    });
    expect(meta.props).to.be.instanceOf(z.ZodObject);
  });
});
