'use client';
import { EditingScripts } from '@sitecore-content-sdk/nextjs';
import CdpPageView from 'components/CdpPageView';
import FEAASScripts from 'components/FEAASScripts';
import { JSX } from 'react';
import BYOC from 'src/byoc';

const Scripts = (): JSX.Element => {
  return (
    <>
      <BYOC />
      <FEAASScripts />
      <CdpPageView />
      <EditingScripts />
    </>
  );
};

export default Scripts;
