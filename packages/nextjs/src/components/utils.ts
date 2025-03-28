import dynamic, { DynamicOptions } from 'next/dynamic';
import { ComponentType } from 'react';
import { NextjsComponent } from '../sharedTypes/component-props';

export const dynamicWithComponentProps = (
  component: () => Promise<NextjsComponent>,
  options?: DynamicOptions
) => ({
  dynamicModule: component,
  // type match to make next happy
  default: dynamic((component as unknown) as Promise<ComponentType>, options),
});
