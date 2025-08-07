[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [utils](../README.md) / isServerSidePropsContext

# Function: isServerSidePropsContext()

> **isServerSidePropsContext**(`context`): `context is GetServerSidePropsContext`

Defined in: [nextjs/src/utils/utils.ts:61](https://github.com/Sitecore/content-sdk/blob/b5e6b15cea46ea739381f1bf5fbaaa2433c78d5f/packages/nextjs/src/utils/utils.ts#L61)

Determines whether context is GetServerSidePropsContext (SSR) or GetStaticPropsContext (SSG)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `GetServerSidePropsContext` \| `GetStaticPropsContext` |  |

## Returns

`context is GetServerSidePropsContext`