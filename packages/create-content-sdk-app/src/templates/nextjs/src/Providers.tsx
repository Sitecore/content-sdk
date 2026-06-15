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
