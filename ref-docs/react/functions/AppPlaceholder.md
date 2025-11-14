[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / AppPlaceholder

# Function: AppPlaceholder()

> **AppPlaceholder**(`props`): `string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element` \| (`string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element`)[]

Defined in: [packages/react/src/components/Placeholder/AppPlaceholder.tsx:22](https://github.com/Sitecore/content-sdk/blob/8edf285d0686676f7abb43d86b8726921ea7685d/packages/react/src/components/Placeholder/AppPlaceholder.tsx#L22)

The implemention of placeholder compatible with React Server Components.
Renders components from the layout data for the given placeholder name, with consideration for page edit mode.
Pulls components from the provided component map.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | [`AppPlaceholderProps`](../interfaces/AppPlaceholderProps.md) | Placeholder props |

## Returns

`string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element` \| (`string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element`)[]

rendered component(s)
