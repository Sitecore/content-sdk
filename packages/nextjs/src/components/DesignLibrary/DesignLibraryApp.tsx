import React from 'react';
import { DesignLibraryApp as ReactDesignLibraryApp } from '@sitecore-content-sdk/react';
import {
  previewComponentAction,
  updateComponentAction,
} from '../../server-actions/update-server-component-action';

type DesignLibraryAppProps = Parameters<typeof ReactDesignLibraryApp>[0];

/**
 * Next.js Design Library entry. Passes server actions that authorize the editing
 * secret header into the React Design Library. The React package keeps empty
 * default actions and uses these props instead.
 * @param {DesignLibraryAppProps} props - Design Library app props from the sample layout.
 * @returns The Design Library tree, or null when the page has no route.
 * @public
 */
export const DesignLibraryApp = async (
  props: DesignLibraryAppProps
): Promise<React.JSX.Element | null> => {
  return (
    <ReactDesignLibraryApp
      {...props}
      updateComponentAction={updateComponentAction}
      previewComponentAction={previewComponentAction}
    />
  );
};

export default DesignLibraryApp;
