[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [utils](../README.md) / isServerSidePropsContext

# Function: isServerSidePropsContext()

> **isServerSidePropsContext**(`context`): `context is GetServerSidePropsContext`

Defined in: [nextjs/src/utils/utils.ts:61](https://github.com/Sitecore/content-sdk/blob/fa1b220318e1d79a584586c245a9c86d9072126e/packages/nextjs/src/utils/utils.ts#L61)

Determines whether context is GetServerSidePropsContext (SSR) or GetStaticPropsContext (SSG)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `GetServerSidePropsContext` \| `GetStaticPropsContext` |  |

## Returns

`context is GetServerSidePropsContext`
