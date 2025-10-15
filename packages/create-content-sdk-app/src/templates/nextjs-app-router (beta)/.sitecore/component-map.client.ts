// Client-safe component map for App Router
import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

<% if (starterType === 'skatepark') { -%>
// Skatepark starter components
import { Hero } from 'src/components/skatepark/Hero';
import { Navigation } from 'src/components/skatepark/Navigation';
import { Footer } from 'src/components/skatepark/Footer';
import { ProductCard } from 'src/components/skatepark/ProductCard';
import { Title } from 'src/components/skatepark/Title';
import { RichText } from 'src/components/skatepark/RichText';
import { Image } from 'src/components/skatepark/Image';
import { Promo } from 'src/components/skatepark/Promo';
import { ContentBlock } from 'src/components/skatepark/ContentBlock';
import { Container } from 'src/components/skatepark/Container';
<% } -%>

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
<% if (starterType === 'skatepark') { -%>
  ['Hero', Hero],
  ['Navigation', Navigation],
  ['Footer', Footer],
  ['ProductCard', ProductCard],
  ['Title', Title],
  ['RichText', RichText],
  ['Image', Image],
  ['Promo', Promo],
  ['ContentBlock', ContentBlock],
  ['Container', Container],
<% } -%>
]);

export default componentMap;
