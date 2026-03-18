import { expect } from 'chai';
import { z } from 'zod';
import { createAtom, withPropMeta, getFieldMeta } from './index';

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

  it('getFieldMeta returns meta from Zod schema', () => {
    const schema = withPropMeta(z.string(), { control: 'color' });
    const meta = getFieldMeta(schema);
    expect(meta).to.deep.equal({ control: 'color' });
  });

  describe('component scenarios (props only, no callbacks)', () => {
    it('accepts component with only required props', () => {
      const OnlyProps = (props: { title: string; count: number }) => null;
      const meta = createAtom(OnlyProps, {
        name: 'OnlyProps',
        description: 'Props only',
        props: {
          title: z.string(),
          count: z.number(),
        },
      });
      expect(meta.name).to.equal('OnlyProps');
      const parsed = meta.props.safeParse({ title: 'Hi', count: 1 });
      expect(parsed.success).to.equal(true);
    });

    it('accepts component with optional props only', () => {
      const OptionalOnly = (props: { tag?: string }) => null;
      const meta = createAtom(OptionalOnly, {
        name: 'OptionalOnly',
        description: 'Optional',
        props: { tag: z.string().optional() },
      });
      expect(meta.props.safeParse({})).to.have.property('success', true);
      expect(meta.props.safeParse({ tag: 'x' }).success).to.equal(true);
    });
  });

  describe('customEvents (typed to callback parameters)', () => {
    it('accepts component with explicit props (no ComponentType<unknown> cast)', () => {
      const Test = ({
        customEvent,
        prop1,
        prop2,
      }: {
        customEvent: (x: string, y: number) => void;
        prop1: string;
        prop2: number;
      }) => null;
      const meta = createAtom(Test, {
        name: 'Test',
        description: 'Test',
        props: {
          prop1: z.string(),
          prop2: z.number(),
        },
        customEvents: {
          customEvent: [z.string(), z.number()],
        },
      });
      expect(meta.name).to.equal('Test');
      expect(meta.customEvents?.customEvent).to.have.lengthOf(2);
    });

    it('accepts customEvents with tuple matching callback params (two args)', () => {
      const WithSubmit = (props: {
        onSubmit?: (name: string, count: number) => void;
      }) => {
        void props;
        return null;
      };
      const onSubmitSchemas = [z.string(), z.number()];
      const meta = createAtom(WithSubmit, {
        name: 'WithSubmit',
        description: 'With submit',
        props: {},
        customEvents: { onSubmit: onSubmitSchemas },
      });
      expect(meta.customEvents?.onSubmit).to.equal(onSubmitSchemas);
    });

    it('accepts customEvents with no-arg callback (empty tuple)', () => {
      const WithClick = (props: { onClick?: () => void }) => {
        void props;
        return null;
      };
      const meta = createAtom(WithClick, {
        name: 'WithClick',
        description: 'With click',
        props: {},
        customEvents: {
          onClick: [],
        },
      });
      expect(meta.customEvents).to.deep.equal({ onClick: [] });
    });

    it('accepts customEvents with optional param (union with undefined)', () => {
      const WithChange = (props: {
        onChange?: (value: string, extra?: number) => void;
      }) => {
        void props;
        return null;
      };
      const meta = createAtom(WithChange, {
        name: 'WithChange',
        description: 'With change',
        props: {},
        customEvents: {
          onChange: [z.string(), z.number().optional()],
        },
      });
      expect(meta.customEvents?.onChange).to.have.lengthOf(2);
    });

    it('passes through multiple customEvents', () => {
      const Multi = (props: {
        onA?: (x: string) => void;
        onB?: (y: number) => void;
      }) => {
        void props;
        return null;
      };
      const onASchemas = [z.string()];
      const onBSchemas = [z.number()];
      const meta = createAtom(Multi, {
        name: 'Multi',
        description: 'Multi',
        props: {},
        customEvents: { onA: onASchemas, onB: onBSchemas },
      });
      expect(meta.customEvents?.onA).to.equal(onASchemas);
      expect(meta.customEvents?.onB).to.equal(onBSchemas);
    });
  });
});
