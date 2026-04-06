import type { Type } from '@angular/core';
import type { AngularModule, ComponentMap } from '@sitecore-content-sdk/angular';
import { TitleComponent } from './title.component';
import { RichTextComponent } from './rich-text.component';
import { ImageComponent } from './image.component';
import { ContentBlockComponent } from './content-block.component';
import { PromoComponent } from './promo.component';
import { ContainerComponent } from './container.component';
import { ColumnSplitterComponent } from './column-splitter.component';
import { RowSplitterComponent } from './row-splitter.component';
import { NavigationComponent } from './navigation.component';
import { PageContentComponent } from './page-content.component';
import { LinkListComponent } from './link-list.component';

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
]);

export default componentMap;
