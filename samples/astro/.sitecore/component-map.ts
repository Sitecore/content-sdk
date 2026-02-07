import type { AstroComponentMap } from '@sitecore-content-sdk/astro';

// Field components
import ContentBlock from '../src/components/ContentBlock.astro';
import RichTextComponent from '../src/components/RichText.astro';
import PageContent from '../src/components/PageContent.astro';
import Title from '../src/components/Title.astro';
import ImageComponent from '../src/components/Image.astro';
import Promo from '../src/components/Promo.astro';
import LinkList from '../src/components/LinkList.astro';

// Layout / placeholder components
import Container from '../src/components/Container.astro';
import ColumnSplitter from '../src/components/ColumnSplitter.astro';
import RowSplitter from '../src/components/RowSplitter.astro';
import PartialDesignDynamicPlaceholder from '../src/components/PartialDesignDynamicPlaceholder.astro';

// Interactive components
import Navigation from '../src/components/Navigation.astro';

/**
 * Component map that maps Sitecore component names to Astro component implementations.
 * Register your Sitecore components here.
 */
const components: AstroComponentMap = new Map();

// Field components
components.set('ContentBlock', ContentBlock);
components.set('RichText', RichTextComponent);
components.set('PageContent', PageContent);
components.set('Title', Title);
components.set('Image', ImageComponent);
components.set('Promo', Promo);
components.set('LinkList', LinkList);

// Layout / placeholder components
components.set('Container', Container);
components.set('ColumnSplitter', ColumnSplitter);
components.set('RowSplitter', RowSplitter);
components.set('PartialDesignDynamicPlaceholder', PartialDesignDynamicPlaceholder);

// Interactive components
components.set('Navigation', Navigation);

export default components;
