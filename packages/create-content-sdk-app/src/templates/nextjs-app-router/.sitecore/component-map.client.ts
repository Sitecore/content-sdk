// Client-safe component map for App Router
import {
  BYOCServerWrapper,
  NextjsContentSdkComponent,
  FEaaSServerWrapper,
} from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCServerWrapper],
  ['FEaaSWrapper', FEaaSServerWrapper],
  ['Form', Form],
]);

export default componentMap;
