/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { getEditingPreviewData } from './get-editing-preview-data';
import { EDITING_PARAMS_HEADER } from '../../editing/constants';

describe('getEditingPreviewData', () => {
  it('returns undefined when no request context is supplied', () => {
    expect(getEditingPreviewData(undefined)).toBeUndefined();
  });

  it('returns undefined when the editing header is missing', () => {
    expect(getEditingPreviewData({ headers: {} })).toBeUndefined();
  });

  it('parses preview data from the editing header', () => {
    const previewData = {
      site: 'demo',
      itemId: 'i',
      language: 'en',
      mode: 'edit',
      variantIds: ['_default'],
    };
    const ctx = { headers: { [EDITING_PARAMS_HEADER]: JSON.stringify(previewData) } };
    expect(getEditingPreviewData(ctx)).toEqual(previewData);
  });

  it('returns undefined on malformed JSON instead of throwing', () => {
    const ctx = { headers: { [EDITING_PARAMS_HEADER]: 'not json' } };
    expect(getEditingPreviewData(ctx)).toBeUndefined();
  });

  it('handles array-shaped header values', () => {
    const previewData = {
      site: 'demo',
      itemId: 'i',
      language: 'en',
      mode: 'edit',
      variantIds: ['_default'],
    };
    const ctx = { headers: { [EDITING_PARAMS_HEADER]: [JSON.stringify(previewData)] } };
    expect(getEditingPreviewData(ctx)).toEqual(previewData);
  });
});
