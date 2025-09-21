import { rsc } from 'rsc-env';
import { Placeholder } from './Placeholder';
import { ServerPlaceholder } from './ServerPlaceholder';

const AppPlaceholder = rsc ? ServerPlaceholder : Placeholder;

// exporting actual implementation names for inner usage to avoid uncertainty
export { ServerPlaceholder } from './ServerPlaceholder';
export { Placeholder, PlaceholderComponent } from './Placeholder';
export { PlaceholderMetadata } from './PlaceholderMetadata';
export { PlaceholderProps } from './models';
export * from './placeholder-utils';
// exporting the server/client implementation for outer usage
export { AppPlaceholder };
