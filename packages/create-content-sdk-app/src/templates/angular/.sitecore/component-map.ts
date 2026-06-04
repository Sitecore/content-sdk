// Below are built-in components that are available in the app, it's recommended to keep them as is
import { AngularContentSdkComponent } from '@sitecore-content-sdk/angular';
import { ScFormComponent } from '@sitecore-content-sdk/angular';

// end of built-in components
import * as Titlecomponent from 'src/app/components/title.component';
import * as StructuredDatacomponent from 'src/app/components/structured-data.component';
import * as RowSplittercomponent from 'src/app/components/row-splitter.component';
import * as RichTextcomponent from 'src/app/components/rich-text.component';
import * as Promocomponent from 'src/app/components/promo.component';
import * as PartialDesignDynamicPlaceholdercomponent from 'src/app/components/partial-design-dynamic-placeholder.component';
import * as PageContentcomponent from 'src/app/components/page-content.component';
import * as Navigationcomponent from 'src/app/components/navigation.component';
import * as NavigationItemcomponent from 'src/app/components/navigation-item.component';
import * as LinkListcomponent from 'src/app/components/link-list.component';
import * as Imagecomponent from 'src/app/components/image.component';
import * as ContentBlockcomponent from 'src/app/components/content-block.component';
import * as Containercomponent from 'src/app/components/container.component';
import * as ColumnSplittercomponent from 'src/app/components/column-splitter.component';

export const componentMap = new Map<string, AngularContentSdkComponent>([
  ['Form', ScFormComponent],
  ['Title', { ...Titlecomponent }],
  ['StructuredData', { ...StructuredDatacomponent }],
  ['RowSplitter', { ...RowSplittercomponent }],
  ['RichText', { ...RichTextcomponent }],
  ['Promo', { ...Promocomponent }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholdercomponent }],
  ['PageContent', { ...PageContentcomponent }],
  ['Navigation', { ...Navigationcomponent }],
  ['NavigationItem', { ...NavigationItemcomponent }],
  ['LinkList', { ...LinkListcomponent }],
  ['Image', { ...Imagecomponent }],
  ['ContentBlock', { ...ContentBlockcomponent }],
  ['Container', { ...Containercomponent }],
  ['ColumnSplitter', { ...ColumnSplittercomponent }],
]);

export default componentMap;
