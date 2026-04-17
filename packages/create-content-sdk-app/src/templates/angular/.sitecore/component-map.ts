import type { Type } from '@angular/core';
import type { AngularModule, ComponentMap } from '@sitecore-content-sdk/angular';
import { ScFormComponent } from '@sitecore-content-sdk/angular';
import { TitleComponent } from 'components/title.component';
import { RichTextComponent } from 'components/rich-text.component';
import { ImageComponent } from 'components/image.component';
import { ContentBlockComponent } from 'components/content-block.component';
import { PromoComponent } from 'components/promo.component';
import { ContainerComponent } from 'components/container.component';
import { ColumnSplitterComponent } from 'components/column-splitter.component';
import { RowSplitterComponent } from 'components/row-splitter.component';
import { NavigationComponent } from 'components/navigation.component';
import { PageContentComponent } from 'components/page-content.component';
import { LinkListComponent } from 'components/link-list.component';

export const componentMap: ComponentMap = new Map<string, Type<unknown> | AngularModule>([
  ['Title', TitleComponent],
  ['RichText', RichTextComponent],
  ['Image', ImageComponent],
  ['ContentBlock', ContentBlockComponent],
  ['Promo', PromoComponent],
  ['Container', ContainerComponent],
  ['ColumnSplitter', ColumnSplitterComponent],
  ['RowSplitter', RowSplitterComponent],
  ['Navigation', NavigationComponent],
  ['PageContent', PageContentComponent],
  ['LinkList', LinkListComponent],
  ['PartialDesignDynamicPlaceholder', ContainerComponent],
  ['Form', ScFormComponent],
]);

export default componentMap;
