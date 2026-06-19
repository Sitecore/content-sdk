[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [utils](../README.md) / isServerSidePropsContext

# Function: isServerSidePropsContext()

> **isServerSidePropsContext**(`context`): `context is GetServerSidePropsContext`

Defined in: [nextjs/src/utils/utils.ts:70](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/nextjs/src/utils/utils.ts#L70)

Determines whether context is GetServerSidePropsContext (SSR) or GetStaticPropsContext (SSG)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `GetServerSidePropsContext` \| `GetStaticPropsContext` | - |

## Returns

`context is GetServerSidePropsContext`
