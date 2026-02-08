import {
  isFieldValueEmpty,
  type FieldMetadata,
  type GenericFieldValue,
  type Field,
} from '@sitecore-content-sdk/content/layout';

/**
 * Result of resolving field editing state.
 * @public
 */
export interface FieldEditingState {
  /** Whether the field has metadata and is editable. */
  hasMetadata: boolean;
  /** Whether the field value is empty. */
  isEmpty: boolean;
  /** Whether the empty field editing placeholder should be shown. */
  showEmptyEditing: boolean;
}

/**
 * Resolve the editing state for a field component.
 * Determines whether metadata should be rendered, whether the field is empty,
 * and whether the empty field editing placeholder should be shown.
 * @param {object | null | undefined} field the field data, possibly with metadata
 * @param {boolean} editable whether editing is enabled for this field
 * @returns {FieldEditingState} the resolved editing state
 * @public
 */
export function resolveFieldEditingState(
  field: (FieldMetadata & Partial<Field<GenericFieldValue>>) | null | undefined,
  editable: boolean
): FieldEditingState {
  const hasMetadata = editable && !!field?.metadata;
  const isEmpty = isFieldValueEmpty(field);
  const showEmptyEditing = hasMetadata && isEmpty;

  return { hasMetadata, isEmpty, showEmptyEditing };
}
