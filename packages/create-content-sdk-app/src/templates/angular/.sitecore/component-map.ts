// Below are built-in components that are available in the app, it's recommended to keep them as is
import { AngularContentSdkComponent } from '@sitecore-content-sdk/angular';

import { ScFormComponent } from '@sitecore-content-sdk/angular';
// end of built-in import section
import * as CdpPageViewcomponent from 'src/app/components/content-sdk/cdp-page-view.component';

export const componentMap = new Map<string, AngularContentSdkComponent>([
  ['Form', ScFormComponent],
  ['CdpPageView', { ...CdpPageViewcomponent }],
]);

export default componentMap;
