[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / AppPlaceholder

# Function: AppPlaceholder()

> **AppPlaceholder**(`props`): `undefined` \| `null` \| `string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element` \| (`undefined` \| `null` \| `string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element`)[]

Defined in: [packages/react/src/components/Placeholder/AppPlaceholder.tsx:23](https://github.com/Sitecore/content-sdk/blob/5bba152bc847537126fe2fd2483428b9b4251be0/packages/react/src/components/Placeholder/AppPlaceholder.tsx#L23)

The implemention of placeholder compatible with React Server Components.
Renders components from the layout data for the given placeholder name, with consideration for page edit mode.
Pulls components from the provided component map.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | [`AppPlaceholderProps`](../interfaces/AppPlaceholderProps.md) | Placeholder props |

## Returns

`undefined` \| `null` \| `string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element` \| (`undefined` \| `null` \| `string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element`)[]

rendered component(s)
