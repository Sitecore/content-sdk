import { PlaceholderComponentProps } from './Placeholder';

export const knownPhProps = [
  'renderEmpty',
  'render',
  'renderEach',
  'errorComponent',
  'componentLoadingMessage',
  'modifyComponentProps',
  'missingComponentComponent',
  'hiddenRenderingComponent',
  'name',
  'rendering',
// eslint-disable-next-line prettier/prettier
] as const satisfies (keyof PlaceholderComponentProps)[];
