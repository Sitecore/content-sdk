import {
  ComponentPropsCollection,
  ComponentPropsContext,
  Page,
  SitecoreProvider,
} from '@sitecore-content-sdk/nextjs';
import components from '.sitecore/component-map';
import scConfig from 'sitecore.config';
import { catalog, registry } from 'src/atoms';
import { useRouter } from 'next/navigation';

/**
 * Atoms Design Library CSS (optional):
 * Document `className`s are not visible to Tailwind at build time. The same runtime
 * compile path used by the App Router starter works here too — it is not App Router–only.
 *
 * To enable styled Atoms Documents in Design Library on Pages Router:
 * 1. Add `@tailwindcss/node` (and a Tailwind stylesheet, if you do not already have one).
 * 2. Pass `compileCssAction: compileCssForDocumentAction` from
 *    `@sitecore-content-sdk/nextjs/server-actions` into `atomsConfig` below.
 * 3. Optionally register the compiler at startup via `registerTailwindCssCompiler`
 *    from `@sitecore-content-sdk/nextjs/instrumentation` (see the App Router
 *    `instrumentation.ts` / `instrumentation-node.ts` starter files).
 *
 * Without step 2, Atoms still render; Document-only utility classes simply will not
 * get compiled CSS during editing.
 */
const Providers = ({
  children,
  componentProps,
  page,
}: {
  children: React.ReactNode;
  componentProps?: ComponentPropsCollection;
  page: Page;
}) => {
  const router = useRouter();

  return (
    <ComponentPropsContext value={componentProps || {}}>
      <SitecoreProvider
        componentMap={components}
        api={scConfig.api}
        page={page}
        loadImportMap={() => import('.sitecore/import-map')}
        atomsConfig={{ catalog, registry, navigate: router.push }}
      >
        {children}
      </SitecoreProvider>
    </ComponentPropsContext>
  );
};

export default Providers;
