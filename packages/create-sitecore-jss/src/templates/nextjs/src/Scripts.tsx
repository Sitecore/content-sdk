import { EditingScripts } from '@sitecore-jss/sitecore-jss-nextjs';
import CdpPageView from 'components/CdpPageView';

const Scripts = (): JSX.Element => {
  return (
    <>
      <CdpPageView />
      <EditingScripts />
    </>
  );
};

export default Scripts;
