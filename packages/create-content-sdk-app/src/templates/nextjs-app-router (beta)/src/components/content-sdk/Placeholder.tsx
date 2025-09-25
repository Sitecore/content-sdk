import { Placeholder, ServerPlaceholder } from '@sitecore-content-sdk/nextjs';
import { rsc } from 'rsc-env';
const AppPlaceholder = rsc ? ServerPlaceholder : Placeholder;

export default AppPlaceholder;
