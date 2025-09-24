[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / ServerPlaceholder

# Variable: ServerPlaceholder()

> `const` **ServerPlaceholder**: (`props`) => `string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`React.ReactNode`\> \| `Promise`\<`string` \| `number` \| `bigint` \| `boolean` \| `React.ReactPortal` \| `React.ReactElement`\<`unknown`, `string` \| `React.JSXElementConstructor`\<`any`\>\> \| `Iterable`\<`React.ReactNode`\>\> \| `React.JSX.Element` \| (`string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`React.ReactNode`\> \| `Promise`\<`string` \| `number` \| `bigint` \| `boolean` \| `React.ReactPortal` \| `React.ReactElement`\<`unknown`, `string` \| `React.JSXElementConstructor`\<`any`\>\> \| `Iterable`\<`React.ReactNode`\>\> \| `React.JSX.Element`)[]

Defined in: react/types/components/Placeholder/ServerPlaceholder.d.ts:10

React Server Component implementation for Placeholder.
Renders components from the layout data for the given placeholder name, with consideration for page edit mode.
Pulls components from the provided component map.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | [`PlaceholderComponentProps`](../interfaces/PlaceholderComponentProps.md) | Placeholder props |

## Returns

`string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`React.ReactNode`\> \| `Promise`\<`string` \| `number` \| `bigint` \| `boolean` \| `React.ReactPortal` \| `React.ReactElement`\<`unknown`, `string` \| `React.JSXElementConstructor`\<`any`\>\> \| `Iterable`\<`React.ReactNode`\>\> \| `React.JSX.Element` \| (`string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`React.ReactNode`\> \| `Promise`\<`string` \| `number` \| `bigint` \| `boolean` \| `React.ReactPortal` \| `React.ReactElement`\<`unknown`, `string` \| `React.JSXElementConstructor`\<`any`\>\> \| `Iterable`\<`React.ReactNode`\>\> \| `React.JSX.Element`)[]

rendered component(s)
