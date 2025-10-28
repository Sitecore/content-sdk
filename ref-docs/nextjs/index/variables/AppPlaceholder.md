[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / AppPlaceholder

# Variable: AppPlaceholder()

> `const` **AppPlaceholder**: (`props`) => `string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`React.ReactNode`\> \| `Promise`\<`string` \| `number` \| `bigint` \| `boolean` \| `React.ReactPortal` \| `React.ReactElement`\<`unknown`, `string` \| `React.JSXElementConstructor`\<`any`\>\> \| `Iterable`\<`React.ReactNode`\>\> \| `React.JSX.Element` \| (`string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`React.ReactNode`\> \| `Promise`\<`string` \| `number` \| `bigint` \| `boolean` \| `React.ReactPortal` \| `React.ReactElement`\<`unknown`, `string` \| `React.JSXElementConstructor`\<`any`\>\> \| `Iterable`\<`React.ReactNode`\>\> \| `React.JSX.Element`)[]

Defined in: react/types/components/Placeholder/AppPlaceholder.d.ts:10

The implemention of placeholder compatible with React Server Components.
Renders components from the layout data for the given placeholder name, with consideration for page edit mode.
Pulls components from the provided component map.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | [`AppPlaceholderProps`](../interfaces/AppPlaceholderProps.md) | Placeholder props |

## Returns

`string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`React.ReactNode`\> \| `Promise`\<`string` \| `number` \| `bigint` \| `boolean` \| `React.ReactPortal` \| `React.ReactElement`\<`unknown`, `string` \| `React.JSXElementConstructor`\<`any`\>\> \| `Iterable`\<`React.ReactNode`\>\> \| `React.JSX.Element` \| (`string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`React.ReactNode`\> \| `Promise`\<`string` \| `number` \| `bigint` \| `boolean` \| `React.ReactPortal` \| `React.ReactElement`\<`unknown`, `string` \| `React.JSXElementConstructor`\<`any`\>\> \| `Iterable`\<`React.ReactNode`\>\> \| `React.JSX.Element`)[]

rendered component(s)
