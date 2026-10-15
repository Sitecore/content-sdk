import { expect } from 'chai';
import { validateAtomsDocument } from './validate-document';

const validDocument = {
  name: 'hero',
  root: 'root',
  elements: {
    root: { type: 'Stack', props: {}, children: ['title'] },
    title: { type: 'Text', props: { text: 'Hello' }, children: [] },
  },
};

describe('validateAtomsDocument', () => {
  it('returns valid for a structurally correct document', () => {
    const result = validateAtomsDocument(validDocument);

    expect(result.valid).to.equal(true);
  });

  it('returns valid when props use state bindings', () => {
    const result = validateAtomsDocument({
      name: 'bound',
      root: 'root',
      elements: {
        root: {
          type: 'Text',
          props: { text: { $bindState: '/title' } },
          children: [],
        },
      },
      state: { title: 'Hello' },
    });

    expect(result.valid).to.equal(true);
  });

  it('fails when the document is missing', () => {
    const result = validateAtomsDocument(undefined);

    expect(result.valid).to.equal(false);
    if (!result.valid) {
      expect(result.error.issues[0].code).to.equal('empty_spec');
      expect(result.error.formatted).to.be.a('string');
      expect(result.error.formatted.length).to.be.greaterThan(0);
    }
  });

  it('fails when elements is missing', () => {
    const result = validateAtomsDocument({ name: 'empty', root: 'root' });

    expect(result.valid).to.equal(false);
    if (!result.valid) {
      expect(result.error.issues[0].code).to.equal('empty_spec');
    }
  });

  it('fails when the root element is not in the elements map', () => {
    const result = validateAtomsDocument({
      name: 'broken',
      root: 'missing',
      elements: {
        title: { type: 'Text', props: {}, children: [] },
      },
    });

    expect(result.valid).to.equal(false);
    if (!result.valid) {
      expect(result.error.issues.some((issue) => issue.code === 'root_not_found')).to.equal(true);
      expect(result.error.formatted).to.include('missing');
    }
  });

  it('fails when a child reference does not exist', () => {
    const result = validateAtomsDocument({
      name: 'dangling',
      root: 'root',
      elements: {
        root: { type: 'Stack', props: {}, children: ['ghost'] },
      },
    });

    expect(result.valid).to.equal(false);
    if (!result.valid) {
      expect(result.error.issues.some((issue) => issue.code === 'missing_child')).to.equal(true);
    }
  });

  it('fails when visible is placed inside props', () => {
    const result = validateAtomsDocument({
      name: 'misplaced',
      root: 'root',
      elements: {
        root: {
          type: 'Text',
          props: { visible: { $state: '/show' } },
          children: [],
        },
      },
    });

    expect(result.valid).to.equal(false);
    if (!result.valid) {
      expect(result.error.issues.some((issue) => issue.code === 'visible_in_props')).to.equal(true);
    }
  });
});
