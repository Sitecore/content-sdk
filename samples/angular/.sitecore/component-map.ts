import { Type } from '@angular/core';

// Import all Sitecore components
import { ColumnSplitterComponent } from '../src/components/column-splitter/column-splitter.component';
import { ContainerComponent } from '../src/components/container/container.component';
import { ImageComponent } from '../src/components/image/image.component';
import { LinkListComponent } from '../src/components/link-list/link-list.component';
import { NavigationComponent } from '../src/components/navigation/navigation.component';
import { PageContentComponent } from '../src/components/page-content/page-content.component';
import { PartialDesignDynamicPlaceholderComponent } from '../src/components/partial-design-dynamic-placeholder/partial-design-dynamic-placeholder.component';
import { PromoComponent } from '../src/components/promo/promo.component';
import { RichTextComponent } from '../src/components/richtext/richtext.component';
import { RowSplitterComponent } from '../src/components/row-splitter/row-splitter.component';
import { TitleComponent } from '../src/components/title/title.component';

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
