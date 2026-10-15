import { formatSpecIssues, validateSpec, type Spec, type SpecIssue } from '@json-render/core';
import type { AtomsDocumentValidationError } from './types';

/**
 * Result of validating an atoms Document before render.
 * @internal
 */
export type ValidateAtomsDocumentResult =
  | { valid: true }
  | { valid: false; error: AtomsDocumentValidationError };

const toValidationError = (issues: SpecIssue[]): AtomsDocumentValidationError => ({
  issues,
  formatted: formatSpecIssues(issues),
});

const invalidDocumentError = (message: string): AtomsDocumentValidationError =>
  toValidationError([
    {
      severity: 'error',
      message,
      code: 'empty_spec',
    },
  ]);

/**
 * Validates an atoms Document with json-render's `validateSpec` before it is rendered.
 * Guards against missing/malformed documents so `validateSpec` is not called with invalid input.
 * @param {unknown} document - The Document received from Design Studio.
 * @returns Whether the Document is structurally valid, and the error payload when it is not.
 * @internal
 */
export function validateAtomsDocument(document: unknown): ValidateAtomsDocumentResult {
  if (!document || typeof document !== 'object') {
    return { valid: false, error: invalidDocumentError('Document is missing or invalid.') };
  }

  const spec = document as Spec;
  if (!spec.elements || typeof spec.elements !== 'object') {
    return { valid: false, error: invalidDocumentError('Spec has no elements.') };
  }

  const result = validateSpec(spec);
  if (!result.valid) {
    return { valid: false, error: toValidationError(result.issues) };
  }

  return { valid: true };
}
