import type { DesingLibraryAppProps } from '../components/DesignLibrary/models';

// Utility constant to identify if code is bundeled for RSC environment or client environment
declare const rsc: boolean;

declare function loadDesignLibraryRuntime(): Promise<{
  DesignLibraryRuntime: (props: DesingLibraryAppProps) => import('react').JSX.Element | null;
}>;

export { rsc, loadDesignLibraryRuntime };
