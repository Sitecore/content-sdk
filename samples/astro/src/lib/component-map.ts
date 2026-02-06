import type { AstroComponentMap } from '@sitecore-content-sdk/atro';

// Field components
import ContentBlock from '../components/ContentBlock.astro';
import RichTextComponent from '../components/RichText.astro';
import PageContent from '../components/PageContent.astro';
import Title from '../components/Title.astro';
import ImageComponent from '../components/Image.astro';
import Promo from '../components/Promo.astro';
import LinkList from '../components/LinkList.astro';

// Layout / placeholder components
import Container from '../components/Container.astro';
import ColumnSplitter from '../components/ColumnSplitter.astro';
import RowSplitter from '../components/RowSplitter.astro';
import PartialDesignDynamicPlaceholder from '../components/PartialDesignDynamicPlaceholder.astro';

// Interactive components
import Navigation from '../components/Navigation.astro';

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
