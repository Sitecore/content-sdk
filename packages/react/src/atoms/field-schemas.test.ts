import { expect } from 'chai';
import { z } from 'zod';
import { getFieldMeta } from './schema-utils';
import { createAtom } from './createAtom';
import {
  textFieldSchema,
  richTextFieldSchema,
  dateFieldSchema,
  linkFieldSchema,
  imageFieldSchema,
  fileFieldSchema,
  type TextFieldSchema,
  type RichTextFieldSchema,
  type DateFieldSchema,
  type LinkFieldSchema,
  type ImageFieldSchema,
  type FileFieldSchema,
} from './field-schemas';

describe('field-schemas', () => {
  const factories = [
    { name: 'textFieldSchema', factory: textFieldSchema, control: 'Single-Line Text' },
    { name: 'richTextFieldSchema', factory: richTextFieldSchema, control: 'Rich Text' },
    { name: 'dateFieldSchema', factory: dateFieldSchema, control: 'Date' },
    { name: 'linkFieldSchema', factory: linkFieldSchema, control: 'Link' },
    { name: 'imageFieldSchema', factory: imageFieldSchema, control: 'Image' },
    { name: 'fileFieldSchema', factory: fileFieldSchema, control: 'File' },
  ];

  factories.forEach(({ name, factory, control }) => {
    describe(name, () => {
      it('returns a ZodObject', () => {
        expect(factory()).to.be.instanceOf(z.ZodObject);
      });

      it(`has control hint "${control}"`, () => {
        const meta = getFieldMeta(factory());
        expect(meta).to.deep.equal({ control });
      });

      it('preserves control hint when extra shape is provided', () => {
        const meta = getFieldMeta(factory({ extra: z.string() }));
        expect(meta).to.deep.equal({ control });
      });

      it('includes extra shape in the schema', () => {
        const schema = factory({ extra: z.string() });
        expect(schema.shape).to.have.property('extra');
      });
    });
  });

  describe('textFieldSchema', () => {
    it('parses a valid text field', () => {
      expect(() => textFieldSchema().parse({ value: 'hello' })).not.to.throw();
    });

    it('parses a numeric value', () => {
      expect(() => textFieldSchema().parse({ value: 42 })).not.to.throw();
    });

    it('parses with no value', () => {
      expect(() => textFieldSchema().parse({})).not.to.throw();
    });
  });

  describe('richTextFieldSchema', () => {
    it('parses a valid rich text field', () => {
      expect(() => richTextFieldSchema().parse({ value: '<p>hello</p>' })).not.to.throw();
    });

    it('parses with no value', () => {
      expect(() => richTextFieldSchema().parse({})).not.to.throw();
    });
  });

  describe('dateFieldSchema', () => {
    it('parses a valid date field', () => {
      expect(() => dateFieldSchema().parse({ value: '20231025T120000Z' })).not.to.throw();
    });

    it('parses with no value', () => {
      expect(() => dateFieldSchema().parse({})).not.to.throw();
    });
  });

  describe('linkFieldSchema', () => {
    it('parses a valid link field', () => {
      expect(() =>
        linkFieldSchema().parse({ value: { href: '/about', text: 'About', target: '_blank' } })
      ).not.to.throw();
    });

    it('parses an empty value object', () => {
      expect(() => linkFieldSchema().parse({ value: {} })).not.to.throw();
    });

    it('passes through unknown attributes on the value', () => {
      const result = linkFieldSchema().parse({
        value: { href: '/', 'data-custom': 'foo' },
      }) as LinkFieldSchema & { value: Record<string, unknown> };
      expect(result.value['data-custom']).to.equal('foo');
    });
  });

  describe('imageFieldSchema', () => {
    it('parses a valid image field', () => {
      expect(() =>
        imageFieldSchema().parse({
          value: { src: '/img.png', alt: 'An image', width: 100, height: 200 },
        })
      ).not.to.throw();
    });

    it('parses with no value', () => {
      expect(() => imageFieldSchema().parse({})).not.to.throw();
    });

    it('passes through unknown attributes on the value', () => {
      const result = imageFieldSchema().parse({
        value: { src: '/img.png', 'data-id': '1' },
      }) as ImageFieldSchema & { value: Record<string, unknown> };
      expect(result.value['data-id']).to.equal('1');
    });
  });

  describe('fileFieldSchema', () => {
    it('parses a valid file field', () => {
      expect(() =>
        fileFieldSchema().parse({ value: { src: '/doc.pdf', title: 'My Doc', displayName: 'doc' } })
      ).not.to.throw();
    });

    it('parses an empty value object', () => {
      expect(() => fileFieldSchema().parse({ value: {} })).not.to.throw();
    });

    it('passes through unknown properties on the value', () => {
      const result = fileFieldSchema().parse({
        value: { src: '/doc.pdf', customProp: 'bar' },
      }) as FileFieldSchema & { value: Record<string, unknown> };
      expect(result.value.customProp).to.equal('bar');
    });
  });

  describe('createAtom integration', () => {
    const CardComponent = (props: {
      title?: TextFieldSchema;
      body?: RichTextFieldSchema;
      cta?: LinkFieldSchema;
      image?: ImageFieldSchema;
      doc?: FileFieldSchema;
      publishedAt?: DateFieldSchema;
    }) => {
      void props;
      return null;
    };

    it('accepts textFieldSchema as a prop schema in createAtom', () => {
      const meta = createAtom(CardComponent, {
        name: 'Card',
        description: 'A card atom',
        props: { title: textFieldSchema() },
      });
      expect(meta.props).to.be.instanceOf(z.ZodObject);
      const parsed = meta.props.safeParse({ title: { value: 'Hello' } });
      expect(parsed.success).to.equal(true);
    });

    it('accepts richTextFieldSchema as a prop schema in createAtom', () => {
      const meta = createAtom(CardComponent, {
        name: 'Card',
        description: 'A card atom',
        props: { body: richTextFieldSchema() },
      });
      const parsed = meta.props.safeParse({ body: { value: '<p>content</p>' } });
      expect(parsed.success).to.equal(true);
    });

    it('accepts linkFieldSchema as a prop schema in createAtom', () => {
      const meta = createAtom(CardComponent, {
        name: 'Card',
        description: 'A card atom',
        props: { cta: linkFieldSchema() },
      });
      const parsed = meta.props.safeParse({ cta: { value: { href: '/about', text: 'About' } } });
      expect(parsed.success).to.equal(true);
    });

    it('accepts imageFieldSchema as a prop schema in createAtom', () => {
      const meta = createAtom(CardComponent, {
        name: 'Card',
        description: 'A card atom',
        props: { image: imageFieldSchema() },
      });
      const parsed = meta.props.safeParse({ image: { value: { src: '/img.png', alt: 'Alt' } } });
      expect(parsed.success).to.equal(true);
    });

    it('accepts fileFieldSchema as a prop schema in createAtom', () => {
      const meta = createAtom(CardComponent, {
        name: 'Card',
        description: 'A card atom',
        props: { doc: fileFieldSchema() },
      });
      const parsed = meta.props.safeParse({ doc: { value: { src: '/file.pdf', title: 'Doc' } } });
      expect(parsed.success).to.equal(true);
    });

    it('accepts dateFieldSchema as a prop schema in createAtom', () => {
      const meta = createAtom(CardComponent, {
        name: 'Card',
        description: 'A card atom',
        props: { publishedAt: dateFieldSchema() },
      });
      const parsed = meta.props.safeParse({ publishedAt: { value: '20240101T000000Z' } });
      expect(parsed.success).to.equal(true);
    });

    it('preserves control hint on field schemas inside createAtom props', () => {
      const meta = createAtom(CardComponent, {
        name: 'Card',
        description: 'A card atom',
        props: { cta: linkFieldSchema() },
      });
      const ctaShape = meta.props.shape.cta as z.ZodType;
      expect(getFieldMeta(ctaShape)).to.deep.equal({ control: 'Link' });
    });
  });
});

