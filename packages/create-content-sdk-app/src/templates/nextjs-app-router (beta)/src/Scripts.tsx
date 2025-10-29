'use client';
import { JSX } from 'react';
import { EditingScripts } from '@sitecore-content-sdk/nextjs';
import CdpPageView from 'components/content-sdk/CdpPageView';
import BYOCInit from './byoc';

const Scripts = (): JSX.Element => {
  return (
    <>
      <BYOCInit />
      <CdpPageView />
      <EditingScripts />
    </>
  );
};

export default Scripts;
