'use client';
import React, { createContext, useContext, ReactNode, JSX } from 'react';
import { ComponentPropsCollection } from '../sharedTypes/component-props';

/**
 * Component props context which we are using in order to store data fetched on components level (getComponentServerProps)
 * @public 
 */
export const ComponentPropsReactContext = createContext<ComponentPropsCollection>({});

/**
 * Hook in order to get access to props related to specific component. Data comes from ComponentPropsContext.
 * @see ComponentPropsContext
 * @param {string | undefined} componentUid component uId
 * @returns {ComponentData | undefined} component props
 * @public
 */
export function useComponentProps<ComponentData>(
  componentUid: string | undefined
): ComponentData | undefined {
  if (!componentUid) {
    return undefined;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const data = useContext(ComponentPropsReactContext);

  return data[componentUid] as ComponentData;
}

/**
 * The interface for the ComponentPropsContext component props.
 * @public
 */
export type ComponentPropsContextProps = {
  children: ReactNode;
  value: ComponentPropsCollection;
};

/**
 * The ComponentPropsContext component. Stores component props in a context.
 * @param {ComponentPropsContextProps} props component props
 * @public
 */
export const ComponentPropsContext = ({
  children,
  value,
}: ComponentPropsContextProps): JSX.Element => (
  <ComponentPropsReactContext.Provider value={value}>
    {children}
  </ComponentPropsReactContext.Provider>
);
