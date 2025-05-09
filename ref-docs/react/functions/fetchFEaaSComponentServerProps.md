[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / fetchFEaaSComponentServerProps

# Function: fetchFEaaSComponentServerProps()

> **fetchFEaaSComponentServerProps**(`params`, `pageState?`, `endpointOverride?`): `Promise`\<[`FEaaSComponentProps`](../type-aliases/FEaaSComponentProps.md)\>

Defined in: [packages/react/src/components/FEaaSComponent.tsx:107](https://github.com/Sitecore/content-sdk/blob/c289d37ee6e0b2977eac77610a76c55b74b88d57/packages/react/src/components/FEaaSComponent.tsx#L107)

Fetches server component props required for server rendering, based on rendering params.
Component endpoint will either be retrieved from params or from endpointOverride

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`FEaaSComponentParams`](../type-aliases/FEaaSComponentParams.md) | component params |
| `pageState?` | [`LayoutServicePageState`](../enumerations/LayoutServicePageState.md) | page state to determine which component variant to use |
| `endpointOverride?` | `string` | optional override for component endpoint |

## Returns

`Promise`\<[`FEaaSComponentProps`](../type-aliases/FEaaSComponentProps.md)\>
