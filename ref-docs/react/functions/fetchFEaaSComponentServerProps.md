[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / fetchFEaaSComponentServerProps

# Function: fetchFEaaSComponentServerProps()

> **fetchFEaaSComponentServerProps**(`params`, `pageState?`, `endpointOverride?`): `Promise`\<[`FEaaSComponentProps`](../type-aliases/FEaaSComponentProps.md)\>

<<<<<<< HEAD
Defined in: [packages/react/src/components/FEaaSComponent.tsx:107](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/FEaaSComponent.tsx#L107)
=======
Defined in: [packages/react/src/components/FEaaSComponent.tsx:107](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/FEaaSComponent.tsx#L107)
>>>>>>> dd686bb50 (Update API docs)

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
