import { Type } from '@angular/core';

// Import all Sitecore components
import { ColumnSplitterComponent } from '../src/app/components/column-splitter/column-splitter.component';
import { ContainerComponent } from '../src/app/components/container/container.component';
import { ImageComponent } from '../src/app/components/image/image.component';
import { LinkListComponent } from '../src/app/components/link-list/link-list.component';
import { NavigationComponent } from '../src/app/components/navigation/navigation.component';
import { PageContentComponent } from '../src/app/components/page-content/page-content.component';
import { PartialDesignDynamicPlaceholderComponent } from '../src/app/components/partial-design-dynamic-placeholder/partial-design-dynamic-placeholder.component';
import { PromoComponent } from '../src/app/components/promo/promo.component';
import { RichTextComponent } from '../src/app/components/richtext/richtext.component';
import { RowSplitterComponent } from '../src/app/components/row-splitter/row-splitter.component';
import { TitleComponent } from '../src/app/components/title/title.component';

/**
 * Component map for Sitecore components.
 * Maps Sitecore component names to Angular component classes.
 * The key should match the component name in Sitecore.
 */
export const componentMap = new Map<string, Type<unknown>>([
  // Layout components
  ['ColumnSplitter', ColumnSplitterComponent],
  ['Container', ContainerComponent],
  ['RowSplitter', RowSplitterComponent],
  ['PartialDesignDynamicPlaceholder', PartialDesignDynamicPlaceholderComponent],

  // Content components
  ['Image', ImageComponent],
  ['LinkList', LinkListComponent],
  ['Navigation', NavigationComponent],
  ['PageContent', PageContentComponent],
  ['Promo', PromoComponent],
  ['RichText', RichTextComponent],
  ['Title', TitleComponent],
]);
