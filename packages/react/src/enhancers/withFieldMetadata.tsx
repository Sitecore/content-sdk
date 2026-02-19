import React, { ComponentType } from 'react';
import { FieldMetadata } from '../components/FieldMetadata';

interface WithMetadataProps {
  field?: {
    metadata?: { [key: string]: unknown };
  };
  editable?: boolean;
}

/**
 * Wraps the field component with metadata markup intended to be used for chromes hydration in Pages
 * @param {ComponentType<FieldComponentProps>} FieldComponent the field component
 * @param {boolean} isForwardRef set to 'true' if the ref prop should be explicitly accepted and forwarded
 * @public
 */
export function withFieldMetadata<
  FieldComponentProps extends WithMetadataProps,
  RefElementType = HTMLElement
>(FieldComponent: ComponentType<FieldComponentProps>, isForwardRef = false) {
  if (isForwardRef) {
    return (props: FieldComponentProps & { ref?: React.Ref<RefElementType> }) => {
      const { editable = true } = props;
      const metadata = props.field?.metadata;

      if (!metadata || !editable) {
        return <FieldComponent {...(props as FieldComponentProps)} />;
      }

      return (
        <FieldMetadata metadata={metadata}>
          <FieldComponent {...(props as FieldComponentProps)} />
        </FieldMetadata>
      );
    };
  }

  return (props: FieldComponentProps) => {
    const { editable = true } = props;
    const metadata = props.field?.metadata;

    if (!metadata || !editable) {
      return <FieldComponent {...props} />;
    }

    return (
      <FieldMetadata metadata={metadata}>
        <FieldComponent {...props} />
      </FieldMetadata>
    );
  };
}
