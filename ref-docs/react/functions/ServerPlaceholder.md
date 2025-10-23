[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / ServerPlaceholder

# Function: ServerPlaceholder()

> **ServerPlaceholder**(`props`): `string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element` \| (`string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element`)[]

Defined in: [packages/react/src/components/Placeholder/ServerPlaceholder.tsx:20](https://github.com/Sitecore/content-sdk/blob/272d88b6498b3e929c9ee618271795d978073c6f/packages/react/src/components/Placeholder/ServerPlaceholder.tsx#L20)

React Server Component implementation for Placeholder.
Renders components from the layout data for the given placeholder name, with consideration for page edit mode.
Pulls components from the provided component map.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | [`PlaceholderProps`](../interfaces/PlaceholderProps.md) | Placeholder props |

## Returns

`string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element` \| (`string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element`)[]

rendered component(s)
