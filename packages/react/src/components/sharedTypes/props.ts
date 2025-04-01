/**
 * Shared editing field props
 */
export interface EditableFieldProps {
  /**
   * Can be used to explicitly disable inline editing.
   * @default true
   */
  editable?: boolean;
  /**
   * Custom element to render in Pages in edit mode if field value is empty
   */
  emptyFieldEditingComponent?: React.ComponentClass<unknown> | React.FC<unknown>;
}
