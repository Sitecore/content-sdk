[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / fetchFEaaSComponentServerProps

# Function: fetchFEaaSComponentServerProps()

> **fetchFEaaSComponentServerProps**(`params`, `isPageStateNormal?`, `endpointOverride?`): `Promise`\<`FEaaSComponentServerProps` \| `null`\>

Defined in: [packages/react/src/components/FEaaS/feaas-utils.ts:37](https://github.com/Sitecore/content-sdk/blob/84b2ebcb77b1c88a88e7b2b7d4b9b7117148025d/packages/react/src/components/FEaaS/feaas-utils.ts#L37)

Fetches server component props required for server rendering, based on rendering params.
Component endpoint will either be retrieved from params or from endpointOverride

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`FEaaSComponentParams`](../type-aliases/FEaaSComponentParams.md) | component params |
| `isPageStateNormal?` | `boolean` | whether page is in normal mode |
| `endpointOverride?` | `string` | optional override for component endpoint |

## Returns

`Promise`\<`FEaaSComponentServerProps` \| `null`\>
